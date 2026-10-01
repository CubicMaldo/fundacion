-- ============================================================================
-- Migración: Sistema de Panel Administrativo (CMS) FUNASF
-- Fecha: 2026-10-01
-- ============================================================================

-- 1. TIPOS ENUMERADOS
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.post_estado AS ENUM ('borrador', 'publicado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inscripcion_estado AS ENUM ('nuevo', 'contactado', 'en_revision', 'admitido', 'descartado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.mensaje_estado AS ENUM ('nuevo', 'respondido', 'archivado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLAS PRINCIPALES

-- 2.1 Perfiles de Usuario (RBAC)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre_completo TEXT,
  rol public.app_role NOT NULL DEFAULT 'editor',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Programas Académicos
CREATE TABLE IF NOT EXISTS public.programas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  categoria_id TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  modalidades TEXT[] NOT NULL DEFAULT '{}',
  perfil_ocupacional TEXT[] NOT NULL DEFAULT '{}',
  requisitos TEXT[] NOT NULL DEFAULT '{}',
  certificacion_nota TEXT,
  duracion_estimada TEXT,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  destacado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Artículos / Blog
CREATE TABLE IF NOT EXISTS public.articulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  autor_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  autor_nombre TEXT NOT NULL DEFAULT 'Comunidad FUNASF',
  categoria TEXT NOT NULL DEFAULT 'Institucional',
  imagen_portada TEXT,
  estado public.post_estado NOT NULL DEFAULT 'borrador',
  fecha_publicacion TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Galería de Actividades
CREATE TABLE IF NOT EXISTS public.galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL DEFAULT 'General',
  imagen_url TEXT NOT NULL,
  alt_text TEXT,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Inscripciones y Postulaciones a Becas
CREATE TABLE IF NOT EXISTS public.inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL,
  documento_tipo TEXT NOT NULL DEFAULT 'CC',
  documento_numero TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  programa_id UUID REFERENCES public.programas(id) ON DELETE SET NULL,
  programa_nombre TEXT NOT NULL,
  estado public.inscripcion_estado NOT NULL DEFAULT 'nuevo',
  notas_internas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Mensajes de Contacto
CREATE TABLE IF NOT EXISTS public.mensajes_contacto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT false,
  estado public.mensaje_estado NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Configuración Institucional (Key-Value JSONB)
CREATE TABLE IF NOT EXISTS public.configuracion (
  clave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.perfiles(id) ON DELETE SET NULL
);

-- 3. FUNCIONES AUXILIARES & SEGURIDAD

-- Función para verificar si el usuario autenticado es Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- Función para verificar si el usuario autenticado es Editor o Admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol IN ('admin', 'editor')
  );
$$;

-- Actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Disparador para crear automáticamente perfil al registrar usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role := 'editor';
BEGIN
  IF NEW.raw_user_meta_data->>'rol' = 'admin' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.perfiles (id, email, nombre_completo, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', split_part(NEW.email, '@', 1)),
    v_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Garantizar que nunca rompa el proceso de autenticación de Supabase GoTrue
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers de actualización
DROP TRIGGER IF EXISTS set_programas_updated_at ON public.programas;
CREATE TRIGGER set_programas_updated_at
  BEFORE UPDATE ON public.programas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_articulos_updated_at ON public.articulos;
CREATE TRIGGER set_articulos_updated_at
  BEFORE UPDATE ON public.articulos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_inscripciones_updated_at ON public.inscripciones;
CREATE TRIGGER set_inscripciones_updated_at
  BEFORE UPDATE ON public.inscripciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_configuracion_updated_at ON public.configuracion;
CREATE TRIGGER set_configuracion_updated_at
  BEFORE UPDATE ON public.configuracion
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- 4.1 Políticas para Perfiles
DROP POLICY IF EXISTS "Perfiles visibles para usuarios autenticados" ON public.perfiles;
CREATE POLICY "Perfiles visibles para usuarios autenticados"
  ON public.perfiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuarios editan su propio perfil" ON public.perfiles;
CREATE POLICY "Usuarios editan su propio perfil"
  ON public.perfiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins gestionan perfiles" ON public.perfiles;
CREATE POLICY "Admins gestionan perfiles"
  ON public.perfiles FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 4.2 Políticas para Programas
DROP POLICY IF EXISTS "Lectura pública de programas activos" ON public.programas;
CREATE POLICY "Lectura pública de programas activos"
  ON public.programas FOR SELECT
  TO public
  USING (activo = true);

DROP POLICY IF EXISTS "Editores y admins gestionan programas" ON public.programas;
CREATE POLICY "Editores y admins gestionan programas"
  ON public.programas FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin());

-- 4.3 Políticas para Artículos
DROP POLICY IF EXISTS "Lectura pública de artículos publicados" ON public.articulos;
CREATE POLICY "Lectura pública de artículos publicados"
  ON public.articulos FOR SELECT
  TO public
  USING (estado = 'publicado');

DROP POLICY IF EXISTS "Editores y admins gestionan artículos" ON public.articulos;
CREATE POLICY "Editores y admins gestionan artículos"
  ON public.articulos FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin());

-- 4.4 Políticas para Galería
DROP POLICY IF EXISTS "Lectura pública de galería activa" ON public.galeria;
CREATE POLICY "Lectura pública de galería activa"
  ON public.galeria FOR SELECT
  TO public
  USING (activo = true);

DROP POLICY IF EXISTS "Editores y admins gestionan galería" ON public.galeria;
CREATE POLICY "Editores y admins gestionan galería"
  ON public.galeria FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin());

-- 4.5 Políticas para Inscripciones
DROP POLICY IF EXISTS "Público puede inscribirse" ON public.inscripciones;
CREATE POLICY "Público puede inscribirse"
  ON public.inscripciones FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Editores y admins gestionan inscripciones" ON public.inscripciones;
CREATE POLICY "Editores y admins gestionan inscripciones"
  ON public.inscripciones FOR SELECT
  TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editores y admins actualizan inscripciones" ON public.inscripciones;
CREATE POLICY "Editores y admins actualizan inscripciones"
  ON public.inscripciones FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Admins eliminan inscripciones" ON public.inscripciones;
CREATE POLICY "Admins eliminan inscripciones"
  ON public.inscripciones FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4.6 Políticas para Mensajes de Contacto
DROP POLICY IF EXISTS "Público puede enviar mensajes" ON public.mensajes_contacto;
CREATE POLICY "Público puede enviar mensajes"
  ON public.mensajes_contacto FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Editores y admins leen mensajes" ON public.mensajes_contacto;
CREATE POLICY "Editores y admins leen mensajes"
  ON public.mensajes_contacto FOR SELECT
  TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editores y admins actualizan mensajes" ON public.mensajes_contacto;
CREATE POLICY "Editores y admins actualizan mensajes"
  ON public.mensajes_contacto FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Admins eliminan mensajes" ON public.mensajes_contacto;
CREATE POLICY "Admins eliminan mensajes"
  ON public.mensajes_contacto FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4.7 Políticas para Configuración
DROP POLICY IF EXISTS "Lectura pública de configuración" ON public.configuracion;
CREATE POLICY "Lectura pública de configuración"
  ON public.configuracion FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins modifican configuración" ON public.configuracion;
CREATE POLICY "Admins modifican configuración"
  ON public.configuracion FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 5. BUCKETS DE STORAGE (Imágenes y Medios)
INSERT INTO storage.buckets (id, name, public)
VALUES ('galeria', 'galeria', true), ('articulos', 'articulos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Medios públicos en galeria" ON storage.objects;
CREATE POLICY "Medios públicos en galeria"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('galeria', 'articulos'));

DROP POLICY IF EXISTS "Editores y admins suben medios" ON storage.objects;
CREATE POLICY "Editores y admins suben medios"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('galeria', 'articulos') AND public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editores y admins eliminan medios" ON storage.objects;
CREATE POLICY "Editores y admins eliminan medios"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('galeria', 'articulos') AND public.is_editor_or_admin());
