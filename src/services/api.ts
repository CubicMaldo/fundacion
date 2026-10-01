import * as funasfData from "@/data/funasf";
import { programasAcademicos, type ProgramaAcademico } from "@/data/programas";
import type {
  Organization,
  QuienesSomos,
  Proposito,
  Beca,
  CategoriaProgramas,
  ProgramaSocial,
  FAQ,
  LlamadoAccion,
  Alcance,
  Valor,
} from "@/models/schema";
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica si las variables de entorno de Supabase están configuradas
 */
function isSupabaseAvailable(): boolean {
  try {
    const url =
      import.meta.env["VITE_SUPABASE_URL"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : undefined);
    const key =
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : undefined);
    return Boolean(url && key);
  } catch {
    return false;
  }
}

// ============================================================================
// 1. PROGRAMAS ACADÉMICOS (SUPABASE + FALLBACK)
// ============================================================================

export async function getProgramasAcademicos(): Promise<ProgramaAcademico[]> {
  if (!isSupabaseAvailable()) {
    return programasAcademicos;
  }

  try {
    const { data, error } = await supabase
      .from("programas")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (error || !data || data.length === 0) {
      return programasAcademicos;
    }

    return data.map((row) => ({
      slug: row.slug,
      nombre: row.nombre,
      categoria: row.categoria,
      categoriaId: row.categoria_id,
      descripcion: row.descripcion,
      objetivo: row.objetivo,
      modalidades: row.modalidades || [],
      perfilOcupacional: row.perfil_ocupacional || [],
      requisitos: row.requisitos || [],
      certificacionNota: row.certificacion_nota ?? undefined,
      duracionEstimada: row.duracion_estimada ?? undefined,
    }));
  } catch (err) {
    console.warn("[API] Error al consultar programas en Supabase, usando respaldo local:", err);
    return programasAcademicos;
  }
}

export async function getProgramaBySlug(slug: string): Promise<ProgramaAcademico | null> {
  if (!isSupabaseAvailable()) {
    return programasAcademicos.find((p) => p.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from("programas")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return programasAcademicos.find((p) => p.slug === slug) ?? null;
    }

    return {
      slug: data.slug,
      nombre: data.nombre,
      categoria: data.categoria,
      categoriaId: data.categoria_id,
      descripcion: data.descripcion,
      objetivo: data.objetivo,
      modalidades: data.modalidades || [],
      perfilOcupacional: data.perfil_ocupacional || [],
      requisitos: data.requisitos || [],
      certificacionNota: data.certificacion_nota ?? undefined,
      duracionEstimada: data.duracion_estimada ?? undefined,
    };
  } catch (err) {
    console.warn(`[API] Error consultando programa "${slug}", usando respaldo local:`, err);
    return programasAcademicos.find((p) => p.slug === slug) ?? null;
  }
}

// ============================================================================
// 2. BLOG Y NOTICIAS
// ============================================================================

export interface ArticuloBlog {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  autorNombre: string;
  categoria: string;
  imagenPortada?: string | null | undefined;
  fechaPublicacion: string;
}

export async function getArticulosPublicados(): Promise<ArticuloBlog[]> {
  if (!isSupabaseAvailable()) {
    return [
      {
        id: "art-1",
        slug: "bienvenida-nuevo-ciclo-academico",
        titulo: "Apertura de la nueva convocatoria de becas y formación técnica",
        resumen: "FUNASF abre postulaciones para programas técnicos en áreas de salud, administración y bienestar comunitario.",
        contenido: "La Fundación Internacional Amigos Sin Fronteras inicia un nuevo ciclo formativo enfocado en brindar oportunidades reales de desarrollo humano y profesional a jóvenes y adultos de diferentes regiones.\n\nNuestros programas en alianza con instituciones acreditadas permiten acceder a becas de hasta el 90 %, con un acompañamiento cercano para asegurar la permanencia y culminación de los estudios.",
        autorNombre: "Dirección Académica FUNASF",
        categoria: "Convocatorias",
        imagenPortada: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        fechaPublicacion: new Date().toISOString(),
      },
      {
        id: "art-2",
        slug: "el-impacto-de-la-solidaridad-en-las-comunidades",
        titulo: "Cómo la educación transforma territorios vulnerables",
        resumen: "Reflexiones sobre nuestro trabajo comunitario en el Valle del Cauca y la Costa Atlántica.",
        contenido: "En FUNASF creemos firmemente que la educación no tiene fronteras. Cuando una persona accede a capacitación técnica de calidad, no solo mejora sus ingresos futuros, sino que eleva el bienestar de su familia y entorno.",
        autorNombre: "Equipo de Trabajo Social",
        categoria: "Comunidad",
        imagenPortada: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        fechaPublicacion: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
  }

  try {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .eq("estado", "publicado")
      .order("fecha_publicacion", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      titulo: row.titulo,
      resumen: row.resumen,
      contenido: row.contenido,
      autorNombre: row.autor_nombre,
      categoria: row.categoria,
      imagenPortada: row.imagen_portada,
      fechaPublicacion: row.fecha_publicacion || row.created_at,
    }));
  } catch (err) {
    console.warn("[API] Error consultando artículos:", err);
    return [];
  }
}

export async function getArticuloBySlug(slug: string): Promise<ArticuloBlog | null> {
  const articulos = await getArticulosPublicados();
  return articulos.find((a) => a.slug === slug) ?? null;
}

// ============================================================================
// 3. GALERÍA DE ACTIVIDADES
// ============================================================================

export interface ItemGaleria {
  id: string;
  titulo: string;
  descripcion?: string | null | undefined;
  categoria: string;
  imagenUrl: string;
  altText?: string | null | undefined;
  orden: number;
}

export async function getGaleriaActiva(): Promise<ItemGaleria[]> {
  if (!isSupabaseAvailable()) {
    return [
      {
        id: "gal-1",
        titulo: "Jornadas de orientación vocacional",
        descripcion: "Encuentro con jóvenes y familias para la postulación a becas solidarias.",
        categoria: "Comunidad",
        imagenUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        orden: 1,
      },
      {
        id: "gal-2",
        titulo: "Talleres de formación práctica",
        descripcion: "Prácticas de laboratorio y desarrollo de habilidades técnicas.",
        categoria: "Talleres",
        imagenUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        orden: 2,
      },
      {
        id: "gal-3",
        titulo: "Entrega de certificaciones",
        descripcion: "Celebración del logro de nuestros estudiantes graduados.",
        categoria: "Eventos",
        imagenUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        orden: 3,
      },
      {
        id: "gal-4",
        titulo: "Brigadas comunitarias de salud",
        descripcion: "Atención preventiva y apoyo a familias en territorios vulnerables.",
        categoria: "Salud",
        imagenUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        orden: 4,
      },
    ];
  }

  try {
    const { data, error } = await supabase
      .from("galeria")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      categoria: row.categoria,
      imagenUrl: row.imagen_url,
      altText: row.alt_text,
      orden: row.orden,
    }));
  } catch (err) {
    console.warn("[API] Error consultando galería:", err);
    return [];
  }
}

// ============================================================================
// 4. INSCRIPCIONES Y CONTACTO
// ============================================================================

export interface CrearInscripcionInput {
  nombreCompleto: string;
  documentoTipo: string;
  documentoNumero: string;
  telefono: string;
  correo: string;
  ciudad: string;
  programaNombre: string;
  programaId?: string | undefined;
}

export async function crearInscripcion(input: CrearInscripcionInput): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseAvailable()) {
    console.log("[API Local] Inscripción recibida en modo local:", input);
    return { ok: true };
  }

  try {
    const { error } = await supabase.from("inscripciones").insert({
      nombre_completo: input.nombreCompleto,
      documento_tipo: input.documentoTipo,
      documento_numero: input.documentoNumero,
      telefono: input.telefono,
      correo: input.correo,
      ciudad: input.ciudad,
      programa_nombre: input.programaNombre,
      programa_id: input.programaId || null,
      estado: "nuevo",
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export interface EnviarMensajeInput {
  nombre: string;
  correo: string;
  telefono?: string | undefined;
  asunto: string;
  mensaje: string;
}

export async function enviarMensajeContacto(input: EnviarMensajeInput): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseAvailable()) {
    console.log("[API Local] Mensaje de contacto recibido en modo local:", input);
    return { ok: true };
  }

  try {
    const { error } = await supabase.from("mensajes_contacto").insert({
      nombre: input.nombre,
      correo: input.correo,
      telefono: input.telefono || null,
      asunto: input.asunto,
      mensaje: input.mensaje,
      leido: false,
      estado: "nuevo",
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// ============================================================================
// 5. DATOS INSTITUCIONALES (CONFIGURACIÓN)
// ============================================================================

export async function getOrganizationData(): Promise<Organization> {
  if (!isSupabaseAvailable()) {
    return funasfData.org as Organization;
  }

  try {
    const { data } = await supabase
      .from("configuracion")
      .select("valor")
      .eq("clave", "institucional")
      .maybeSingle();

    if (data?.valor && typeof data.valor === "object") {
      return { ...funasfData.org, ...(data.valor as Record<string, unknown>) } as Organization;
    }
  } catch {
    // fallback
  }

  return funasfData.org as Organization;
}

export async function getQuienesSomos(): Promise<QuienesSomos> {
  return funasfData.quienesSomos as QuienesSomos;
}

export async function getProposito(): Promise<Proposito> {
  return funasfData.proposito as Proposito;
}

export async function getBecas(): Promise<Beca> {
  return funasfData.becas as Beca;
}

export async function getCategoriasProgramas(): Promise<CategoriaProgramas[]> {
  return funasfData.categoriasProgramas as CategoriaProgramas[];
}

export async function getProgramasSociales(): Promise<ProgramaSocial[]> {
  return funasfData.programasSociales as ProgramaSocial[];
}

export async function getAlcance(): Promise<Alcance> {
  return funasfData.alcance as Alcance;
}

export async function getValores(): Promise<Valor[]> {
  return funasfData.valores as Valor[];
}

export async function getFaqs(): Promise<FAQ[]> {
  return funasfData.faq as FAQ[];
}

export async function getLlamadoAccion(): Promise<LlamadoAccion> {
  return funasfData.llamadoAccion as LlamadoAccion;
}

export async function getHomeData() {
  const [org, programas] = await Promise.all([
    getOrganizationData(),
    getProgramasAcademicos(),
  ]);

  return {
    org,
    programas,
    quienesSomos: funasfData.quienesSomos,
    proposito: funasfData.proposito,
    becas: funasfData.becas,
    categoriasProgramas: funasfData.categoriasProgramas,
    programasSociales: funasfData.programasSociales,
    alcance: funasfData.alcance,
    faq: funasfData.faq,
    llamadoAccion: funasfData.llamadoAccion,
    valores: funasfData.valores,
  };
}
