export interface ProgramaAcademico {
  slug: string;
  nombre: string;
  categoria: string;
  categoriaId: string;
  descripcion: string;
  objetivo: string;
  modalidades: string[];
  perfilOcupacional: string[];
  requisitos: string[];
  certificacionNota?: string | undefined;
  duracionEstimada?: string | undefined;
  imagenUrl?: string | undefined;
}

export const programasAcademicos: ProgramaAcademico[] = [
  // SALUD
  {
    slug: "auxiliar-de-enfermeria",
    nombre: "Auxiliar de Enfermería",
    categoria: "Área de salud",
    categoriaId: "salud",
    imagenUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Formación orientada al cuidado integral del paciente, asistencia en procedimientos médicos, administración responsable de medicamentos y apoyo hospitalario y comunitario.",
    objetivo:
      "Desarrollar competencias humanas y técnicas para el cuidado y atención básica del paciente en instituciones de salud de primer y segundo nivel.",
    modalidades: ["Presencial", "Semipresencial"],
    perfilOcupacional: [
      "Clínicas, hospitales y centros de atención básica",
      "Cuidado domiciliario y atención particular",
      "Centros de atención a adultos mayores",
      "Programas comunitarios de promoción y prevención en salud",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
      "Esquema de vacunación requerido para el área de la salud",
      "Disponibilidad para prácticas asistenciales",
    ],
    duracionEstimada: "Sujeta al plan de estudios de la institución aliada",
  },
  {
    slug: "servicios-farmaceuticos",
    nombre: "Servicios Farmacéuticos",
    categoria: "Área de salud",
    categoriaId: "salud",
    imagenUrl:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Capacitación en dispensación ética de medicamentos, control de inventarios farmacéuticos, almacenamiento y servicio al usuario en droguerías y farmacias hospitalarias.",
    objetivo:
      "Preparar personal calificado para la correcta recepción, almacenamiento, control y dispensación de productos farmacéuticos según normatividad sanitaria.",
    modalidades: ["Presencial", "Semipresencial"],
    perfilOcupacional: [
      "Droguerías comunitarias y cadenas comerciales",
      "Servicios farmacéuticos hospitalarios y ambulatorios",
      "Almacenes y depósitos de distribución de medicamentos",
      "Auxiliar en control y auditoría de inventarios farmacéuticos",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
      "Certificado médico general",
    ],
  },
  {
    slug: "administracion-en-salud",
    nombre: "Administración en Salud",
    categoria: "Área de salud",
    categoriaId: "salud",
    imagenUrl:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Gestión de admisión de usuarios, facturación de servicios médicos, archivo clínico y atención al usuario en el sistema de salud.",
    objetivo:
      "Brindar conocimientos operativos para agilizar los procesos administrativos, de recaudo y de atención al usuario en instituciones de salud públicas y privadas.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Admisiones y atención al usuario en IPS y EPS",
      "Facturación y liquidación de servicios médicos",
      "Gestión de historias clínicas y archivo asistencial",
      "Auxiliar en auditoría médica y autorizaciones",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Diploma o acta de grado de bachiller",
      "Conocimientos básicos en herramientas ofimáticas",
    ],
  },

  // SEGURIDAD Y SALUD EN EL TRABAJO
  {
    slug: "seguridad-y-salud-en-el-trabajo",
    nombre: "Seguridad y Salud en el Trabajo",
    categoria: "Seguridad y Salud en el Trabajo",
    categoriaId: "sst",
    imagenUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Capacitación en identificación de peligros, prevención de riesgos laborales, protocolos de emergencia e implementación del SG-SST en todo tipo de empresas.",
    objetivo:
      "Formar auxiliares con capacidad para apoyar la implementación, monitoreo y mantenimiento de los sistemas de gestión de seguridad y salud laboral.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Auxiliar de Seguridad y Salud en el Trabajo en empresas públicas y privadas",
      "Apoyo en comités paritarios (COPASST) y brigadas de emergencia",
      "Inspector de condiciones de trabajo y uso de EPP",
      "Asistente en programas de capacitación y prevención de riesgos",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Diploma o acta de grado de bachiller",
      "Interés en normas de prevención laboral y primeros auxilios",
    ],
  },

  // ADMINISTRACIÓN Y EMPRESA
  {
    slug: "administracion",
    nombre: "Administración",
    categoria: "Administración y empresa",
    categoriaId: "administracion",
    imagenUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Fundamentos en planificación estratégica, organización de recursos, liderazgo de equipos y optimización de procesos productivos y de servicio.",
    objetivo:
      "Desarrollar habilidades de gestión, toma de decisiones y organización para apoyar la operatividad de empresas y emprendimientos.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Asistente de gerencia y coordinación operativa",
      "Supervisión de procesos y recursos administrativos",
      "Gestión y creación de emprendimientos propios",
      "Coordinador de áreas funcionales en pequeñas y medianas empresas",
    ],
    requisitos: ["Documento de identidad vigente", "Diploma o acta de grado de bachiller"],
  },
  {
    slug: "auxiliar-administrativo-y-contable",
    nombre: "Auxiliar Administrativo y Contable",
    categoria: "Administración y empresa",
    categoriaId: "administracion",
    imagenUrl:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Registro de operaciones contables, conciliaciones bancarias, nómina, archivo documental y atención corporativa.",
    objetivo:
      "Preparar personal técnico con dominio de registros contables básicos, soportes financieros y soporte administrativo integral.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Auxiliar contable y de tesorería",
      "Asistente de nómina y recursos humanos",
      "Recepción y gestión documental corporativa",
      "Apoyo en trámites tributarios y facturación electrónica",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Diploma o acta de grado de bachiller",
      "Manejo básico de hojas de cálculo",
    ],
  },
  {
    slug: "mercadeo-y-ventas",
    nombre: "Mercadeo y Ventas",
    categoria: "Administración y empresa",
    categoriaId: "administracion",
    imagenUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Técnicas de negociación, servicio al cliente, canales de comercialización digital, fidelización de clientes e investigación básica de mercados.",
    objetivo:
      "Capacitar en el diseño y ejecución de estrategias comerciales y de ventas para dinamizar el crecimiento de productos y servicios.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Ejecutivo de ventas y asesor comercial",
      "Atención y fidelización de clientes",
      "Auxiliar de mercadeo y promociones",
      "Gestor de ventas en canales digitales y redes sociales",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
    ],
  },
  {
    slug: "logistica",
    nombre: "Logística",
    categoria: "Administración y empresa",
    categoriaId: "administracion",
    imagenUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Gestión de cadenas de suministro, recepción, almacenamiento, despacho de mercancías, control de inventarios y distribución eficiente.",
    objetivo:
      "Formar personal con habilidades operativas en bodegaje, trazabilidad, transporte y control logístico de insumos y productos terminados.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Auxiliar de bodega y centros de distribución",
      "Coordinador de despachos y rutas de transporte",
      "Controlador de inventarios y existencias",
      "Asistente en empresas de transporte y comercio exterior",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
    ],
  },
  {
    slug: "secretariado-ejecutivo",
    nombre: "Secretariado Ejecutivo",
    categoria: "Administración y empresa",
    categoriaId: "administracion",
    imagenUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Redacción corporativa, etiqueta empresarial, gestión de agenda, organización de eventos y manejo confidencial de correspondencia ejecutiva.",
    objetivo:
      "Desarrollar competencias de comunicación, protocolo y organización para la asistencia directa a directivos y departamentos corporativos.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Asistente de presidencia y gerencias departamentales",
      "Secretaria ejecutiva en despachos públicos y privados",
      "Coordinadora de recepción y protocolo corporativo",
      "Gestora de agendas, viajes y comunicaciones directivas",
    ],
    requisitos: ["Documento de identidad vigente", "Diploma o acta de grado de bachiller"],
  },

  // EDUCACIÓN Y ÁREA SOCIAL
  {
    slug: "primera-infancia",
    nombre: "Primera Infancia",
    categoria: "Educación y área social",
    categoriaId: "educacion-social",
    imagenUrl:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Pedagogía infantil, desarrollo integral en los primeros años de vida, nutrición, lúdica, estimulación temprana y cuidado socioafectivo.",
    objetivo:
      "Formar agentes educativos y auxiliares con vocación y técnicas pedagógicas para el acompañamiento integral de niñas y niños de 0 a 6 años.",
    modalidades: ["Presencial", "Semipresencial"],
    perfilOcupacional: [
      "Auxiliar de aula en jardines infantiles y centros de desarrollo infantil (CDI)",
      "Madre o padre comunitario y cuidador certificado",
      "Promotor de actividades lúdicas y recreativas infantiles",
      "Acompañante pedagógico en programas de bienestar familiar",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
      "Certificado de antecedentes",
    ],
  },

  // OTRAS ÁREAS DE FORMACIÓN
  {
    slug: "belleza-integral",
    nombre: "Belleza Integral",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Cuidado capilar, cosmetología básica, maquillaje social, manicure, pedicure y técnicas modernas de estética y bienestar personal.",
    objetivo:
      "Capacitar en destrezas prácticas de estética integral que faciliten la rápida inserción laboral y la creación de emprendimientos propios.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Estilista y especialista en cuidado capilar",
      "Técnico en cuidado de manos y pies (nail artist)",
      "Maquillador social y asesor de imagen",
      "Emprendedor y propietario de salón de belleza o spa",
    ],
    requisitos: ["Documento de identidad vigente", "Mayor de 16 años"],
  },
  {
    slug: "ingles",
    nombre: "Inglés",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Desarrollo de habilidades comunicativas (escucha, habla, lectura y escritura) con énfasis en conversación práctica y contextos laborales.",
    objetivo:
      "Permitir que los estudiantes adquieran solvencia comunicativa en lengua extranjera para ampliar sus oportunidades académicas y laborales.",
    modalidades: ["Presencial", "Virtual"],
    perfilOcupacional: [
      "Atención al cliente bilingüe en call centers y BPO",
      "Sector turístico, hotelero y de transporte de pasajeros",
      "Asistente en comercio internacional y correspondencia en inglés",
      "Acompañamiento básico en academias y tutorías personalizadas",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Disponibilidad horaria para práctica conversacional",
    ],
  },
  {
    slug: "vigilancia",
    nombre: "Vigilancia y Seguridad Privada",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Procedimientos de seguridad física, control de accesos, manejo de centrales de monitoreo, protocolos de prevención y primeros auxilios.",
    objetivo:
      "Preparar personal ético y disciplinado para el resguardo de personas, instalaciones y bienes patrimoniales según normatividad nacional.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Vigilante de seguridad en conjuntos residenciales y empresas",
      "Control de accesos y recepción en centros comerciales",
      "Operador de medios tecnológicos y cámaras de circuito cerrado (CCTV)",
      "Personal de seguridad para eventos y recintos feriales",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Libreta militar (si aplica)",
      "Certificado judicial y antecedentes vigentes",
    ],
  },
  {
    slug: "hoteleria-y-turismo",
    nombre: "Hotelería y Turismo",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Atención al huésped, operaciones de recepción hotelera, servicios de alimentos y bebidas, y promoción del patrimonio cultural y ecoturístico.",
    objetivo:
      "Formar talentos con calidez en el servicio para impulsar la industria turística regional e internacional.",
    modalidades: ["Presencial", "Semipresencial"],
    perfilOcupacional: [
      "Recepcionista y conserje en hoteles y hostales",
      "Guía y orientador turístico local",
      "Servicio en restaurantes, eventos y banquetes",
      "Agencias de viajes y empresas de recreación turística",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
    ],
  },
  {
    slug: "electricidad",
    nombre: "Electricidad",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Instalaciones eléctricas residenciales y comerciales, interpretación de planos, normas de seguridad RETIE y mantenimiento de circuitos.",
    objetivo:
      "Brindar conocimientos teóricos y prácticos para realizar montajes eléctricos seguros y eficientes conforme a la normativa técnica.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Técnico en instalaciones eléctricas domiciliarias y comerciales",
      "Mantenimiento eléctrico preventivo y correctivo",
      "Instalador de sistemas de iluminación y tableros de distribución",
      "Asistente en obras civiles y empresas de mantenimiento",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado de noveno grado o diploma de bachiller",
      "Equipo de protección personal para prácticas",
    ],
  },
  {
    slug: "mecanica-de-motos",
    nombre: "Mecánica de Motos",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Diagnóstico, reparación y sincronización de motores de dos y cuatro tiempos, sistemas de frenos, suspensión, transmisión y circuitos eléctricos.",
    objetivo:
      "Capacitar en el diagnóstico y mantenimiento integral de motocicletas, un sector con alta demanda laboral y potencial de emprendimiento.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Mecánico en talleres y centros de servicio autorizados",
      "Instalador y reparador en servitecas de motocicletas",
      "Venta y asesoría técnica en almacenes de repuestos",
      "Emprendedor de taller propio de mantenimiento y reparación",
    ],
    requisitos: ["Documento de identidad vigente", "Mayor de 16 años"],
  },
  {
    slug: "construccion",
    nombre: "Construcción",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Lectura de planos arquitectónicos, mezclas, mampostería, pañetes, enchapes, acabados y normas de seguridad en obra.",
    objetivo:
      "Desarrollar habilidades operativas de construcción y acabados para edificaciones sostenibles y seguras.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Auxiliar de obra en proyectos civiles e inmobiliarios",
      "Oficial de acabados, mampostería y enchapado",
      "Mantenimiento y remodelación de viviendas y locales",
      "Contratista independiente de obras menores",
    ],
    requisitos: ["Documento de identidad vigente", "Mayor de 18 años"],
  },
  {
    slug: "musica",
    nombre: "Música",
    categoria: "Otras áreas de formación",
    categoriaId: "otras",
    imagenUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Iniciación e interpretación instrumental, técnica vocal, teoría musical, ensamble y expresión artística comunitaria.",
    objetivo:
      "Fomentar la cultura, la expresión artística y el talento musical como vehículo de transformación social y desarrollo personal.",
    modalidades: ["Presencial"],
    perfilOcupacional: [
      "Músico ejecutante en agrupaciones comunitarias y orquestas",
      "Tutor de iniciación musical infantil y juvenil",
      "Apoyo en producción sonora y eventos culturales",
      "Animador cultural en instituciones comunitarias y fundaciones",
    ],
    requisitos: ["Documento de identidad vigente", "Afinidad e interés por la formación musical"],
  },

  // EDUCACIÓN BÁSICA
  {
    slug: "validacion-del-bachillerato",
    nombre: "Validación del Bachillerato",
    categoria: "Educación básica",
    categoriaId: "basica",
    imagenUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=640&q=80",
    descripcion:
      "Nivelación académica integral por ciclos para jóvenes y adultos que desean culminar sus estudios de básica y media y obtener su título de bachiller.",
    objetivo:
      "Garantizar el derecho a la educación y abrir puertas a la educación superior y técnica para personas que por diversas razones no culminaron el bachillerato.",
    modalidades: ["Presencial", "Semipresencial", "Virtual"],
    perfilOcupacional: [
      "Graduado como bachiller académico habilitado para educación superior",
      "Habilitación para postulación a becas técnicas y universitarias",
      "Crecimiento laboral y cumplimiento de requisitos para empleos formales",
    ],
    requisitos: [
      "Documento de identidad vigente",
      "Certificado del último año cursado y aprobado",
      "Mayor de 18 años (o según requisitos normativos de la institución responsable)",
    ],
  },
];
