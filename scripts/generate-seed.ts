import fs from "node:fs";
import path from "node:path";
import { programasAcademicos } from "../src/data/programas.ts";
import {
  org,
  sedes,
  becas,
  quienesSomos,
  mision,
  vision,
  valores,
  proposito,
  alcance,
} from "../src/data/funasf.ts";

function escapeSqlString(str: string | null | undefined): string {
  if (str == null) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeSqlArray(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "'{}'::text[]";
  const items = arr.map((item) => escapeSqlString(item)).join(", ");
  return `ARRAY[${items}]::text[]`;
}

const programRows = programasAcademicos.map((p, i) => {
  return `  (
    ${escapeSqlString(p.slug)},
    ${escapeSqlString(p.nombre)},
    ${escapeSqlString(p.categoriaId)},
    ${escapeSqlString(p.categoria)},
    ${escapeSqlString(p.descripcion)},
    ${escapeSqlString(p.objetivo)},
    ${escapeSqlArray(p.modalidades)},
    ${escapeSqlArray(p.perfilOcupacional)},
    ${escapeSqlArray(p.requisitos)},
    ${escapeSqlString(p.certificacionNota)},
    ${escapeSqlString(p.duracionEstimada)},
    ${i + 1},
    true
  )`;
});

const configContacto = {
  telefonos: org.telefonos,
  correo: org.correo,
  instagram: org.instagram,
  instagramUrl: org.instagramUrl,
  ciudadPrincipal: org.ciudadPrincipal,
  direccionPrincipal: org.direccionPrincipal,
  formularioInscripcion: org.formularioInscripcion,
  horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
};

const configInstitucional = {
  nombre: org.nombre,
  sigla: org.sigla,
  razonSocial: org.razonSocial,
  nit: org.nit,
  eslogan: org.eslogan,
  esloganSecundario: org.esloganSecundario,
  frases: org.frases,
  quienesSomos,
  mision,
  vision,
  proposito,
  valores,
  alcance,
};

const configBecas = becas;
const configSedes = sedes;

const seedSql = `-- ============================================================================
-- Seed Inicial para FUNASF
-- Generado automáticamente desde src/data/programas.ts y src/data/funasf.ts
-- ============================================================================

-- 1. Inserción de Programas Académicos (15 programas oficiales)
INSERT INTO public.programas (
  slug,
  nombre,
  categoria_id,
  categoria,
  descripcion,
  objetivo,
  modalidades,
  perfil_ocupacional,
  requisitos,
  certificacion_nota,
  duracion_estimada,
  orden,
  activo
) VALUES
${programRows.join(",\n")}
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria_id = EXCLUDED.categoria_id,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  objetivo = EXCLUDED.objetivo,
  modalidades = EXCLUDED.modalidades,
  perfil_ocupacional = EXCLUDED.perfil_ocupacional,
  requisitos = EXCLUDED.requisitos,
  certificacion_nota = EXCLUDED.certificacion_nota,
  duracion_estimada = EXCLUDED.duracion_estimada,
  orden = EXCLUDED.orden,
  activo = EXCLUDED.activo;

-- 2. Inserción de Configuración Institucional
INSERT INTO public.configuracion (clave, valor)
VALUES
  ('contacto', ${escapeSqlString(JSON.stringify(configContacto))}::jsonb),
  ('institucional', ${escapeSqlString(JSON.stringify(configInstitucional))}::jsonb),
  ('becas', ${escapeSqlString(JSON.stringify(configBecas))}::jsonb),
  ('sedes', ${escapeSqlString(JSON.stringify(configSedes))}::jsonb)
ON CONFLICT (clave) DO UPDATE SET
  valor = EXCLUDED.valor,
  updated_at = now();

-- 3. Artículos iniciales de ejemplo para Blog (1 publicado y 1 borrador)
INSERT INTO public.articulos (
  slug,
  titulo,
  resumen,
  contenido,
  autor_nombre,
  categoria,
  estado,
  fecha_publicacion
) VALUES
  (
    'bienvenida-nuevo-ciclo-academico',
    'Apertura de la nueva convocatoria de becas y formación técnica',
    'FUNASF abre postulaciones para programas técnicos en áreas de salud, administración y bienestar comunitario.',
    'La Fundación Internacional Amigos Sin Fronteras inicia un nuevo ciclo formativo enfocado en brindar oportunidades reales de desarrollo humano y profesional a jóvenes y adultos de diferentes regiones.\n\nNuestros programas en alianza con instituciones acreditadas permiten acceder a becas de hasta el 90 %, con un acompañamiento cercano para asegurar la permanencia y culminación de los estudios.',
    'Dirección Académica FUNASF',
    'Convocatorias',
    'publicado',
    now()
  ),
  (
    'el-impacto-de-la-solidaridad-en-las-comunidades',
    'Cómo la educación transforma territorios vulnerables',
    'Reflexiones sobre nuestro trabajo comunitario en el Valle del Cauca y la Costa Atlántica.',
    'En FUNASF creemos firmemente que la educación no tiene fronteras. Cuando una persona accede a capacitación técnica de calidad, no solo mejora sus ingresos futuros, sino que eleva el bienestar de su familia y entorno.',
    'Equipo de Trabajo Social',
    'Comunidad',
    'publicado',
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. Galería inicial de ejemplo
INSERT INTO public.galeria (
  titulo,
  descripcion,
  categoria,
  imagen_url,
  orden,
  activo
) VALUES
  (
    'Jornadas de orientación vocacional',
    'Encuentro con jóvenes y familias para la postulación a becas solidarias.',
    'Comunidad',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    1,
    true
  ),
  (
    'Talleres de formación práctica',
    'Prácticas de laboratorio y desarrollo de habilidades técnicas.',
    'Talleres',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    2,
    true
  ),
  (
    'Entrega de certificaciones',
    'Celebración del logro de nuestros estudiantes graduados.',
    'Eventos',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    3,
    true
  )
ON CONFLICT DO NOTHING;
`;

const outputPath = path.resolve(import.meta.dirname, "../supabase/seed.sql");
fs.writeFileSync(outputPath, seedSql, "utf8");
console.log(`Seed script successfully written to: ${outputPath}`);
