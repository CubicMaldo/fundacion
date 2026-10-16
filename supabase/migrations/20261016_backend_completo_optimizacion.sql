-- ============================================================================
-- MIGRACIÓN: Finalización de Backend Académico, Seguridad RLS y Rendimiento
-- ============================================================================

-- 1. Índices faltantes en llaves foráneas (Supabase Performance Advisor)
CREATE INDEX IF NOT EXISTS idx_articulos_autor ON public.articulos(autor_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_calificado_por ON public.calificaciones(calificado_por);
CREATE INDEX IF NOT EXISTS idx_configuracion_updated_by ON public.configuracion(updated_by);
CREATE INDEX IF NOT EXISTS idx_inscripciones_programa ON public.inscripciones(programa_id);
CREATE INDEX IF NOT EXISTS idx_observaciones_creado_por ON public.observaciones_academicas(creado_por);

-- 2. Endurecimiento de funciones auxiliares y search_path
CREATE OR REPLACE FUNCTION public.ruta_evidencia_matricula(p_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN split_part(p_name, '/', 1)::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- Asegurar que cerrar_curso tenga la firma exacta p_curso_id usada por el cliente
-- y permita recalcular/actualizar actas para todas las matrículas no retiradas
DROP FUNCTION IF EXISTS public.cerrar_curso(UUID);

CREATE OR REPLACE FUNCTION public.cerrar_curso(p_curso_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total NUMERIC;
  v_minima NUMERIC;
  v_actualizadas INTEGER;
BEGIN
  IF NOT (public.is_admin() OR public.es_docente_de_curso(p_curso_id)) THEN
    RAISE EXCEPTION 'No tienes permisos para cerrar este curso' USING ERRCODE = '42501';
  END IF;

  SELECT COALESCE(SUM(porcentaje), 0) INTO v_total
  FROM public.componentes_evaluacion
  WHERE curso_id = p_curso_id;

  IF v_total <> 100 THEN
    RAISE EXCEPTION 'La malla de evaluación suma % por ciento y debe sumar exactamente 100 por ciento', v_total
      USING ERRCODE = '23514';
  END IF;

  -- Garantizar que todas las notas definitivas estén al día antes de emitir actas
  PERFORM public.recalcular_nota_definitiva(m.id)
  FROM public.matriculas m
  WHERE m.curso_id = p_curso_id;

  SELECT nota_minima_aprobacion INTO v_minima
  FROM public.cursos
  WHERE id = p_curso_id;

  UPDATE public.matriculas
  SET
    estado = CASE
      WHEN COALESCE(nota_definitiva, 0) >= v_minima THEN 'aprobado'
      ELSE 'reprobado'
    END,
    updated_at = now()
  WHERE curso_id = p_curso_id
    AND estado <> 'retirado';

  GET DIAGNOSTICS v_actualizadas = ROW_COUNT;
  RETURN v_actualizadas;
END;
$$;

-- Trigger de componentes: recalcular también al insertar o eliminar componentes
CREATE OR REPLACE FUNCTION public.trg_recalcular_por_componente()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_curso_id UUID := COALESCE(NEW.curso_id, OLD.curso_id);
BEGIN
  PERFORM public.recalcular_nota_definitiva(m.id)
  FROM public.matriculas m
  WHERE m.curso_id = v_curso_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_componentes_recalcular ON public.componentes_evaluacion;
CREATE TRIGGER trg_componentes_recalcular
  AFTER INSERT OR UPDATE OF porcentaje OR DELETE ON public.componentes_evaluacion
  FOR EACH ROW EXECUTE FUNCTION public.trg_recalcular_por_componente();

-- Trigger para proteger campos administrativos de cursos cuando un docente edita su curso
CREATE OR REPLACE FUNCTION public.proteger_curso()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (select auth.uid()) IS NOT NULL AND NOT public.is_admin() AND (
       NEW.codigo IS DISTINCT FROM OLD.codigo
    OR NEW.nombre IS DISTINCT FROM OLD.nombre
    OR NEW.programa_id IS DISTINCT FROM OLD.programa_id
    OR NEW.docente_id IS DISTINCT FROM OLD.docente_id
    OR NEW.periodo IS DISTINCT FROM OLD.periodo
    OR NEW.nota_minima_aprobacion IS DISTINCT FROM OLD.nota_minima_aprobacion
    OR NEW.activo IS DISTINCT FROM OLD.activo
  ) THEN
    RAISE EXCEPTION 'Solo un administrador puede modificar campos estructurales del curso' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_curso ON public.cursos;
CREATE TRIGGER trg_proteger_curso
  BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION public.proteger_curso();

-- Trigger para proteger entregas_trabajos cuando un estudiante actualiza su entrega
CREATE OR REPLACE FUNCTION public.proteger_entrega_estudiante()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (select auth.uid()) IS NOT NULL
     AND NOT (public.is_admin() OR public.es_docente_de_matricula(OLD.matricula_id))
  THEN
    IF OLD.estado <> 'entregado' OR OLD.nota IS NOT NULL THEN
      RAISE EXCEPTION 'No puedes modificar una entrega que ya fue calificada o revisada' USING ERRCODE = '42501';
    END IF;
    IF NEW.nota IS DISTINCT FROM OLD.nota
       OR NEW.estado IS DISTINCT FROM OLD.estado
       OR NEW.comentario_docente IS DISTINCT FROM OLD.comentario_docente
       OR NEW.matricula_id IS DISTINCT FROM OLD.matricula_id
    THEN
      RAISE EXCEPTION 'No autorizado para modificar la calificación de la entrega' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proteger_entrega_estudiante ON public.entregas_trabajos;
CREATE TRIGGER trg_proteger_entrega_estudiante
  BEFORE UPDATE ON public.entregas_trabajos
  FOR EACH ROW EXECUTE FUNCTION public.proteger_entrega_estudiante();

-- 3. Consolidación de Políticas RLS (elimina multiple_permissive_policies y auth_rls_initplan)

-- PERFILES
DROP POLICY IF EXISTS "perfiles_admin_all" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_select_propio" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_update_propio" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_select" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_insert" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_update" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_delete" ON public.perfiles;

CREATE POLICY "perfiles_select" ON public.perfiles
  FOR SELECT TO authenticated
  USING (public.is_admin() OR id = (select auth.uid()) OR public.comparte_curso(id));

CREATE POLICY "perfiles_insert" ON public.perfiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "perfiles_update" ON public.perfiles
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR id = (select auth.uid()))
  WITH CHECK (public.is_admin() OR id = (select auth.uid()));

CREATE POLICY "perfiles_delete" ON public.perfiles
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- CURSOS
DROP POLICY IF EXISTS "cursos_admin_all" ON public.cursos;
DROP POLICY IF EXISTS "cursos_select" ON public.cursos;
DROP POLICY IF EXISTS "cursos_insert" ON public.cursos;
DROP POLICY IF EXISTS "cursos_update" ON public.cursos;
DROP POLICY IF EXISTS "cursos_delete" ON public.cursos;

CREATE POLICY "cursos_select" ON public.cursos
  FOR SELECT TO authenticated
  USING (public.is_admin() OR docente_id = (select auth.uid()) OR public.esta_matriculado(id));

CREATE POLICY "cursos_insert" ON public.cursos
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "cursos_update" ON public.cursos
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR docente_id = (select auth.uid()))
  WITH CHECK (public.is_admin() OR docente_id = (select auth.uid()));

CREATE POLICY "cursos_delete" ON public.cursos
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- MATRICULAS
DROP POLICY IF EXISTS "matriculas_admin_all" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_docente_update" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_select" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_insert" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_update" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_delete" ON public.matriculas;

CREATE POLICY "matriculas_select" ON public.matriculas
  FOR SELECT TO authenticated
  USING (public.is_admin() OR estudiante_id = (select auth.uid()) OR public.es_docente_de_curso(curso_id));

CREATE POLICY "matriculas_insert" ON public.matriculas
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "matriculas_update" ON public.matriculas
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_curso(curso_id))
  WITH CHECK (public.is_admin() OR public.es_docente_de_curso(curso_id));

CREATE POLICY "matriculas_delete" ON public.matriculas
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- COMPONENTES_EVALUACION
DROP POLICY IF EXISTS "componentes_admin_all" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_docente_all" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_estudiante_select" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_select" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_insert" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_update" ON public.componentes_evaluacion;
DROP POLICY IF EXISTS "componentes_delete" ON public.componentes_evaluacion;

CREATE POLICY "componentes_select" ON public.componentes_evaluacion
  FOR SELECT TO authenticated
  USING (public.is_admin() OR public.es_docente_de_curso(curso_id) OR public.esta_matriculado(curso_id));

CREATE POLICY "componentes_insert" ON public.componentes_evaluacion
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.es_docente_de_curso(curso_id));

CREATE POLICY "componentes_update" ON public.componentes_evaluacion
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_curso(curso_id))
  WITH CHECK (public.is_admin() OR public.es_docente_de_curso(curso_id));

CREATE POLICY "componentes_delete" ON public.componentes_evaluacion
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_curso(curso_id));

-- CALIFICACIONES
DROP POLICY IF EXISTS "calificaciones_admin_all" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_docente_all" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_estudiante_select" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_select" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_insert" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_update" ON public.calificaciones;
DROP POLICY IF EXISTS "calificaciones_delete" ON public.calificaciones;

CREATE POLICY "calificaciones_select" ON public.calificaciones
  FOR SELECT TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id) OR public.es_mi_matricula(matricula_id));

CREATE POLICY "calificaciones_insert" ON public.calificaciones
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

CREATE POLICY "calificaciones_update" ON public.calificaciones
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id))
  WITH CHECK (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

CREATE POLICY "calificaciones_delete" ON public.calificaciones
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

-- ENTREGAS_TRABAJOS
DROP POLICY IF EXISTS "entregas_admin_all" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_docente_select" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_docente_update" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_estudiante_insert" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_estudiante_select" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_select" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_insert" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_update" ON public.entregas_trabajos;
DROP POLICY IF EXISTS "entregas_delete" ON public.entregas_trabajos;

CREATE POLICY "entregas_select" ON public.entregas_trabajos
  FOR SELECT TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id) OR public.es_mi_matricula(matricula_id));

CREATE POLICY "entregas_insert" ON public.entregas_trabajos
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (public.es_mi_matricula(matricula_id) AND nota IS NULL AND estado = 'entregado')
  );

CREATE POLICY "entregas_update" ON public.entregas_trabajos
  FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR public.es_docente_de_matricula(matricula_id)
    OR (public.es_mi_matricula(matricula_id) AND nota IS NULL AND estado = 'entregado')
  )
  WITH CHECK (
    public.is_admin()
    OR public.es_docente_de_matricula(matricula_id)
    OR (public.es_mi_matricula(matricula_id) AND nota IS NULL AND estado = 'entregado')
  );

CREATE POLICY "entregas_delete" ON public.entregas_trabajos
  FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR (public.es_mi_matricula(matricula_id) AND nota IS NULL AND estado = 'entregado')
  );

-- OBSERVACIONES_ACADEMICAS
DROP POLICY IF EXISTS "observaciones_admin_all" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_docente_all" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_estudiante_select" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_select" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_insert" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_update" ON public.observaciones_academicas;
DROP POLICY IF EXISTS "observaciones_delete" ON public.observaciones_academicas;

CREATE POLICY "observaciones_select" ON public.observaciones_academicas
  FOR SELECT TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id) OR public.es_mi_matricula(matricula_id));

CREATE POLICY "observaciones_insert" ON public.observaciones_academicas
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

CREATE POLICY "observaciones_update" ON public.observaciones_academicas
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id))
  WITH CHECK (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

CREATE POLICY "observaciones_delete" ON public.observaciones_academicas
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.es_docente_de_matricula(matricula_id));

-- ARTICULOS, PROGRAMAS, GALERIA, CONFIGURACION (Unificar SELECT y separar mutaciones)
DROP POLICY IF EXISTS "Editores y admins gestionan artículos" ON public.articulos;
DROP POLICY IF EXISTS "Lectura pública de artículos publicados" ON public.articulos;
CREATE POLICY "articulos_select" ON public.articulos
  FOR SELECT TO public
  USING (estado = 'publicado'::post_estado OR public.is_editor_or_admin());
CREATE POLICY "articulos_insert" ON public.articulos
  FOR INSERT TO authenticated
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "articulos_update" ON public.articulos
  FOR UPDATE TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "articulos_delete" ON public.articulos
  FOR DELETE TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editores y admins gestionan programas" ON public.programas;
DROP POLICY IF EXISTS "Lectura pública de programas activos" ON public.programas;
CREATE POLICY "programas_select" ON public.programas
  FOR SELECT TO public
  USING (activo = true OR public.is_editor_or_admin());
CREATE POLICY "programas_insert" ON public.programas
  FOR INSERT TO authenticated
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "programas_update" ON public.programas
  FOR UPDATE TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "programas_delete" ON public.programas
  FOR DELETE TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editores y admins gestionan galería" ON public.galeria;
DROP POLICY IF EXISTS "Lectura pública de galería activa" ON public.galeria;
CREATE POLICY "galeria_select" ON public.galeria
  FOR SELECT TO public
  USING (activo = true OR public.is_editor_or_admin());
CREATE POLICY "galeria_insert" ON public.galeria
  FOR INSERT TO authenticated
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "galeria_update" ON public.galeria
  FOR UPDATE TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "galeria_delete" ON public.galeria
  FOR DELETE TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Admins modifican configuración" ON public.configuracion;
DROP POLICY IF EXISTS "Lectura pública de configuración" ON public.configuracion;
CREATE POLICY "configuracion_select" ON public.configuracion
  FOR SELECT TO public
  USING (true);
CREATE POLICY "configuracion_insert" ON public.configuracion
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
CREATE POLICY "configuracion_update" ON public.configuracion
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
CREATE POLICY "configuracion_delete" ON public.configuracion
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. Bucket de Storage 'entregas-trabajos' y políticas unificadas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entregas-trabajos',
  'entregas-trabajos',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "evidencias_insert" ON storage.objects;
DROP POLICY IF EXISTS "evidencias_select" ON storage.objects;
DROP POLICY IF EXISTS "evidencias_delete" ON storage.objects;
DROP POLICY IF EXISTS "Estudiantes suben entregas propias" ON storage.objects;
DROP POLICY IF EXISTS "Lectura de entregas autorizada" ON storage.objects;

CREATE POLICY "evidencias_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('entregas-trabajos', 'evidencias-academicas')
    AND (
      public.is_admin()
      OR public.es_mi_matricula(public.ruta_evidencia_matricula(name))
      OR public.es_docente_de_matricula(public.ruta_evidencia_matricula(name))
    )
  );

CREATE POLICY "evidencias_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('entregas-trabajos', 'evidencias-academicas')
    AND (
      public.is_admin()
      OR public.es_mi_matricula(public.ruta_evidencia_matricula(name))
    )
  );

CREATE POLICY "evidencias_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id IN ('entregas-trabajos', 'evidencias-academicas')
    AND (
      public.is_admin()
      OR public.es_mi_matricula(public.ruta_evidencia_matricula(name))
    )
  );

-- 5. RPC seguro para resolución de identificador de login (usuario o documento -> email)
CREATE OR REPLACE FUNCTION public.resolver_email_login(p_identificador TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean TEXT := lower(trim(COALESCE(p_identificador, '')));
  v_email TEXT;
BEGIN
  IF length(v_clean) < 3 THEN
    RETURN NULL;
  END IF;

  SELECT p.email INTO v_email
  FROM public.perfiles p
  WHERE p.activo = true
    AND (lower(p.usuario) = v_clean OR lower(p.documento) = v_clean)
  LIMIT 1;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolver_email_login(TEXT) TO anon, authenticated;
