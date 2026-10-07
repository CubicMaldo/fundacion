-- ============================================================================
-- Migración: Fase 2 - Sistema y Portal Académico FUNASF
-- Fecha: 2026-10-10
-- ============================================================================

-- 1. EXTENSIÓN DE ROLES PARA SISTEMA ACADÉMICO
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'docente';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'estudiante';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLAS DEL SISTEMA ACADÉMICO

-- 2.1 Cursos / Módulos de Programas
CREATE TABLE IF NOT EXISTS public.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa_id UUID NOT NULL REFERENCES public.programas(id) ON DELETE RESTRICT,
  docente_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  periodo TEXT NOT NULL DEFAULT '2026-1',
  horario_descripcion TEXT,
  aula TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Matrículas de Estudiantes en Cursos
CREATE TABLE IF NOT EXISTS public.matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE RESTRICT,
  estado TEXT NOT NULL DEFAULT 'cursando' CHECK (estado IN ('cursando', 'aprobado', 'reprobado', 'retirado')),
  nota_definitiva NUMERIC(3, 2),
  fecha_matricula TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_estudiante_curso UNIQUE (estudiante_id, curso_id)
);

-- 2.3 Evaluaciones y Calificaciones (Parciales, Talleres, Quices)
CREATE TABLE IF NOT EXISTS public.evaluaciones_notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  porcentaje INT NOT NULL CHECK (porcentaje > 0 AND porcentaje <= 100),
  nota NUMERIC(3, 2) NOT NULL CHECK (nota >= 0.0 AND nota <= 5.0),
  retroalimentacion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Entregas de Trabajos y Evidencias Prácticas
CREATE TABLE IF NOT EXISTS public.entregas_trabajos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  archivo_url TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'entregado' CHECK (estado IN ('entregado', 'revisado', 'calificado')),
  nota NUMERIC(3, 2) CHECK (nota >= 0.0 AND nota <= 5.0),
  retroalimentacion TEXT,
  fecha_entrega TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Observaciones Pedagógicas y Seguimiento
CREATE TABLE IF NOT EXISTS public.observaciones_academicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'seguimiento' CHECK (tipo IN ('felicitacion', 'alerta_academica', 'asistencia', 'seguimiento')),
  titulo TEXT NOT NULL,
  detalle TEXT NOT NULL,
  creado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TRIGGERS PARA UPDATED_AT
DROP TRIGGER IF EXISTS set_cursos_updated_at ON public.cursos;
CREATE TRIGGER set_cursos_updated_at
  BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_matriculas_updated_at ON public.matriculas;
CREATE TRIGGER set_matriculas_updated_at
  BEFORE UPDATE ON public.matriculas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_evaluaciones_notas_updated_at ON public.evaluaciones_notas;
CREATE TRIGGER set_evaluaciones_notas_updated_at
  BEFORE UPDATE ON public.evaluaciones_notas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_entregas_trabajos_updated_at ON public.entregas_trabajos;
CREATE TRIGGER set_entregas_trabajos_updated_at
  BEFORE UPDATE ON public.entregas_trabajos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_cursos_programa_id ON public.cursos(programa_id);
CREATE INDEX IF NOT EXISTS idx_cursos_docente_id ON public.cursos(docente_id);
CREATE INDEX IF NOT EXISTS idx_cursos_periodo ON public.cursos(periodo);
CREATE INDEX IF NOT EXISTS idx_cursos_activo ON public.cursos(activo);

CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante_id ON public.matriculas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso_id ON public.matriculas(curso_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_estado ON public.matriculas(estado);

CREATE INDEX IF NOT EXISTS idx_evaluaciones_matricula_id ON public.evaluaciones_notas(matricula_id);
CREATE INDEX IF NOT EXISTS idx_entregas_matricula_id ON public.entregas_trabajos(matricula_id);
CREATE INDEX IF NOT EXISTS idx_observaciones_matricula_id ON public.observaciones_academicas(matricula_id);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones_notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas_trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observaciones_academicas ENABLE ROW LEVEL SECURITY;

-- 5.1 Políticas para Cursos
DROP POLICY IF EXISTS "Admins gestionan cursos" ON public.cursos;
CREATE POLICY "Admins gestionan cursos"
  ON public.cursos FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Docentes leen sus cursos asignados" ON public.cursos;
CREATE POLICY "Docentes leen sus cursos asignados"
  ON public.cursos FOR SELECT
  TO authenticated
  USING (docente_id = auth.uid());

DROP POLICY IF EXISTS "Docentes actualizan detalles de sus cursos" ON public.cursos;
CREATE POLICY "Docentes actualizan detalles de sus cursos"
  ON public.cursos FOR UPDATE
  TO authenticated
  USING (docente_id = auth.uid());

DROP POLICY IF EXISTS "Estudiantes leen cursos en los que estan matriculados" ON public.cursos;
CREATE POLICY "Estudiantes leen cursos en los que estan matriculados"
  ON public.cursos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.curso_id = public.cursos.id
        AND m.estudiante_id = auth.uid()
    )
  );

-- 5.2 Políticas para Matrículas
DROP POLICY IF EXISTS "Admins gestionan matriculas" ON public.matriculas;
CREATE POLICY "Admins gestionan matriculas"
  ON public.matriculas FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Estudiantes leen sus propias matriculas" ON public.matriculas;
CREATE POLICY "Estudiantes leen sus propias matriculas"
  ON public.matriculas FOR SELECT
  TO authenticated
  USING (estudiante_id = auth.uid());

DROP POLICY IF EXISTS "Docentes leen matriculas de sus cursos" ON public.matriculas;
CREATE POLICY "Docentes leen matriculas de sus cursos"
  ON public.matriculas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = public.matriculas.curso_id
        AND c.docente_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Docentes actualizan notas definitivas de sus cursos" ON public.matriculas;
CREATE POLICY "Docentes actualizan notas definitivas de sus cursos"
  ON public.matriculas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = public.matriculas.curso_id
        AND c.docente_id = auth.uid()
    )
  );

-- 5.3 Políticas para Evaluaciones y Calificaciones
DROP POLICY IF EXISTS "Admins gestionan notas" ON public.evaluaciones_notas;
CREATE POLICY "Admins gestionan notas"
  ON public.evaluaciones_notas FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Estudiantes leen sus propias notas" ON public.evaluaciones_notas;
CREATE POLICY "Estudiantes leen sus propias notas"
  ON public.evaluaciones_notas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.id = public.evaluaciones_notas.matricula_id
        AND m.estudiante_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Docentes gestionan notas de sus cursos" ON public.evaluaciones_notas;
CREATE POLICY "Docentes gestionan notas de sus cursos"
  ON public.evaluaciones_notas FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      JOIN public.cursos c ON c.id = m.curso_id
      WHERE m.id = public.evaluaciones_notas.matricula_id
        AND c.docente_id = auth.uid()
    )
  );

-- 5.4 Políticas para Entregas de Trabajos
DROP POLICY IF EXISTS "Admins gestionan entregas" ON public.entregas_trabajos;
CREATE POLICY "Admins gestionan entregas"
  ON public.entregas_trabajos FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Estudiantes gestionan sus entregas" ON public.entregas_trabajos;
CREATE POLICY "Estudiantes gestionan sus entregas"
  ON public.entregas_trabajos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.id = public.entregas_trabajos.matricula_id
        AND m.estudiante_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Docentes leen y califican entregas de sus cursos" ON public.entregas_trabajos;
CREATE POLICY "Docentes leen y califican entregas de sus cursos"
  ON public.entregas_trabajos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      JOIN public.cursos c ON c.id = m.curso_id
      WHERE m.id = public.entregas_trabajos.matricula_id
        AND c.docente_id = auth.uid()
    )
  );

-- 5.5 Políticas para Observaciones Académicas
DROP POLICY IF EXISTS "Admins gestionan observaciones" ON public.observaciones_academicas;
CREATE POLICY "Admins gestionan observaciones"
  ON public.observaciones_academicas FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Estudiantes leen sus observaciones" ON public.observaciones_academicas;
CREATE POLICY "Estudiantes leen sus observaciones"
  ON public.observaciones_academicas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.id = public.observaciones_academicas.matricula_id
        AND m.estudiante_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Docentes gestionan observaciones en sus cursos" ON public.observaciones_academicas;
CREATE POLICY "Docentes gestionan observaciones en sus cursos"
  ON public.observaciones_academicas FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matriculas m
      JOIN public.cursos c ON c.id = m.curso_id
      WHERE m.id = public.observaciones_academicas.matricula_id
        AND c.docente_id = auth.uid()
    )
  );

-- 6. STORAGE BUCKET PRIVADO PARA EVIDENCIAS ACADÉMICAS
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidencias-academicas', 'evidencias-academicas', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acceso a evidencias para usuarios autenticados" ON storage.objects;
CREATE POLICY "Acceso a evidencias para usuarios autenticados"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'evidencias-academicas');

DROP POLICY IF EXISTS "Subida de evidencias para usuarios autenticados" ON storage.objects;
CREATE POLICY "Subida de evidencias para usuarios autenticados"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'evidencias-academicas');

