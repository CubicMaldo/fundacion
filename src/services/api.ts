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

export const ARTICULOS_DEFAULT: ArticuloBlog[] = [
  {
    id: "post-sst-beca-90",
    slug: "becas-seguridad-salud-trabajo-diplomados",
    titulo: "Beca del 90% en Seguridad y Salud en el Trabajo con Diplomados Especializados",
    resumen:
      "FUNASF abre inscripciones para el programa técnico en Seguridad y Salud en el Trabajo con 90% de beca, sin costo de matrícula ni inscripción, e incluyendo tres diplomados certificados.",
    contenido:
      "La Fundación Internacional Amigos Sin Fronteras – FUNASF anuncia la apertura de su convocatoria institucional de becas para el programa de formación en Seguridad y Salud en el Trabajo (SST), dirigido a personas con vocación de proteger vidas y liderar entornos laborales seguros.\n\n### Beneficios del programa\n- **Beca de hasta el 90 %** otorgada por FUNASF.\n- **Sin costo de matrícula ni inscripción.**\n- **Tres diplomados complementarios incluidos:**\n  1. Manejo y Uso de Extintores.\n  2. Primeros Auxilios Básicos y Avanzados.\n  3. Trabajo Seguro en Alturas.\n\n### Perfil y campo de acción\nEl egresado en Seguridad y Salud en el Trabajo se capacita para:\n- Promover ambientes laborales seguros y saludables.\n- Identificar peligros, evaluar riesgos y ejecutar planes de prevención según la normatividad vigente.\n- Diseñar protocolos de emergencia y bienestar para empresas de cualquier sector productivo.\n\nPara mayor información y postulación inmediata a la beca, comunícate a nuestras líneas oficiales de atención WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**.",
    autorNombre: "Coordinación Académica FUNASF",
    categoria: "Convocatorias",
    imagenPortada: "/blog/sst-beca-90-diplomados.jpeg",
    fechaPublicacion: "2026-10-02T07:30:00.000Z",
  },
  {
    id: "post-sst-virtual",
    slug: "seguridad-salud-trabajo-modalidad-virtual",
    titulo: "Estudia Seguridad y Salud en el Trabajo 100% Virtual con FUNASF",
    resumen:
      "Aprende a tu propio ritmo con nuestra plataforma digital interactiva, clases dinámicas en vivo con docentes expertos y certificación laboral.",
    contenido:
      "La educación sin fronteras llega hasta tu hogar. FUNASF ofrece el programa en **Seguridad y Salud en el Trabajo en modalidad 100% virtual**, permitiendo a jóvenes y adultos capacitarse sin descuidar sus obligaciones laborales o familiares.\n\n### Ventajas de la modalidad virtual\n- **Plataforma fácil de usar:** Acceso las 24 horas a materiales, talleres, casos de estudio y evaluaciones.\n- **Clases dinámicas en vivo:** Interacción directa con docentes especialistas en prevención de riesgos laborales.\n- **Estudio a tu propio ritmo:** Flexibilidad horaria pensada para personas con empleo o responsabilidades en casa.\n- **Certificación oficial:** Respaldo formativo para vincularte formalmente al sector productivo.\n\n¡Tu futuro comienza hoy! Transforma tu proyecto de vida con el apoyo solidario de la Fundación. Escríbenos por WhatsApp al **+57 313 577 9384** o al **+57 318 915 7015** para reservar tu cupo becado.",
    autorNombre: "Área de Educación Virtual",
    categoria: "Educación",
    imagenPortada: "/blog/sst-modalidad-virtual.jpeg",
    fechaPublicacion: "2026-10-01T15:00:00.000Z",
  },
  {
    id: "post-mercadeo-ventas",
    slug: "estudia-mercadeo-y-ventas-beca-90",
    titulo: "¡Tu futuro se vende mejor con conocimiento! Beca del 90% en Mercadeo y Ventas",
    resumen:
      "Desarrolla habilidades comerciales, comunicación estratégica y talento para el liderazgo y ventas en un mercado de alta demanda laboral.",
    contenido:
      "En el mundo actual, saber vender es comunicar, conectar y liderar. FUNASF pone a disposición de la comunidad becas del 90% para el programa de formación en **Mercadeo y Ventas**, una de las áreas más demandadas por empresas comerciales y de servicios.\n\n### ¿Qué aprenderás?\n- **Técnicas de negociación y persuasión:** Conecta con clientes y presenta propuestas de valor convincentes.\n- **Estrategias de ventas modernas:** Manejo de canales físicos y digitales para comercializar productos y servicios.\n- **Servicio y fidelización de clientes:** Construcción de relaciones comerciales duraderas y de mutua confianza.\n- **Emprendimiento comercial:** Herramientas para crear y hacer crecer tu propio negocio independiente.\n\n### Condiciones del apoyo\n- **Beca del 90%:** Con el objetivo de que el aspecto económico no sea una barrera.\n- **Sin cobro de matrícula ni de inscripción.**\n\nComunícate hoy mismo con nuestros orientadores a través de WhatsApp: **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Equipo de Emprendimiento FUNASF",
    categoria: "Emprendimiento",
    imagenPortada: "/blog/mercadeo-ventas-beca-90.jpeg",
    fechaPublicacion: "2026-09-30T10:00:00.000Z",
  },
  {
    id: "post-sedes-atlantico-valledupar",
    slug: "expansion-sedes-atlantico-valledupar",
    titulo: "FUNASF expande su cobertura: Presencia en el Atlántico y próxima sede en Valledupar",
    resumen:
      "Estamos más cerca de ti en Santo Tomás, Ponedera, Sabanalarga y Soledad. Anunciamos además el inicio de gestiones para nuestra próxima apertura en Valledupar.",
    contenido:
      "Fieles al principio de que la educación no tiene fronteras y debe ser accesible cerca de las comunidades, la Fundación Internacional Amigos Sin Fronteras consolida su red de presencia en el departamento del Atlántico y proyecta su expansión al Cesar.\n\n### Cobertura en el Atlántico\nNuestras sedes y puntos de formación activa se encuentran en:\n- **Santo Tomás**\n- **Ponedera**\n- **Sabanalarga**\n- **Soledad**\n\nEn cada uno de estos municipios brindamos programas de formación técnica con becas del 90% y horarios flexibles para que la distancia nunca sea un obstáculo.\n\n### Próximamente en Valledupar\nNos complace anunciar que hemos iniciado los preparativos para llevar nuestra oferta académica y social a la ciudad de **Valledupar**, ampliando las oportunidades de becas y formación técnica laboral para la juventud y las familias cesarenses.\n\n¡Únete a la familia FUNASF! Juntos transformamos vidas. Contáctanos al **+57 313 577 9384** para consultar los puntos de atención y horarios en tu municipio.",
    autorNombre: "Dirección Territorial FUNASF",
    categoria: "Sedes",
    imagenPortada: "/blog/sedes-atlantico-valledupar.jpeg",
    fechaPublicacion: "2026-09-29T14:30:00.000Z",
  },
  {
    id: "post-primera-infancia-tea",
    slug: "primera-infancia-diplomado-tea-tdah",
    titulo: "Primera Infancia con Diplomado en Niños con TEA y TDAH",
    resumen:
      "Fórmate como agente educativo capacitado en neurodiversidad, inclusión y atención pedagógica diferencial para niños con TEA y TDAH con beca del 90%.",
    contenido:
      "El desarrollo infantil temprano exige profesionales con profunda sensibilidad humana y sólidos conocimientos pedagógicos. FUNASF abre convocatorias para el programa técnico en **Primera Infancia**, complementado con un **Diplomado Especializado en Niños con Trastorno del Espectro Autista (TEA) y Déficit de Atención (TDAH)**.\n\n### Ejes de formación\n- **Pedagogía inclusiva:** Estrategias de estimulación sensorial, motriz y cognitiva para la primera infancia.\n- **Manejo en el aula de TEA y TDAH:** Acompañamiento respetuoso, rutinas estructuradas y comunicación alternativa.\n- **Desarrollo socioafectivo:** Fortalecimiento del vínculo, la autoestima y la resiliencia en la niñez.\n- **Horarios flexibles:** Modalidades diurnas, nocturnas y de fin de semana adaptadas a tus tiempos.\n\n### Facilidades de acceso\n- **Beca institucional de hasta el 90%.**\n- **Cero costo en matrícula y sin valor de inscripción.**\n\nEscríbenos hoy por WhatsApp al **+57 313 577 9384** o al **+57 318 915 7015** y asegura tu beca en este ciclo educativo.",
    autorNombre: "Área de Pedagogía Infantil",
    categoria: "Educación",
    imagenPortada: "/blog/primera-infancia-tea-tdah.jpeg",
    fechaPublicacion: "2026-09-28T09:15:00.000Z",
  },
  {
    id: "post-admin-salud-demanda",
    slug: "administracion-en-salud-alta-demanda-laboral",
    titulo: "¿Por qué estudiar Administración en Salud? Gran demanda y oportunidades laborales",
    resumen:
      "El sector salud requiere coordinadores y auxiliares administrativos capacitados en facturación, admisiones y gestión asistencial. Conoce cómo postularte con beca del 90%.",
    contenido:
      "La salud es uno de los sectores con mayor crecimiento y necesidad constante de personal calificado en el país. El programa de **Administración en Salud** de FUNASF prepara a personas para ser piezas fundamentales en la organización de clínicas, hospitales, EPS e IPS.\n\n### Razones para elegir Administración en Salud\n1. **Alta demanda en el campo laboral:** Todas las instituciones de salud necesitan expertos en facturación, admisiones, triage administrativo y autorizaciones.\n2. **Gestión con calidad humana:** Aprende a coordinar procesos que garantizan una atención oportuna y digna para el paciente.\n3. **Crecimiento profesional y personal:** Una carrera técnica que abre puertas a puestos de coordinación y administración en salud pública y privada.\n4. **Impacto comunitario:** Contribuyes de forma directa al bienestar y la salud de la población.\n\nAprovecha nuestra beca de hasta el 90%, sin cobros de matrícula ni inscripción. Solicita más detalles a través de WhatsApp en el **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Dirección de Programas de Salud",
    categoria: "Salud",
    imagenPortada: "/blog/administracion-salud-demanda.jpeg",
    fechaPublicacion: "2026-09-27T16:00:00.000Z",
  },
  {
    id: "post-aux-enfermeria",
    slug: "auxiliar-de-enfermeria-vocacion-servicio-beca",
    titulo: "Auxiliar de Enfermería: Cuidar es más que una profesión, es un acto de amor",
    resumen:
      "Prepárate para cuidar, acompañar y transformar vidas con tu vocación de servicio. Clases prácticas y teóricas con beca del 90% respaldada por FUNASF.",
    contenido:
      "«Formamos con amor, servimos con vocación, transformamos vidas sin fronteras». El programa de **Auxiliar de Enfermería** es una de las iniciativas insignia de FUNASF para personas que sienten el llamado de cuidar a quienes más lo necesitan.\n\n### Características de la formación\n- **Formación de alta calidad:** Aulas prácticas dotadas para simulaciones clínicas y docentes con experiencia en el sector hospitalario.\n- **Certificación por competencias:** Avalado y reconocido para el ejercicio asistencial.\n- **Horarios flexibles:** Pensados para personas que requieren alternar sus estudios con el trabajo o el hogar.\n- **Vocación que deja huella:** Aprende procedimientos de enfermería, primeros auxilios, cuidado hospitalario y atención domiciliaria.\n\n### Acceso a la Beca 90%\n- No pagas costo de matrícula ni derecho de inscripción.\n- Acompañamiento y seguimiento académico durante todo el proceso.\n\n¡Inscríbete ya y sé parte del cambio que el mundo necesita! Escríbenos al **+57 318 915 7015**, **+57 313 577 9384** o **+57 321 576 5250**.",
    autorNombre: "Escuela de Enfermería FUNASF",
    categoria: "Salud",
    imagenPortada: "/blog/auxiliar-enfermeria-vocacion.jpeg",
    fechaPublicacion: "2026-09-26T11:20:00.000Z",
  },
  {
    id: "post-primera-infancia-vocacion",
    slug: "vocacion-por-la-primera-infancia-becas",
    titulo: "Estudia Primera Infancia: Transforma vidas desde el amor y la pedagogía",
    resumen:
      "Los primeros años definen el futuro de una persona. Fórmate con FUNASF para guiar, proteger y estimular el desarrollo de nuestros niños con beca del 90%.",
    contenido:
      "En FUNASF creemos que la educación de los niños es la semilla más valiosa para transformar una sociedad. Nuestro programa de **Primera Infancia** está diseñado para formar auxiliares docentes y cuidadores con sólida formación ética, humana y lúdica.\n\n### Lo que lograrás en el programa\n- **Desarrollar tu vocación:** Aprende metodologías activas como el juego, el arte, la literatura y la exploración del medio.\n- **Promover el bienestar infantil:** Identificación de alertas en nutrición, desarrollo motriz y pautas de crianza positiva.\n- **Ambientes de aprendizaje enriquecidos:** Creación de material didáctico creativo y adaptado a diferentes contextos comunitarios.\n\n### Beca institucional FUNASF\n- **90% de cobertura en la colegiatura.**\n- **Sin pago de matrícula ni cobro de inscripción.**\n\nComunícate a nuestros canales de WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**. «¡Tu futuro comienza hoy, transforma vidas desde el amor!»",
    autorNombre: "Comité Pedagógico FUNASF",
    categoria: "Educación",
    imagenPortada: "/blog/primera-infancia-amor-vocacion.jpeg",
    fechaPublicacion: "2026-09-25T14:00:00.000Z",
  },
  {
    id: "post-aux-electricidad",
    slug: "auxiliar-electricidad-ponedera-santo-tomas",
    titulo: "Convocatoria Técnica: Auxiliar Laboral en Electricidad en Ponedera y Santo Tomás",
    resumen:
      "Capacítate en instalaciones eléctricas residenciales y comerciales con talleres prácticos, certificación oficial y beca del 90% en Ponedera y Santo Tomás.",
    contenido:
      "El sector de la energía y las instalaciones eléctricas ofrece alta empleabilidad y excelentes oportunidades para el trabajo técnico independiente. FUNASF abre cupos becados para el programa de **Auxiliar Laboral en Electricidad** en las sedes de **Ponedera y Santo Tomás**.\n\n### Contenido práctico del programa\n- **Instalaciones eléctricas residenciales y comerciales:** Montaje de acometidas, tableros de distribución, circuitos y luminarias.\n- **Normas de seguridad eléctrica y RETIE:** Prevención de accidentes eléctricos y uso adecuado de equipo de protección personal.\n- **Mantenimiento y diagnóstico de fallas:** Detección de cortocircuitos, reparación de redes y optimización de consumo de energía.\n- **Talleres 100% prácticos:** Clases con herramientas y paneles de prueba reales.\n\n### Beca del 90% FUNASF\n- Sin pagar matrícula ni costo de inscripción.\n- Sedes disponibles: **Ponedera** y **Santo Tomás**.\n\nEscríbenos por WhatsApp para solicitar tu formulario de beca: **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Área Técnica e Industrial",
    categoria: "Técnica",
    imagenPortada: "/blog/auxiliar-electricidad-practica.jpeg",
    fechaPublicacion: "2026-09-24T10:30:00.000Z",
  },
  {
    id: "post-sede-ponedera",
    slug: "sede-ponedera-colegio-candelaria",
    titulo: "¡Nueva sede en Ponedera! Clases fines de semana en el Colegio de La Candelaria",
    resumen:
      "Confirmamos nuestro punto académico presencial en Ponedera en el Colegio Agropecuario de La Candelaria, con clases prácticas los días sábados y domingos.",
    contenido:
      "Con gran alegría compartimos con la comunidad del departamento del Atlántico la apertura de nuestro centro de formación presencial en el municipio de **Ponedera**.\n\n### Ubicación e instalaciones\n- **Lugar:** Colegio Agropecuario de La Candelaria (ubicado al lado del estadio municipal).\n- **Días de clase:** Sábados y Domingos en jornadas diurnas y flexibles.\n- **Programas ofertados:** Electricidad, Construcción de Edificaciones, Secretariado Ejecutivo, Primera Infancia, Validación de Bachillerato y más.\n\n### Propósito comunitario\nEsta sede acerca las oportunidades educativas a los habitantes de Ponedera y municipios vecinos, evitando gastos de traslado hacia Barranquilla y permitiendo a jóvenes y adultos formarse cerca de su hogar.\n\n«Educación que transforma, amistad que no tiene fronteras». Los esperamos. Para inscripciones e informes de matrícula, comunícate al **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Coordinación Regional Atlántico",
    categoria: "Sedes",
    imagenPortada: "/blog/sede-ponedera-candelaria.jpeg",
    fechaPublicacion: "2026-09-23T16:45:00.000Z",
  },
  {
    id: "post-ingles-avanzado",
    slug: "ingles-avanzado-oportunidades-internacionales",
    titulo: "Inglés Avanzado con enfoque conversacional y oportunidades laborales internacionales",
    resumen:
      "Abre nuevos caminos profesionales con metodología conversacional, clubes de habla inmersivos y horarios flexibles con beca otorgada por FUNASF.",
    contenido:
      "El dominio del inglés es la llave maestra para acceder a mejores salarios, trabajo remoto y vacantes en compañías multinacionales. El programa de **Inglés Avanzado de FUNASF** se enfoca en que hables con confianza desde el primer ciclo.\n\n### Metodología del programa\n1. **Horarios flexibles:** Opciones entre semana y fines de semana.\n2. **Curso con práctica intensiva:** Simulaciones de entrevistas de trabajo, redacción de correos y presentaciones comerciales.\n3. **Inglés conversatorio:** Debates dinámicos para perder el miedo y ganar fluidez natural.\n4. **Trabajo de campo y proyectos:** Aplicación práctica en situaciones reales del mercado global.\n\n### Beca y facilidades\n- No pagas matrícula ni inscripción.\n- Material didáctico interactivo incluido.\n\n¡Pide tu beca hoy mismo! Escríbenos vía WhatsApp: **+57 318 915 7015** o **+57 313 577 9384**. ¡Tu futuro no tiene fronteras!",
    autorNombre: "Centro de Idiomas FUNASF",
    categoria: "Idiomas",
    imagenPortada: "/blog/ingles-avanzado-internacional.jpeg",
    fechaPublicacion: "2026-09-22T08:30:00.000Z",
  },
  {
    id: "post-valida-bachillerato",
    slug: "valida-tu-bachillerato-en-6-meses",
    titulo: "Valida tu bachillerato en 6 meses con beca del 90% y metodología por módulos",
    resumen:
      "Nunca es tarde para cumplir tus metas. Obtén tu título de bachiller académico en un ciclo intensivo de 6 meses adaptado a jóvenes y adultos.",
    contenido:
      "¿Aún no has culminado tu bachillerato? En FUNASF creemos firmemente que cada persona merece una segunda oportunidad para progresar. Te presentamos nuestro programa de **Validación del Bachillerato en 6 meses con el 90% de beca**.\n\n### Ventajas de nuestro modelo de validación\n- **Duración acelerada:** Culmina tu ciclo académico en solo 6 meses de estudio enfocado.\n- **Metodología por módulos:** Avanzas materia por materia, afianzando los conceptos esenciales.\n- **Horarios flexibles:** Clases fines de semana o nocturnas para no interferir con tu trabajo.\n- **Cero costo de matrícula e inscripción.**\n\n### Requisitos mínimos\n- Documento de identidad vigente.\n- Certificados de años anteriores cursados (o prueba de nivelación diagnóstica).\n- Deseo de superación y compromiso con tu aprendizaje.\n\n¡Pide tu beca hoy y comienza a construir tu futuro! Llama o escribe al **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Coordinación de Educación Básica",
    categoria: "Bachillerato",
    imagenPortada: "/blog/bachillerato-acelerado-6-meses.jpeg",
    fechaPublicacion: "2026-09-21T13:00:00.000Z",
  },
  {
    id: "post-construccion-edificaciones",
    slug: "auxiliar-construccion-edificaciones-ponedera",
    titulo: "Técnico Laboral Auxiliar de Construcción de Edificaciones en Ponedera",
    resumen:
      "Fórmate en interpretación de planos, estructuras, acabados, obra blanca y seguridad en obra con beca del 90% en la sede Ponedera.",
    contenido:
      "El crecimiento urbanístico y las obras de infraestructura en la región demandan personal técnico preparado en técnicas constructivas modernas. FUNASF presenta el programa **Técnico Laboral Auxiliar de Construcción de Edificaciones** con sede en **Ponedera**.\n\n### ¿Qué vas a aprender?\n- **Interpretación de planos técnicos:** Lectura arquitectónica, estructural y de redes hidrosanitarias y eléctricas.\n- **Construcción de estructuras:** Fundición de zapatas, columnas, vigas y levantamiento de muros.\n- **Acabados y obra blanca:** Enchapes, estuco, pintura y detalles de terminación de alta calidad.\n- **Seguridad en obra:** Prevención de accidentes en obra, uso de EPP y normatividad constructiva.\n- **Herramientas y materiales:** Manejo eficiente de mezclas, herramientas manuales y maquinaria liviana.\n\n### Beca del 90%\n- Sin pagar matrícula ni inscripción.\n- Sede de aplicación: **Ponedera**.\n\n¡Tu futuro se construye hoy! Escríbenos al **+57 318 915 7015** o al **+57 313 577 9384** para registrar tu solicitud de beca.",
    autorNombre: "Escuela de Construcción e Infraestructura",
    categoria: "Construcción",
    imagenPortada: "/blog/construccion-edificaciones-ponedera.jpeg",
    fechaPublicacion: "2026-09-20T11:00:00.000Z",
  },
  {
    id: "post-belleza-integral",
    slug: "estudia-belleza-integral-y-crea-tu-empresa",
    titulo:
      "Estudia Belleza Integral y Crea tu Propia Empresa: Uñas, Maquillaje, Cabello y Masajes",
    resumen:
      "Conviértete en profesional del estilismo y la estética con formación completa y asesoría para emprender tu propio negocio independiente.",
    contenido:
      "El sector de la estética y el cuidado personal es uno de los más rentables y con mayor dinamismo para emprender. FUNASF te invita a estudiar **Belleza Integral** y poner en marcha tu propio centro de estética o servicio a domicilio.\n\n### Plan de estudios completo en 4 módulos\n1. **Toda clase de uñas:** Manicure clásico, semipermanente, uñas acrílicas, polygel y diseños avanzados (nail art).\n2. **Maquillaje profesional:** Maquillaje social, de día, noche, novias y técnicas de contorno y visagismo.\n3. **Cuidado y diseño capilar:** Cortes modernos, peinados para eventos, colorimetría y tratamientos capilares.\n4. **Masajes estéticos:** Masaje relajante, descontracturante, drenaje linfático y técnicas de spa.\n\n### Facilidades de pago\n- **Beca del 90% institucional.**\n- **No pagas matrícula y tampoco inscripción.**\n- **Horarios flexibles adaptados a ti.**\n\n¡Tu talento puede cambiar tu vida! Escribe hoy por WhatsApp al **+57 318 915 7015** o **+57 313 577 9384** y pide tu beca de inmediato.",
    autorNombre: "Escuela de Estética y Bienestar",
    categoria: "Emprendimiento",
    imagenPortada: "/blog/belleza-integral-emprendimiento.jpeg",
    fechaPublicacion: "2026-09-19T15:30:00.000Z",
  },
  {
    id: "post-secretariado-ejecutivo",
    slug: "tecnico-secretariado-ejecutivo-ponedera-santo-tomas",
    titulo: "Técnico Laboral en Secretariado Ejecutivo: Liderazgo administrativo para empresas",
    resumen:
      "Aprende redacción ejecutiva, gestión documental, atención al cliente y herramientas de oficina digital en las sedes de Ponedera y Santo Tomás.",
    contenido:
      "Las secretarias y asistentes ejecutivos son el motor administrativo y de coordinación en empresas, consultorios y entidades públicas. FUNASF anuncia la convocatoria de becas para el programa **Técnico Laboral en Secretariado Ejecutivo** en **Ponedera y Santo Tomás**.\n\n### Habilidades que desarrollarás\n- **Gestión documental y archivo digital:** Organización sistemática de expedientes, bases de datos y correspondencia corporativa.\n- **Redacción comercial y ejecutiva:** Elaboración de actas, informes, circulares y correos profesionales con impecable ortografía.\n- **Atención y servicio de excelencia:** Protocolo de recepción, atención telefónica y comunicación asertiva con clientes y directivos.\n- **Herramientas ofimáticas:** Dominio de procesadores de texto, hojas de cálculo, presentaciones y software de agenda.\n\n### Becas disponibles\n- **Beca del 90%** en la mensualidad del programa.\n- **Sin pago de matrícula ni derechos de inscripción.**\n- **Certificación oficial como Técnico Laboral.**\n\nSedes de aplicación: **Ponedera** y **Santo Tomás**. ¡Inscríbete ya! Comunícate a los WhatsApp: **+57 313 577 9384** o **+57 318 915 7015**.",
    autorNombre: "Área de Administración y Gestión",
    categoria: "Administración",
    imagenPortada: "/blog/secretariado-ejecutivo-tecnico.jpeg",
    fechaPublicacion: "2026-09-18T10:15:00.000Z",
  },
  {
    id: "post-admin-salud-liderazgo",
    slug: "lideres-en-administracion-en-salud-comunitaria",
    titulo: "Formamos Líderes Comprometidos con la Salud y el Bienestar Comunitario",
    resumen:
      "La gestión de la salud requiere profesionales con sólidos principios éticos y técnicos. Conoce el programa de Administración en Salud con beca del 90%.",
    contenido:
      "El sistema de salud colombiano exige profesionales que no solo conozcan los procesos de auditoría, admisiones y cuentas médicas, sino que mantengan un firme compromiso con la dignidad del usuario.\n\n### El rol del Administrador en Salud de FUNASF\nEn nuestra institución formamos personas capacitadas para:\n- Coordinar agendas médicas y salas de espera con criterio de equidad y calidez humana.\n- Garantizar la correcta custodia de historias clínicas y confidencialidad de datos asistenciales.\n- Gestionar convenios, facturación ante el ADRES y liquidación de servicios hospitalarios.\n- Promover proyectos comunitarios de salud preventiva y bienestar familiar.\n\n### Apoyo solidario FUNASF\n- Beca institucional de hasta el 90 %.\n- Sin cobro de matrícula ni cobro de inscripción.\n- Acompañamiento tutorial en cada semestre.\n\nPara postularte, contáctanos a nuestras líneas oficiales de WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**. «La solidaridad no conoce de fronteras».",
    autorNombre: "Dirección Académica FUNASF",
    categoria: "Salud",
    imagenPortada: "/blog/administracion-salud-lideres.jpeg",
    fechaPublicacion: "2026-09-17T14:00:00.000Z",
  },
  {
    id: "post-curso-vigilancia",
    slug: "curso-vigilancia-seguridad-4-meses",
    titulo: "Curso de Vigilancia en 4 Meses: Prácticas de tiro y certificado oficial de seguridad",
    resumen:
      "Capacitación intensiva en vigilancia privada, defensa preventiva, control de accesos y prácticas de tiro con horarios flexibles y rápida vinculación laboral.",
    contenido:
      "El sector de la vigilancia y seguridad privada ofrece una de las tasas de vinculación laboral más rápidas del país. FUNASF presenta su **Curso de Vigilancia en 4 Meses con Certificación Oficial**.\n\n### Puntos clave del curso\n1. **Horario flexible:** Elige el turno que mejor se adapte a tu disponibilidad diaria.\n2. **Prácticas de tiro y polígono:** Entrenamiento técnico práctico en manejo responsable y seguro de armamento autorizado.\n3. **Duración de solo 4 meses:** Formación completa y expedita para comenzar a trabajar en el menor tiempo posible.\n4. **Valores institucionales:** Seguridad, disciplina y compromiso con la protección ciudadana y patrimonial.\n\n### Beneficios del apoyo FUNASF\n- **Sin pago de matrícula y tampoco de inscripción.**\n- Facilidades de pago por cuotas mínimas para los gastos operativos.\n\n¡Tu futuro comienza hoy! Escribe al WhatsApp **+57 318 915 7015** o al **+57 313 577 9384** y solicita tu beca de inmediato.",
    autorNombre: "Área de Seguridad y Convivencia",
    categoria: "Seguridad",
    imagenPortada: "/blog/curso-vigilancia-seguridad-tiro.jpeg",
    fechaPublicacion: "2026-09-16T09:45:00.000Z",
  },
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
    fechaPublicacion: "2026-09-15T08:00:00.000Z",
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
    fechaPublicacion: "2026-09-14T08:00:00.000Z",
  },
];

export async function getArticulosPublicados(): Promise<ArticuloBlog[]> {
  if (!isSupabaseAvailable()) {
    return ARTICULOS_DEFAULT;
  }

  try {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .eq("estado", "publicado")
      .order("fecha_publicacion", { ascending: false });

    if (error || !data || data.length === 0) {
      return ARTICULOS_DEFAULT;
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
    return ARTICULOS_DEFAULT;
  }
}

export async function getArticuloBySlug(slug: string): Promise<ArticuloBlog | null> {
  if (!isSupabaseAvailable()) {
    return ARTICULOS_DEFAULT.find((a) => a.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .eq("slug", slug)
      .eq("estado", "publicado")
      .maybeSingle();

    if (error || !data) {
      return ARTICULOS_DEFAULT.find((a) => a.slug === slug) ?? null;
    }

    return {
      id: data.id,
      slug: data.slug,
      titulo: data.titulo,
      resumen: data.resumen,
      contenido: data.contenido,
      autorNombre: data.autor_nombre,
      categoria: data.categoria,
      imagenPortada: data.imagen_portada,
      fechaPublicacion: data.fecha_publicacion || data.created_at,
    };
  } catch (err) {
    console.warn(`[API] Error consultando artículo "${slug}":`, err);
    return ARTICULOS_DEFAULT.find((a) => a.slug === slug) ?? null;
  }
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
