/**
 * Contenido institucional FUNASF.
 * Fuente: documento "Contenido Web FUNASF" y RUT actualizado.
 * NO agregar datos que no provengan de esos documentos.
 * Los textos marcados como PENDIENTE deben ser suministrados por el cliente.
 */

export const PENDIENTE = "PENDIENTE";

export const org = {
  nombre: "Fundación Internacional Amigos Sin Fronteras",
  sigla: "FUNASF",
  razonSocial: "FUNDACION INTERNACIONAL AMIGOS SIN FRONTERAS",
  eslogan: "Porque la educación no tiene fronteras.",
  esloganSecundario: "Una oportunidad puede comenzar con una conversación.",
  frases: [
    "Somos los pies, las manos y la voz de los más necesitados.",
    "Aquí la solidaridad no conoce fronteras.",
  ],
  nit: "901964394-1",
  tipoContribuyente: "Persona jurídica",
  ciudadPrincipal: "Cali, Valle del Cauca — Colombia",
  direccionPrincipal: "CR 96 45 119, Cali",
  telefonos: ["313 577 9384", "318 915 7015", "323 294 6184", "317 165 7124"],
  correo: "info@funasf.org",
  sitioWeb: "www.funasf.org",
  instagram: "@funasfinternacional",
  instagramUrl: "https://instagram.com/funasfinternacional",
  formularioInscripcion: "https://forms.gle/kYUoX2v1dewKUrMX8",
};

export const telefonoPrincipal = org.telefonos[0] ?? "";
export const whatsappLink = `https://wa.me/57${telefonoPrincipal.replace(/\s/g, "")}`;

export const quienesSomos = {
  intro:
    "La Fundación Internacional Amigos Sin Fronteras – FUNASF es una organización de carácter social orientada al desarrollo de programas y proyectos que contribuyen al bienestar, la educación, la formación, la inclusión y el fortalecimiento de las comunidades.",
  parrafos: [
    "Nuestro trabajo nace de una convicción: una oportunidad puede cambiar una vida, pero una comunidad unida puede transformar una sociedad.",
    "Desarrollamos iniciativas sociales, educativas, de formación para el trabajo, emprendimiento, salud, bienestar y apoyo comunitario. Para ello, articulamos esfuerzos con docentes, profesionales, voluntarios, instituciones, empresas, organizaciones sociales y personas comprometidas con la transformación social.",
  ],
  compromiso:
    "Trabajamos para que las oportunidades no estén determinadas únicamente por la capacidad económica de una persona. Por eso impulsamos programas de apoyo, becas, formación y acompañamiento social.",
  destacado:
    "En FUNASF creemos que la educación no tiene fronteras y que el conocimiento debe convertirse en una herramienta para transformar vidas.",
};

export const mision = [
  "Contribuir a la transformación social mediante programas de educación, formación, salud, emprendimiento, bienestar y acción comunitaria, brindando oportunidades especialmente a personas y comunidades en condición de vulnerabilidad.",
  "Promovemos el acceso a procesos de formación y desarrollo de capacidades, fortaleciendo la autonomía, el emprendimiento, la inclusión social y las oportunidades para mejorar la calidad de vida.",
  "Nuestra misión se fundamenta en la solidaridad, la dignidad humana, el respeto, la inclusión, la responsabilidad y el compromiso con las comunidades.",
];

export const vision = {
  parrafos: [
    "Ser una fundación reconocida a nivel nacional e internacional por su compromiso con la transformación social, la educación y el desarrollo humano.",
    "Buscamos consolidar una red de oportunidades que permita llevar programas sociales y educativos a diferentes territorios, especialmente a comunidades que requieren mayores posibilidades de acceso a la educación, la formación y el desarrollo económico y social.",
  ],
  futuro: [
    "Ampliar nuestra presencia territorial.",
    "Fortalecer nuestros programas de educación y formación.",
    "Incrementar las oportunidades de becas.",
    "Desarrollar nuevos proyectos sociales.",
    "Fortalecer nuestros programas de emprendimiento.",
    "Crear alianzas nacionales e internacionales.",
    "Promover el voluntariado.",
    "Impulsar proyectos de salud y bienestar.",
    "Generar oportunidades para jóvenes, adultos y familias.",
    "Llegar a más comunidades con el mensaje de que la educación no tiene fronteras.",
  ],
};

export const resenaHistorica = {
  titulo: "Una historia que nació en Panamá y se hizo realidad en Colombia",
  parrafos: [
    "La Fundación Internacional Amigos Sin Fronteras – FUNASF nace en Panamá, inspirada en el deseo de servir, ayudar y generar oportunidades para las personas y comunidades que más lo necesitan.",
    "Desde sus inicios, la Fundación fue concebida con una visión internacional: llevar solidaridad, educación y oportunidades más allá de las fronteras.",
    "Posteriormente, esta visión comenzó a ejecutarse en Colombia, donde FUNASF inicia y fortalece diferentes programas sociales, educativos y comunitarios, llevando su mensaje de solidaridad a diferentes territorios.",
    "Colombia se convierte así en uno de los principales escenarios para el desarrollo de nuestra misión, especialmente a través de programas de educación, formación técnica, emprendimiento, salud, bienestar y atención social.",
    "Con el paso del tiempo, FUNASF ha venido ampliando sus programas y fortaleciendo su presencia en diferentes comunidades, buscando que las personas puedan acceder a oportunidades de formación y desarrollo sin tener que abandonar su territorio.",
    "Hoy continuamos trabajando para llevar nuestra labor a nuevos territorios y construir alianzas nacionales e internacionales.",
  ],
  destacados: [
    "Nacimos en Panamá con una visión internacional y desarrollamos nuestra misión en Colombia.",
    "Para nosotros, las fronteras no representan límites: representan oportunidades para llegar más lejos.",
  ],
};

export const proposito = {
  titulo: "Transformar solidaridad en oportunidades",
  intro:
    "El propósito de FUNASF es contribuir a que las personas puedan desarrollar sus capacidades y encontrar nuevas oportunidades para mejorar sus condiciones de vida.",
  ejes: [
    {
      nombre: "Educación",
      icono: "GraduationCap",
      texto:
        "Promovemos el acceso a procesos de formación que permitan adquirir conocimientos, desarrollar competencias y fortalecer los proyectos de vida.",
    },
    {
      nombre: "Salud y bienestar",
      icono: "HeartPulse",
      texto:
        "Apoyamos iniciativas orientadas a la promoción de la salud, la prevención, el bienestar y la atención de necesidades sociales relacionadas con las comunidades.",
    },
    {
      nombre: "Desarrollo social",
      icono: "Users",
      texto:
        "Trabajamos con comunidades y personas que requieren acompañamiento, orientación y oportunidades para fortalecer su desarrollo integral.",
    },
    {
      nombre: "Emprendimiento",
      icono: "Sprout",
      texto:
        "Impulsamos iniciativas que permitan transformar ideas y conocimientos en oportunidades económicas sostenibles.",
    },
    {
      nombre: "Solidaridad",
      icono: "HandHeart",
      texto:
        "Movilizamos voluntarios, aliados, empresas y ciudadanos para convertir la solidaridad en acciones concretas.",
    },
  ],
};

export const valores = [
  {
    nombre: "Solidaridad",
    texto: "Ayudar a quien lo necesita y trabajar por el bienestar colectivo.",
  },
  { nombre: "Respeto", texto: "Reconocer la dignidad y los derechos de cada persona." },
  { nombre: "Responsabilidad", texto: "Cumplir nuestros compromisos con la comunidad." },
  { nombre: "Inclusión", texto: "Crear oportunidades sin discriminación." },
  { nombre: "Transparencia", texto: "Actuar con honestidad y claridad." },
  { nombre: "Amor", texto: "Trabajar con humanidad, empatía y sensibilidad." },
  { nombre: "Esperanza", texto: "Creer que siempre es posible construir un futuro diferente." },
];

export const alcance = {
  intro:
    "FUNASF busca continuar ampliando su presencia territorial y desarrollar actividades en diferentes municipios del departamento del Atlántico y otros territorios.",
  presencia: [
    "Soledad – Atlántico",
    "Santo Tomás – Atlántico",
    "Ponedera – Atlántico",
    "Sabanalarga – Atlántico",
  ],
  proyeccion: ["Valledupar", "Nuevos territorios"],
  destacado: "Porque estudiar también debe ser posible cerca de casa.",
};

/** Sedes: los datos marcados PENDIENTE deben ser suministrados por FUNASF. */
export const sedes = [
  {
    ciudad: "Cali",
    pais: "Colombia",
    descripcion: "Sede registrada de la Fundación en Colombia.",
    direccion: org.direccionPrincipal,
    telefono: org.telefonos[0],
    whatsapp: org.telefonos[0],
    horario: PENDIENTE,
    mapa: PENDIENTE,
    imagenPendiente: "[FOTOGRAFÍA SEDE CALI PENDIENTE]",
  },
  {
    ciudad: "Costa Atlántica",
    pais: "Colombia",
    descripcion:
      "Territorio donde la Fundación desarrolla programas en Soledad, Santo Tomás, Ponedera y Sabanalarga.",
    direccion: PENDIENTE,
    telefono: org.telefonos[1],
    whatsapp: PENDIENTE,
    horario: PENDIENTE,
    mapa: PENDIENTE,
    imagenPendiente: "[FOTOGRAFÍA SEDE COSTA ATLÁNTICA PENDIENTE]",
  },
  {
    ciudad: "Panamá",
    pais: "Panamá",
    descripcion: "País donde nace la Fundación, con una visión internacional.",
    direccion: PENDIENTE,
    telefono: PENDIENTE,
    whatsapp: PENDIENTE,
    horario: PENDIENTE,
    mapa: PENDIENTE,
    imagenPendiente: "[FOTOGRAFÍA SEDE PANAMÁ PENDIENTE]",
  },
];

export const categoriasProgramas = [
  {
    id: "salud",
    categoria: "Área de salud",
    programas: ["Auxiliar de Enfermería", "Servicios Farmacéuticos", "Administración en Salud"],
  },
  {
    id: "sst",
    categoria: "Seguridad y Salud en el Trabajo",
    programas: ["Seguridad y Salud en el Trabajo"],
  },
  {
    id: "administracion",
    categoria: "Administración y empresa",
    programas: [
      "Administración",
      "Auxiliar Administrativo y Contable",
      "Mercadeo y Ventas",
      "Logística",
      "Secretariado Ejecutivo",
    ],
  },
  {
    id: "educacion-social",
    categoria: "Educación y área social",
    programas: ["Primera Infancia"],
  },
  {
    id: "otras",
    categoria: "Otras áreas de formación",
    programas: [
      "Belleza Integral",
      "Inglés",
      "Vigilancia",
      "Hotelería y Turismo",
      "Electricidad",
      "Mecánica de Motos",
      "Construcción",
      "Música",
    ],
  },
  {
    id: "basica",
    categoria: "Educación básica",
    programas: [
      "Programas de validación del bachillerato, de acuerdo con las condiciones y requisitos establecidos por la institución responsable",
    ],
  },
];

export const formacionAcademica = {
  titulo: "Títulos técnicos a través de instituciones aliadas",
  parrafos: [
    "La Fundación Internacional Amigos Sin Fronteras – FUNASF, comprometida con el acceso a la educación y la generación de oportunidades, desarrolla programas de formación académica mediante alianzas con instituciones educativas y entidades de formación aliadas.",
    "A través de estas alianzas, acercamos diferentes programas de formación a comunidades y personas que desean prepararse para mejorar sus oportunidades personales y laborales.",
  ],
  comoFunciona: [
    "FUNASF facilita y promueve el acceso de los estudiantes a los programas de formación, acompañando los procesos de convocatoria, orientación y apoyo educativo.",
    "La formación académica, la certificación y la expedición de títulos corresponden a la institución aliada responsable de cada programa, de acuerdo con su naturaleza, autorización y condiciones académicas.",
  ],
};

export const becas = {
  titulo: "Estudia con el apoyo de la Fundación",
  porcentaje: "Becas de hasta el 90 %",
  aclaracion:
    "Sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.",
  intro:
    "FUNASF desarrolla convocatorias de becas de hasta el 90 %, sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.",
  proposito:
    "Nuestro propósito es contribuir a que más personas puedan acceder a oportunidades de formación sin que las dificultades económicas sean una barrera para alcanzar sus metas.",
  beneficios: [
    "Becas de hasta el 90 %.",
    "Programas de formación técnica.",
    "Modalidad virtual en los programas disponibles.",
    "Formación presencial en sedes disponibles.",
    "Horarios flexibles.",
    "Oportunidades de formación cerca de la comunidad.",
  ],
  destacado: "La educación no debe ser un privilegio. Debe ser una oportunidad.",
};

export const modeloAlianzas = {
  intro:
    "FUNASF trabaja de manera articulada con instituciones aliadas para ampliar las oportunidades educativas.",
  objetivos: [
    "Acercar programas de formación a diferentes municipios.",
    "Facilitar el acceso de nuevos estudiantes.",
    "Desarrollar procesos de orientación y acompañamiento.",
    "Promover becas y apoyos educativos.",
    "Fortalecer la formación para el trabajo.",
    "Generar oportunidades de desarrollo para las comunidades.",
  ],
  destacado: "FUNASF conecta oportunidades con personas que quieren transformar su futuro.",
  responsabilidades: {
    intro:
      "FUNASF no sustituye a las instituciones educativas aliadas. La institución aliada correspondiente es responsable de los aspectos académicos del programa, incluyendo, según corresponda:",
    items: [
      "Plan de estudios.",
      "Docentes.",
      "Evaluaciones.",
      "Prácticas.",
      "Requisitos de certificación.",
      "Certificados y títulos.",
      "Registros o reconocimientos que correspondan.",
    ],
    nota: "Las condiciones pueden variar según el programa y la institución aliada.",
    destacado:
      "FUNASF acompaña, gestiona y promueve oportunidades. Nuestras instituciones aliadas forman y certifican.",
  },
};

export const educacionSinFronteras = {
  intro:
    "Nuestro objetivo es acercar las oportunidades educativas a las comunidades y facilitar que jóvenes y adultos puedan prepararse en diferentes áreas del conocimiento.",
  items: [
    "Formación presencial.",
    "Formación virtual, según disponibilidad.",
    "Horarios flexibles.",
    "Procesos de formación por módulos.",
    "Actividades prácticas.",
    "Talleres.",
    "Evaluaciones.",
    "Acompañamiento docente.",
    "Procesos de certificación según el programa y la institución responsable.",
  ],
};

export const emprendimiento = {
  intro:
    "Creemos que la educación también debe ayudar a generar oportunidades económicas. Por eso desarrollamos iniciativas relacionadas con:",
  items: [
    "Emprendimiento.",
    "Marketing y ventas.",
    "Marketing digital.",
    "Educación financiera.",
    "Planes de negocio.",
    "Fortalecimiento empresarial.",
    "Ferias de emprendimiento.",
    "Redes de colaboración.",
  ],
  cierre: "Nuestro objetivo es ayudar a que las ideas puedan convertirse en proyectos sostenibles.",
};

export const programasSociales = [
  {
    nombre: "Educación Sin Fronteras",
    icono: "BookOpen",
    texto: "Acceso a oportunidades de formación y apoyo educativo.",
  },
  {
    nombre: "Salud para Todos",
    icono: "Stethoscope",
    texto: "Promoción de la salud, prevención y actividades comunitarias.",
  },
  {
    nombre: "Amigos por la Vida",
    icono: "HandHeart",
    texto: "Acompañamiento y acciones de solidaridad.",
  },
  {
    nombre: "Eco Amigos",
    icono: "Leaf",
    texto: "Educación ambiental y acciones para el cuidado del planeta.",
  },
  {
    nombre: "Casa de Emprendimiento",
    icono: "Store",
    texto: "Formación y acompañamiento para emprendedores.",
  },
  {
    nombre: "Trabajo Empresarial",
    icono: "Briefcase",
    texto: "Iniciativas orientadas al desarrollo de capacidades y oportunidades.",
  },
];

export const voluntariado = {
  titulo: "Tú también puedes ser parte del cambio",
  intro: "FUNASF cree que todos tenemos algo para aportar.",
  aportes: [
    "Tiempo.",
    "Conocimientos.",
    "Experiencia profesional.",
    "Habilidades.",
    "Ideas.",
    "Contactos.",
    "Donaciones.",
    "Apoyo logístico.",
    "Participación en actividades sociales.",
  ],
  areas: [
    "Educación",
    "Publicidad",
    "Comunicaciones",
    "Eventos",
    "Salud",
    "Actividades comunitarias",
    "Emprendimiento",
    "Logística",
    "Otras áreas",
  ],
  destacado: "Ser voluntario es convertir el deseo de ayudar en una acción concreta.",
};

export const alianzas = {
  intro:
    "Creemos que los grandes cambios se construyen trabajando juntos. Buscamos establecer alianzas con:",
  tipos: [
    "Empresas",
    "Instituciones educativas",
    "Entidades públicas",
    "Organizaciones sociales",
    "Profesionales",
    "Universidades",
    "Iglesias y organizaciones comunitarias",
    "Medios de comunicación",
    "Donantes",
    "Cooperantes nacionales e internacionales",
  ],
  cta: "¿Quieres ser nuestro aliado?",
  ctaTexto: "Una alianza puede convertirse en una oportunidad para cientos de personas.",
};

export const transparencia = [
  {
    nombre: "Transparencia",
    texto: "Manejo responsable de los recursos y de los procesos institucionales.",
  },
  {
    nombre: "Responsabilidad",
    texto:
      "Cumplimiento de nuestros compromisos con estudiantes, beneficiarios, voluntarios y aliados.",
  },
  {
    nombre: "Solidaridad",
    texto: "Trabajamos pensando en quienes necesitan mayores oportunidades.",
  },
  {
    nombre: "Inclusión",
    texto: "Creemos en el respeto por la dignidad y las diferencias de cada persona.",
  },
  { nombre: "Compromiso", texto: "Cada proyecto representa una responsabilidad con la comunidad." },
  { nombre: "Trabajo en equipo", texto: "Los grandes resultados se construyen colectivamente." },
];

export const faq = [
  {
    pregunta: "¿Quién puede acceder a los programas?",
    respuesta:
      "Personas interesadas en estudiar y que cumplan los requisitos establecidos para cada programa y convocatoria.",
  },
  {
    pregunta: "¿Las becas son del 90 %?",
    respuesta:
      "FUNASF desarrolla convocatorias con becas de hasta el 90 %, de acuerdo con las condiciones establecidas en cada convocatoria.",
  },
  {
    pregunta: "¿La Fundación cobra matrícula?",
    respuesta: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
  },
  {
    pregunta: "¿Puedo estudiar virtualmente?",
    respuesta:
      "Sí. Algunos programas cuentan con modalidad virtual, de acuerdo con la oferta vigente.",
  },
  {
    pregunta: "¿Puedo estudiar sin salir de mi municipio?",
    respuesta:
      "La Fundación busca acercar los procesos de formación a diferentes municipios mediante sedes y modalidades presenciales y virtuales, según disponibilidad.",
  },
  {
    pregunta: "¿Todos los programas tienen la misma duración?",
    respuesta:
      "No. La duración depende del programa, su estructura académica y las condiciones de la convocatoria.",
  },
  {
    pregunta: "¿Quién entrega los títulos?",
    respuesta:
      "Los títulos y certificados corresponden a la institución educativa aliada responsable de cada programa, conforme a sus condiciones académicas y administrativas.",
  },
];

export const llamadoAccion = {
  titulo: "Tu futuro no tiene fronteras",
  subtitulo: "Una oportunidad puede comenzar con una conversación.",
  bloques: [
    { titulo: "Estudia", texto: "Encuentra el programa que se adapte a tus sueños." },
    { titulo: "Becas", texto: "Conoce nuestras convocatorias de apoyo educativo." },
    { titulo: "Voluntariado", texto: "Comparte tu tiempo y tus talentos." },
    { titulo: "Dona", texto: "Tu aporte puede convertirse en una oportunidad." },
    { titulo: "Sé aliado", texto: "Ayúdanos a llevar nuestros programas a más comunidades." },
  ],
};

export const categoriasGaleria = [
  "Educación",
  "Estudiantes",
  "Talleres",
  "Eventos",
  "Sedes",
  "Programas sociales",
  "Voluntariado",
];

export const motivosContacto = [
  "Quiero estudiar",
  "Quiero conocer las becas",
  "Quiero ser voluntario",
  "Quiero ser aliado",
  "Quiero realizar una donación",
  "Quiero llevar programas a mi comunidad",
  "Otro",
];
