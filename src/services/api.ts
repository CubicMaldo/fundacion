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

    return data.map((row) => {
      const fallbackProg = programasAcademicos.find(
        (p) =>
          p.slug === row.slug || p.nombre.toLowerCase().trim() === row.nombre?.toLowerCase().trim(),
      );
      return {
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
        imagenUrl:
          (row as { imagen_url?: string | null }).imagen_url ||
          fallbackProg?.imagenUrl ||
          undefined,
      };
    });
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

    const fallbackProg = programasAcademicos.find(
      (p) =>
        p.slug === data.slug || p.nombre.toLowerCase().trim() === data.nombre?.toLowerCase().trim(),
    );

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
      imagenUrl:
        (data as { imagen_url?: string | null }).imagen_url || fallbackProg?.imagenUrl || undefined,
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
        resumen:
          "FUNASF abre postulaciones para programas técnicos en áreas de salud, administración y bienestar comunitario.",
        contenido:
          "La Fundación Internacional Amigos Sin Fronteras inicia un nuevo ciclo formativo enfocado en brindar oportunidades reales de desarrollo humano y profesional a jóvenes y adultos de diferentes regiones.\n\nNuestros programas en alianza con instituciones acreditadas permiten acceder a becas de hasta el 90 %, con un acompañamiento cercano para asegurar la permanencia y culminación de los estudios.",
        autorNombre: "Dirección Académica FUNASF",
        categoria: "Convocatorias",
        imagenPortada:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        fechaPublicacion: new Date().toISOString(),
      },
      {
        id: "art-2",
        slug: "el-impacto-de-la-solidaridad-en-las-comunidades",
        titulo: "Cómo la educación transforma territorios vulnerables",
        resumen:
          "Reflexiones sobre nuestro trabajo comunitario en el Valle del Cauca y la Costa Atlántica.",
        contenido:
          "En FUNASF creemos firmemente que la educación no tiene fronteras. Cuando una persona accede a capacitación técnica de calidad, no solo mejora sus ingresos futuros, sino que eleva el bienestar de su familia y entorno.",
        autorNombre: "Equipo de Trabajo Social",
        categoria: "Comunidad",
        imagenPortada:
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
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
        imagenUrl:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        orden: 1,
      },
      {
        id: "gal-2",
        titulo: "Talleres de formación práctica",
        descripcion: "Prácticas de laboratorio y desarrollo de habilidades técnicas.",
        categoria: "Talleres",
        imagenUrl:
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        orden: 2,
      },
      {
        id: "gal-3",
        titulo: "Entrega de certificaciones",
        descripcion: "Celebración del logro de nuestros estudiantes graduados.",
        categoria: "Eventos",
        imagenUrl:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        orden: 3,
      },
      {
        id: "gal-4",
        titulo: "Brigadas comunitarias de salud",
        descripcion: "Atención preventiva y apoyo a familias en territorios vulnerables.",
        categoria: "Salud",
        imagenUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
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

export async function crearInscripcion(
  input: CrearInscripcionInput,
): Promise<{ ok: boolean; error?: string }> {
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

export async function enviarMensajeContacto(
  input: EnviarMensajeInput,
): Promise<{ ok: boolean; error?: string }> {
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
// 5. DATOS INSTITUCIONALES (CONFIGURACIÓN Y SETTINGS CENTRALIZADOS)
// ============================================================================

export interface SiteContactoConfig {
  telefonos: string[];
  telefonoPrincipal: string;
  whatsappLink: string;
  correo: string;
  instagram: string;
  instagramUrl: string;
  direccionPrincipal: string;
  ciudadPrincipal: string;
  formularioInscripcion: string;
  horario: string;
}

export interface SiteInstitucionalConfig {
  nombre: string;
  sigla: string;
  razonSocial: string;
  nit: string;
  eslogan: string;
  esloganSecundario: string;
  frases: string[];
}

export interface SiteSettings {
  contacto: SiteContactoConfig;
  institucional: SiteInstitucionalConfig;
  becas: typeof funasfData.becas;
  org: typeof funasfData.org;
}

/**
 * Asegura que cualquier número telefónico colombiano incluya el prefijo internacional +57
 */
export function formatColPhone(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  if (trimmed.startsWith("+57")) {
    return trimmed;
  }
  if (/^57\s*\d/.test(trimmed)) {
    return `+${trimmed}`;
  }
  return `+57 ${trimmed}`;
}

export function cleanPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("57") ? digits : `57${digits}`;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  org: funasfData.org,
  contacto: {
    telefonos: funasfData.org.telefonos.map(formatColPhone),
    telefonoPrincipal: formatColPhone(funasfData.org.telefonos[0] ?? "+57 313 577 9384"),
    whatsappLink: `https://wa.me/${cleanPhoneDigits(funasfData.org.telefonos[0] ?? "+57 313 577 9384")}`,
    correo: funasfData.org.correo,
    instagram: funasfData.org.instagram,
    instagramUrl: funasfData.org.instagramUrl,
    direccionPrincipal: funasfData.org.direccionPrincipal,
    ciudadPrincipal: funasfData.org.ciudadPrincipal,
    formularioInscripcion: funasfData.org.formularioInscripcion,
    horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
  },
  institucional: {
    nombre: funasfData.org.nombre,
    sigla: funasfData.org.sigla,
    razonSocial: funasfData.org.razonSocial,
    nit: funasfData.org.nit,
    eslogan: funasfData.org.eslogan,
    esloganSecundario: funasfData.org.esloganSecundario,
    frases: funasfData.org.frases,
  },
  becas: funasfData.becas,
};

export function sanitizeDomain(str: string): string {
  if (!str) return str;
  return str
    .replace(/@funasf\.org/gi, "@edufunasf.org")
    .replace(/www\.funasf\.org/gi, "www.edufunasf.org");
}

export function saveLocalSiteSettingsOverride(partial: {
  contacto?: Partial<SiteContactoConfig>;
  institucional?: Partial<SiteInstitucionalConfig>;
  becas?: Partial<typeof funasfData.becas>;
}) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("funasf_site_settings_override");
    const current = raw ? JSON.parse(raw) : {};
    const merged = {
      contacto: { ...(current.contacto || {}), ...(partial.contacto || {}) },
      institucional: { ...(current.institucional || {}), ...(partial.institucional || {}) },
      becas: { ...(current.becas || {}), ...(partial.becas || {}) },
    };
    localStorage.setItem("funasf_site_settings_override", JSON.stringify(merged));
  } catch {
    // ignore
  }
}

export function getLocalSiteSettingsOverride(): {
  contacto?: Partial<SiteContactoConfig>;
  institucional?: Partial<SiteInstitucionalConfig>;
  becas?: Partial<typeof funasfData.becas>;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("funasf_site_settings_override");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const localOverride = getLocalSiteSettingsOverride();

  if (!isSupabaseAvailable()) {
    if (!localOverride) return DEFAULT_SITE_SETTINGS;
    return {
      contacto: { ...DEFAULT_SITE_SETTINGS.contacto, ...(localOverride.contacto || {}) },
      institucional: {
        ...DEFAULT_SITE_SETTINGS.institucional,
        ...(localOverride.institucional || {}),
      },
      becas: { ...DEFAULT_SITE_SETTINGS.becas, ...(localOverride.becas || {}) },
      org: {
        ...DEFAULT_SITE_SETTINGS.org,
        ...(localOverride.institucional || {}),
        ...(localOverride.contacto || {}),
      },
    };
  }

  try {
    const { data, error } = await supabase.from("configuracion").select("clave, valor");
    if (error || !data || data.length === 0) {
      if (!localOverride) return DEFAULT_SITE_SETTINGS;
      return {
        contacto: { ...DEFAULT_SITE_SETTINGS.contacto, ...(localOverride.contacto || {}) },
        institucional: {
          ...DEFAULT_SITE_SETTINGS.institucional,
          ...(localOverride.institucional || {}),
        },
        becas: { ...DEFAULT_SITE_SETTINGS.becas, ...(localOverride.becas || {}) },
        org: {
          ...DEFAULT_SITE_SETTINGS.org,
          ...(localOverride.institucional || {}),
          ...(localOverride.contacto || {}),
        },
      };
    }

    const configMap = new Map<string, Record<string, unknown>>();
    data.forEach((row) => {
      if (row.clave && row.valor && typeof row.valor === "object") {
        configMap.set(row.clave, row.valor as Record<string, unknown>);
      }
    });

    const rawContacto = configMap.get("contacto") || {};
    const rawInstitucional = configMap.get("institucional") || {};
    const rawBecas = configMap.get("becas") || {};

    const rawTelefonos =
      Array.isArray(rawContacto["telefonos"]) && rawContacto["telefonos"].length > 0
        ? (rawContacto["telefonos"] as string[])
        : DEFAULT_SITE_SETTINGS.contacto.telefonos;

    const telefonos = rawTelefonos.map(formatColPhone);
    const telefonoPrincipal = telefonos[0] || DEFAULT_SITE_SETTINGS.contacto.telefonoPrincipal;
    const whatsappLink = `https://wa.me/${cleanPhoneDigits(telefonoPrincipal)}`;

    const rawCorreo = (rawContacto["correo"] as string) || DEFAULT_SITE_SETTINGS.contacto.correo;
    const correo = sanitizeDomain(rawCorreo);

    let contacto: SiteContactoConfig = {
      telefonos,
      telefonoPrincipal,
      whatsappLink,
      correo,
      instagram: (rawContacto["instagram"] as string) || DEFAULT_SITE_SETTINGS.contacto.instagram,
      instagramUrl:
        (rawContacto["instagramUrl"] as string) || DEFAULT_SITE_SETTINGS.contacto.instagramUrl,
      direccionPrincipal:
        (rawContacto["direccionPrincipal"] as string) ||
        DEFAULT_SITE_SETTINGS.contacto.direccionPrincipal,
      ciudadPrincipal:
        (rawContacto["ciudadPrincipal"] as string) ||
        DEFAULT_SITE_SETTINGS.contacto.ciudadPrincipal,
      formularioInscripcion:
        (rawContacto["formularioInscripcion"] as string) ||
        DEFAULT_SITE_SETTINGS.contacto.formularioInscripcion,
      horario: (rawContacto["horario"] as string) || DEFAULT_SITE_SETTINGS.contacto.horario,
    };

    let institucional: SiteInstitucionalConfig = {
      nombre: (rawInstitucional["nombre"] as string) || DEFAULT_SITE_SETTINGS.institucional.nombre,
      sigla: (rawInstitucional["sigla"] as string) || DEFAULT_SITE_SETTINGS.institucional.sigla,
      razonSocial:
        (rawInstitucional["razonSocial"] as string) ||
        (rawInstitucional["nombre"] as string) ||
        DEFAULT_SITE_SETTINGS.institucional.razonSocial,
      nit: (rawInstitucional["nit"] as string) || DEFAULT_SITE_SETTINGS.institucional.nit,
      eslogan:
        (rawInstitucional["eslogan"] as string) || DEFAULT_SITE_SETTINGS.institucional.eslogan,
      esloganSecundario:
        (rawInstitucional["esloganSecundario"] as string) ||
        DEFAULT_SITE_SETTINGS.institucional.esloganSecundario,
      frases:
        Array.isArray(rawInstitucional["frases"]) && rawInstitucional["frases"].length > 0
          ? (rawInstitucional["frases"] as string[])
          : DEFAULT_SITE_SETTINGS.institucional.frases,
    };

    let becas = {
      ...DEFAULT_SITE_SETTINGS.becas,
      ...rawBecas,
      porcentaje: (rawBecas["porcentaje"] as string) || DEFAULT_SITE_SETTINGS.becas.porcentaje,
      titulo: (rawBecas["titulo"] as string) || DEFAULT_SITE_SETTINGS.becas.titulo,
      intro: (rawBecas["intro"] as string) || DEFAULT_SITE_SETTINGS.becas.intro,
      aclaracion: (rawBecas["aclaracion"] as string) || DEFAULT_SITE_SETTINGS.becas.aclaracion,
      beneficios:
        Array.isArray(rawBecas["beneficios"]) && rawBecas["beneficios"].length > 0
          ? (rawBecas["beneficios"] as string[])
          : DEFAULT_SITE_SETTINGS.becas.beneficios,
    };

    if (localOverride) {
      if (localOverride.contacto) {
        contacto = { ...contacto, ...localOverride.contacto };
      }
      if (localOverride.institucional) {
        institucional = { ...institucional, ...localOverride.institucional };
      }
      if (localOverride.becas) {
        becas = { ...becas, ...localOverride.becas };
      }
    }

    const org = {
      ...funasfData.org,
      ...institucional,
      telefonos: contacto.telefonos,
      correo: contacto.correo,
      instagram: contacto.instagram,
      instagramUrl: contacto.instagramUrl,
      direccionPrincipal: contacto.direccionPrincipal,
      ciudadPrincipal: contacto.ciudadPrincipal,
      formularioInscripcion: contacto.formularioInscripcion,
      whatsapp: contacto.whatsappLink,
    };

    return {
      contacto,
      institucional,
      becas,
      org,
    };
  } catch (err) {
    console.warn("[API] Error obteniendo configuración:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function getCategorizedPrograms(programas: ProgramaAcademico[]): CategoriaProgramas[] {
  const categoryOrder = ["salud", "administracion", "sst", "educacion-social", "basica", "otras"];
  const categoryLabels: Record<string, string> = {
    salud: "Área de salud",
    administracion: "Administración y empresa",
    sst: "Seguridad y Salud en el Trabajo",
    "educacion-social": "Educación y área social",
    basica: "Educación básica",
    otras: "Otras áreas de formación",
  };

  const map = new Map<string, { id: string; categoria: string; programas: string[] }>();

  // Inicializar en el orden canónico
  categoryOrder.forEach((id) => {
    map.set(id, {
      id,
      categoria: categoryLabels[id] || id,
      programas: [],
    });
  });

  // Distribuir programas
  programas.forEach((p) => {
    const catId = p.categoriaId || "otras";
    if (!map.has(catId)) {
      map.set(catId, {
        id: catId,
        categoria: p.categoria || catId,
        programas: [],
      });
    }
    const catObj = map.get(catId)!;
    if (!catObj.programas.includes(p.nombre)) {
      catObj.programas.push(p.nombre);
    }
  });

  // Retornar solo categorías que tengan al menos 1 programa
  const result = Array.from(map.values()).filter((cat) => cat.programas.length > 0);
  return result.length > 0 ? result : (funasfData.categoriasProgramas as CategoriaProgramas[]);
}

export async function getOrganizationData(): Promise<Organization> {
  const settings = await getSiteSettings();
  return settings.org as unknown as Organization;
}

export async function getQuienesSomos(): Promise<QuienesSomos> {
  return funasfData.quienesSomos as QuienesSomos;
}

export async function getProposito(): Promise<Proposito> {
  return funasfData.proposito as Proposito;
}

export async function getBecas(): Promise<Beca> {
  const settings = await getSiteSettings();
  return settings.becas as unknown as Beca;
}

export async function getCategoriasProgramas(): Promise<CategoriaProgramas[]> {
  const programas = await getProgramasAcademicos();
  return getCategorizedPrograms(programas);
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
  const [settings, programas, articulos] = await Promise.all([
    getSiteSettings(),
    getProgramasAcademicos(),
    getArticulosPublicados(),
  ]);
  const categoriasProgramas = getCategorizedPrograms(programas);

  return {
    settings,
    org: settings.org,
    programas,
    articulos,
    quienesSomos: funasfData.quienesSomos,
    proposito: funasfData.proposito,
    becas: settings.becas as unknown as Beca,
    categoriasProgramas,
    programasSociales: funasfData.programasSociales,
    alcance: funasfData.alcance,
    faq: funasfData.faq,
    llamadoAccion: funasfData.llamadoAccion,
    valores: funasfData.valores,
  };
}
