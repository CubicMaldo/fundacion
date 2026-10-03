-- ============================================================================
-- Migración: Optimización de Índices
-- Fecha: 2026-10-03
-- ============================================================================

-- Índices para la tabla 'programas'
CREATE INDEX IF NOT EXISTS idx_programas_slug ON public.programas(slug);
CREATE INDEX IF NOT EXISTS idx_programas_activo ON public.programas(activo);
CREATE INDEX IF NOT EXISTS idx_programas_categoria_id ON public.programas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_programas_destacado ON public.programas(destacado);

-- Índices para la tabla 'articulos'
CREATE INDEX IF NOT EXISTS idx_articulos_slug ON public.articulos(slug);
CREATE INDEX IF NOT EXISTS idx_articulos_estado ON public.articulos(estado);
CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON public.articulos(categoria);
CREATE INDEX IF NOT EXISTS idx_articulos_autor_id ON public.articulos(autor_id);

-- Índices para la tabla 'inscripciones'
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado ON public.inscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_inscripciones_programa_id ON public.inscripciones(programa_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_documento_numero ON public.inscripciones(documento_numero);

-- Índices para la tabla 'mensajes_contacto'
CREATE INDEX IF NOT EXISTS idx_mensajes_contacto_estado ON public.mensajes_contacto(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_contacto_leido ON public.mensajes_contacto(leido);

-- Índices para la tabla 'galeria'
CREATE INDEX IF NOT EXISTS idx_galeria_activo ON public.galeria(activo);
CREATE INDEX IF NOT EXISTS idx_galeria_categoria ON public.galeria(categoria);
