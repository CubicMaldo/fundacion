-- ============================================================================
-- Migración: Académico v2 + endurecimiento de seguridad
-- Fecha: 2026-10-14
--  * Corrige escalamiento de privilegios (un usuario podía cambiar su propio rol,
--    y el registro público asignaba rol 'editor' / 'admin' vía metadata).
--  * Corrige recursión de RLS entre cursos <-> matriculas usando helpers SECURITY DEFINER.
--  * Reemplaza evaluaciones_notas (por estudiante) por una malla de evaluación por curso:
--    componentes_evaluacion (nombre + porcentaje) y calificaciones (nota por estudiante).
--  * Nota definitiva/acumulada calculada automáticamente por trigger.
--  * Columnas de notificación por correo en inscripciones y mensajes.
-- ============================================================================

-- 1. FUNCIONES DE ROL ENDURECIDAS ---------------------------------------------
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS usuario TEXT,
  ADD COLUMN IF NOT EXISTS documento TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS uq_perfiles_usuario ON public.perfiles (lower(usuario)) WHERE usuario IS NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN rol SET DEFAULT 'estudiante';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.perfiles WHERE id = auth.uid() AND rol = 'admin' AND activo);
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.perfiles WHERE id = auth.uid() AND rol IN ('admin', 'editor') AND activo);
$$;

ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- El rol solo se toma de raw_app_meta_data (solo escribible con service_role), nunca de user_metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role public.app_role := 'estudiante';
  v_meta_role TEXT := NEW.raw_app_meta_data->>'rol';
BEGIN
  IF v_meta_role IN ('admin', 'editor', 'docente', 'estudiante') THEN
    v_role := v_meta_role::public.app_role;
  END IF;

  INSERT INTO public.perfiles (id, email, nombre_completo, rol, usuario, documento, telefono)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', split_part(NEW.email, '@', 1)),
    v_role,
    NULLIF(NEW.raw_app_meta_data->>'usuario', ''),
    NULLIF(NEW.raw_user_meta_data->>'documento', ''),
    NULLIF(NEW.raw_user_meta_data->>'telefono', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user falló para %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Bloquea que un usuario no-admin cambie rol / usuario / estado / email en su propio perfil.
CREATE OR REPLACE FUNCTION public.proteger_campos_perfil()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() AND (
       NEW.rol IS DISTINCT FROM OLD.rol
    OR NEW.usuario IS DISTINCT FROM OLD.usuario
    OR NEW.activo IS DISTINCT FROM OLD.activo
    OR NEW.email IS DISTINCT FROM OLD.email
    OR NEW.documento IS DISTINCT FROM OLD.documento
  ) THEN
    RAISE EXCEPTION 'No autorizado para modificar campos administrativos del perfil' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_campos_perfil ON public.perfiles;
CREATE TRIGGER trg_proteger_campos_perfil
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_perfil();

DROP TRIGGER IF EXISTS set_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER set_perfiles_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. MALLA DE EVALUACIÓN ------------------------------------------------------
ALTER TABLE public.cursos
  ADD COLUMN IF NOT EXISTS nota_minima_aprobacion NUMERIC(3, 2) NOT NULL DEFAULT 3.0
    CHECK (nota_minima_aprobacion BETWEEN 0 AND 5),
  ADD COLUMN IF NOT EXISTS descripcion TEXT;

DROP TABLE IF EXISTS public.evaluaciones_notas;

CREATE TABLE IF NOT EXISTS public.componentes_evaluacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL CHECK (char_length(trim(nombre)) BETWEEN 1 AND 120),
  descripcion TEXT,
  porcentaje NUMERIC(5, 2) NOT NULL CHECK (porcentaje > 0 AND porcentaje <= 100),
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.calificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  componente_id UUID NOT NULL REFERENCES public.componentes_evaluacion(id) ON DELETE CASCADE,
  matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
  nota NUMERIC(3, 2) NOT NULL CHECK (nota >= 0 AND nota <= 5),
  retroalimentacion TEXT,
  calificado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_calificacion UNIQUE (componente_id, matricula_id)
);

CREATE INDEX IF NOT EXISTS idx_componentes_curso ON public.componentes_evaluacion(curso_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_matricula ON public.calificaciones(matricula_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_componente ON public.calificaciones(componente_id);

DROP TRIGGER IF EXISTS set_componentes_updated_at ON public.componentes_evaluacion;
CREATE TRIGGER set_componentes_updated_at BEFORE UPDATE ON public.componentes_evaluacion
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_calificaciones_updated_at ON public.calificaciones;
CREATE TRIGGER set_calificaciones_updated_at BEFORE UPDATE ON public.calificaciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- La suma de porcentajes de la malla de un curso no puede exceder 100.
CREATE OR REPLACE FUNCTION public.validar_malla_porcentajes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(porcentaje), 0) INTO v_total
  FROM public.componentes_evaluacion WHERE curso_id = NEW.curso_id;
  IF v_total > 100 THEN
    RAISE EXCEPTION 'La malla suma % por ciento y no puede superar 100', v_total USING ERRCODE = '23514';
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_malla ON public.componentes_evaluacion;
CREATE CONSTRAINT TRIGGER trg_validar_malla
  AFTER INSERT OR UPDATE ON public.componentes_evaluacion
  DEFERRABLE INITIALLY IMMEDIATE
  FOR EACH ROW EXECUTE FUNCTION public.validar_malla_porcentajes();

-- La calificación debe pertenecer a un componente del mismo curso de la matrícula.
CREATE OR REPLACE FUNCTION public.validar_calificacion_curso()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.componentes_evaluacion ce
    JOIN public.matriculas m ON m.curso_id = ce.curso_id
    WHERE ce.id = NEW.componente_id AND m.id = NEW.matricula_id
  ) THEN
    RAISE EXCEPTION 'El componente evaluativo no pertenece al curso de la matrícula' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_calificacion ON public.calificaciones;
CREATE TRIGGER trg_validar_calificacion
  BEFORE INSERT OR UPDATE OF componente_id, matricula_id ON public.calificaciones
  FOR EACH ROW EXECUTE FUNCTION public.validar_calificacion_curso();

-- Nota acumulada/definitiva = Σ(nota × porcentaje) / 100 de los componentes calificados.
CREATE OR REPLACE FUNCTION public.recalcular_nota_definitiva(p_matricula UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.matriculas m
  SET nota_definitiva = (
    SELECT ROUND(SUM(c.nota * ce.porcentaje) / 100.0, 2)
    FROM public.calificaciones c
    JOIN public.componentes_evaluacion ce ON ce.id = c.componente_id
    WHERE c.matricula_id = p_matricula
  )
  WHERE m.id = p_matricula;
$$;

CREATE OR REPLACE FUNCTION public.trg_recalcular_por_calificacion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    PERFORM public.recalcular_nota_definitiva(OLD.matricula_id);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.recalcular_nota_definitiva(NEW.matricula_id);
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_calificaciones_recalcular ON public.calificaciones;
CREATE TRIGGER trg_calificaciones_recalcular
  AFTER INSERT OR UPDATE OR DELETE ON public.calificaciones
  FOR EACH ROW EXECUTE FUNCTION public.trg_recalcular_por_calificacion();

CREATE OR REPLACE FUNCTION public.trg_recalcular_por_componente()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recalcular_nota_definitiva(m.id)
  FROM public.matriculas m WHERE m.curso_id = NEW.curso_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_componentes_recalcular ON public.componentes_evaluacion;
CREATE TRIGGER trg_componentes_recalcular
  AFTER UPDATE OF porcentaje ON public.componentes_evaluacion
  FOR EACH ROW EXECUTE FUNCTION public.trg_recalcular_por_componente();

-- Un docente solo puede cambiar el estado de una matrícula; no reasignarla.
CREATE OR REPLACE FUNCTION public.proteger_matricula()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() AND (
       NEW.estudiante_id IS DISTINCT FROM OLD.estudiante_id
    OR NEW.curso_id IS DISTINCT FROM OLD.curso_id
    OR NEW.fecha_matricula IS DISTINCT FROM OLD.fecha_matricula
  ) THEN
    RAISE EXCEPTION 'No autorizado para reasignar la matrícula' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_matricula ON public.matriculas;
CREATE TRIGGER trg_proteger_matricula
  BEFORE UPDATE ON public.matriculas
  FOR EACH ROW EXECUTE FUNCTION public.proteger_matricula();

-- 3. HELPERS DE AUTORIZACIÓN (evitan recursión de RLS) -----------------------
CREATE OR REPLACE FUNCTION public.es_docente_de_curso(p_curso UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.cursos WHERE id = p_curso AND docente_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.esta_matriculado(p_curso UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.matriculas WHERE curso_id = p_curso AND estudiante_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.es_mi_matricula(p_matricula UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.matriculas WHERE id = p_matricula AND estudiante_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.es_docente_de_matricula(p_matricula UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas m JOIN public.cursos c ON c.id = m.curso_id
    WHERE m.id = p_matricula AND c.docente_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.comparte_curso(p_perfil UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas m JOIN public.cursos c ON c.id = m.curso_id
    WHERE (c.docente_id = auth.uid() AND m.estudiante_id = p_perfil)
       OR (m.estudiante_id = auth.uid() AND c.docente_id = p_perfil)
  );
$$;

CREATE OR REPLACE FUNCTION public.ruta_evidencia_matricula(p_name TEXT)
RETURNS UUID LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  RETURN split_part(p_name, '/', 1)::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- Cierre de curso: asigna aprobado/reprobado según nota mínima. Requiere malla al 100%.
CREATE OR REPLACE FUNCTION public.cerrar_curso(p_curso UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total NUMERIC;
  v_minima NUMERIC;
  v_filas INT;
BEGIN
  IF NOT (public.is_admin() OR public.es_docente_de_curso(p_curso)) THEN
    RAISE EXCEPTION 'No autorizado' USING ERRCODE = '42501';
  END IF;
  SELECT COALESCE(SUM(porcentaje), 0) INTO v_total FROM public.componentes_evaluacion WHERE curso_id = p_curso;
  IF v_total <> 100 THEN
    RAISE EXCEPTION 'La malla de evaluación suma % por ciento y debe sumar exactamente 100', v_total USING ERRCODE = '23514';
  END IF;
  SELECT nota_minima_aprobacion INTO v_minima FROM public.cursos WHERE id = p_curso;
  UPDATE public.matriculas
  SET estado = CASE WHEN COALESCE(nota_definitiva, 0) >= v_minima THEN 'aprobado' ELSE 'reprobado' END
  WHERE curso_id = p_curso AND estado = 'cursando';
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RETURN v_filas;
END;
$$;

-- 4. POLÍTICAS RLS ------------------------------------------------------------
-- Eliminar todas las políticas previas de las tablas académicas y perfiles.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('perfiles', 'cursos', 'matriculas', 'entregas_trabajos', 'observaciones_academicas')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

ALTER TABLE public.componentes_evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;

-- perfiles
CREATE POLICY perfiles_admin_all ON public.perfiles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY perfiles_select_propio ON public.perfiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.comparte_curso(id));
CREATE POLICY perfiles_update_propio ON public.perfiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- cursos
CREATE POLICY cursos_admin_all ON public.cursos FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY cursos_select ON public.cursos FOR SELECT TO authenticated
  USING (docente_id = auth.uid() OR public.esta_matriculado(id));

-- matriculas
CREATE POLICY matriculas_admin_all ON public.matriculas FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY matriculas_select ON public.matriculas FOR SELECT TO authenticated
  USING (estudiante_id = auth.uid() OR public.es_docente_de_curso(curso_id));
CREATE POLICY matriculas_docente_update ON public.matriculas FOR UPDATE TO authenticated
  USING (public.es_docente_de_curso(curso_id)) WITH CHECK (public.es_docente_de_curso(curso_id));

-- componentes_evaluacion (malla)
CREATE POLICY componentes_admin_all ON public.componentes_evaluacion FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY componentes_docente_all ON public.componentes_evaluacion FOR ALL TO authenticated
  USING (public.es_docente_de_curso(curso_id)) WITH CHECK (public.es_docente_de_curso(curso_id));
CREATE POLICY componentes_estudiante_select ON public.componentes_evaluacion FOR SELECT TO authenticated
  USING (public.esta_matriculado(curso_id));

-- calificaciones
CREATE POLICY calificaciones_admin_all ON public.calificaciones FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY calificaciones_docente_all ON public.calificaciones FOR ALL TO authenticated
  USING (public.es_docente_de_matricula(matricula_id)) WITH CHECK (public.es_docente_de_matricula(matricula_id));
CREATE POLICY calificaciones_estudiante_select ON public.calificaciones FOR SELECT TO authenticated
  USING (public.es_mi_matricula(matricula_id));

-- entregas_trabajos
CREATE POLICY entregas_admin_all ON public.entregas_trabajos FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY entregas_estudiante_select ON public.entregas_trabajos FOR SELECT TO authenticated
  USING (public.es_mi_matricula(matricula_id));
CREATE POLICY entregas_estudiante_insert ON public.entregas_trabajos FOR INSERT TO authenticated
  WITH CHECK (public.es_mi_matricula(matricula_id) AND nota IS NULL AND estado = 'entregado');
CREATE POLICY entregas_docente_select ON public.entregas_trabajos FOR SELECT TO authenticated
  USING (public.es_docente_de_matricula(matricula_id));
CREATE POLICY entregas_docente_update ON public.entregas_trabajos FOR UPDATE TO authenticated
  USING (public.es_docente_de_matricula(matricula_id)) WITH CHECK (public.es_docente_de_matricula(matricula_id));

-- observaciones_academicas
CREATE POLICY observaciones_admin_all ON public.observaciones_academicas FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY observaciones_docente_all ON public.observaciones_academicas FOR ALL TO authenticated
  USING (public.es_docente_de_matricula(matricula_id)) WITH CHECK (public.es_docente_de_matricula(matricula_id));
CREATE POLICY observaciones_estudiante_select ON public.observaciones_academicas FOR SELECT TO authenticated
  USING (public.es_mi_matricula(matricula_id));

-- storage: evidencias privadas, solo dueño / docente / admin
DROP POLICY IF EXISTS "Acceso a evidencias para usuarios autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Subida de evidencias para usuarios autenticados" ON storage.objects;
DROP POLICY IF EXISTS evidencias_select ON storage.objects;
DROP POLICY IF EXISTS evidencias_insert ON storage.objects;

CREATE POLICY evidencias_select ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'evidencias-academicas' AND (
      public.is_admin()
      OR public.es_mi_matricula(public.ruta_evidencia_matricula(name))
      OR public.es_docente_de_matricula(public.ruta_evidencia_matricula(name))
    )
  );
CREATE POLICY evidencias_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'evidencias-academicas'
    AND public.es_mi_matricula(public.ruta_evidencia_matricula(name))
  );

-- 5. INSCRIPCIONES / MENSAJES: validación en frontera + notificación ---------
ALTER TABLE public.inscripciones
  ADD COLUMN IF NOT EXISTS modalidad TEXT,
  ADD COLUMN IF NOT EXISTS mensaje TEXT,
  ADD COLUMN IF NOT EXISTS acepta_tratamiento_datos BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notificado_at TIMESTAMPTZ;
ALTER TABLE public.mensajes_contacto
  ADD COLUMN IF NOT EXISTS notificado_at TIMESTAMPTZ;

ALTER TABLE public.inscripciones DROP CONSTRAINT IF EXISTS chk_inscripciones_campos;
ALTER TABLE public.inscripciones ADD CONSTRAINT chk_inscripciones_campos CHECK (
  char_length(nombre_completo) BETWEEN 3 AND 150
  AND char_length(documento_numero) BETWEEN 4 AND 20
  AND char_length(telefono) BETWEEN 7 AND 20
  AND correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(correo) <= 150
  AND char_length(ciudad) BETWEEN 2 AND 100
  AND char_length(programa_nombre) BETWEEN 2 AND 200
  AND (mensaje IS NULL OR char_length(mensaje) <= 2000)
) NOT VALID;

ALTER TABLE public.mensajes_contacto DROP CONSTRAINT IF EXISTS chk_mensajes_campos;
ALTER TABLE public.mensajes_contacto ADD CONSTRAINT chk_mensajes_campos CHECK (
  char_length(nombre) BETWEEN 2 AND 150
  AND correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(correo) <= 150
  AND char_length(asunto) BETWEEN 2 AND 200
  AND char_length(mensaje) BETWEEN 2 AND 5000
) NOT VALID;

-- Inserción pública: no permitir que el público marque registros como notificados ni cambie estado.
DROP POLICY IF EXISTS "Público puede inscribirse" ON public.inscripciones;
DROP POLICY IF EXISTS inscripciones_insert_publico ON public.inscripciones;
CREATE POLICY inscripciones_insert_publico ON public.inscripciones FOR INSERT TO anon, authenticated
  WITH CHECK (estado = 'nuevo' AND notificado_at IS NULL AND notas_internas IS NULL);

DROP POLICY IF EXISTS "Público puede enviar mensajes" ON public.mensajes_contacto;
DROP POLICY IF EXISTS mensajes_insert_publico ON public.mensajes_contacto;
CREATE POLICY mensajes_insert_publico ON public.mensajes_contacto FOR INSERT TO anon, authenticated
  WITH CHECK (estado = 'nuevo' AND notificado_at IS NULL AND leido = false);

-- 6. PERMISOS DE EJECUCIÓN ----------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.proteger_campos_perfil() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.proteger_matricula() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validar_calificacion_curso() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_recalcular_por_calificacion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_recalcular_por_componente() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalcular_nota_definitiva(UUID) FROM PUBLIC, anon, authenticated;

DO $$
DECLARE f TEXT;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'public.is_admin()', 'public.is_editor_or_admin()',
    'public.es_docente_de_curso(uuid)', 'public.esta_matriculado(uuid)',
    'public.es_mi_matricula(uuid)', 'public.es_docente_de_matricula(uuid)',
    'public.comparte_curso(uuid)', 'public.cerrar_curso(uuid)'
  ] LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', f);
  END LOOP;
END $$;
