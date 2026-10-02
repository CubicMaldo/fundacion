-- ============================================================================
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
  (
    'auxiliar-de-enfermeria',
    'Auxiliar de Enfermería',
    'salud',
    'Área de salud',
    'Formación orientada al cuidado integral del paciente, asistencia en procedimientos médicos, administración responsable de medicamentos y apoyo hospitalario y comunitario.',
    'Desarrollar competencias humanas y técnicas para el cuidado y atención básica del paciente en instituciones de salud de primer y segundo nivel.',
    ARRAY['Presencial', 'Semipresencial']::text[],
    ARRAY['Clínicas, hospitales y centros de atención básica', 'Cuidado domiciliario y atención particular', 'Centros de atención a adultos mayores', 'Programas comunitarios de promoción y prevención en salud']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller', 'Esquema de vacunación requerido para el área de la salud', 'Disponibilidad para prácticas asistenciales']::text[],
    NULL,
    'Sujeta al plan de estudios de la institución aliada',
    1,
    true
  ),
  (
    'servicios-farmaceuticos',
    'Servicios Farmacéuticos',
    'salud',
    'Área de salud',
    'Capacitación en dispensación ética de medicamentos, control de inventarios farmacéuticos, almacenamiento y servicio al usuario en droguerías y farmacias hospitalarias.',
    'Preparar personal calificado para la correcta recepción, almacenamiento, control y dispensación de productos farmacéuticos según normatividad sanitaria.',
    ARRAY['Presencial', 'Semipresencial']::text[],
    ARRAY['Droguerías comunitarias y cadenas comerciales', 'Servicios farmacéuticos hospitalarios y ambulatorios', 'Almacenes y depósitos de distribución de medicamentos', 'Auxiliar en control y auditoría de inventarios farmacéuticos']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller', 'Certificado médico general']::text[],
    NULL,
    NULL,
    2,
    true
  ),
  (
    'administracion-en-salud',
    'Administración en Salud',
    'salud',
    'Área de salud',
    'Gestión de admisión de usuarios, facturación de servicios médicos, archivo clínico y atención al usuario en el sistema de salud.',
    'Brindar conocimientos operativos para agilizar los procesos administrativos, de recaudo y de atención al usuario en instituciones de salud públicas y privadas.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Admisiones y atención al usuario en IPS y EPS', 'Facturación y liquidación de servicios médicos', 'Gestión de historias clínicas y archivo asistencial', 'Auxiliar en auditoría médica y autorizaciones']::text[],
    ARRAY['Documento de identidad vigente', 'Diploma o acta de grado de bachiller', 'Conocimientos básicos en herramientas ofimáticas']::text[],
    NULL,
    NULL,
    3,
    true
  ),
  (
    'seguridad-y-salud-en-el-trabajo',
    'Seguridad y Salud en el Trabajo',
    'sst',
    'Seguridad y Salud en el Trabajo',
    'Capacitación en identificación de peligros, prevención de riesgos laborales, protocolos de emergencia e implementación del SG-SST en todo tipo de empresas.',
    'Formar auxiliares con capacidad para apoyar la implementación, monitoreo y mantenimiento de los sistemas de gestión de seguridad y salud laboral.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Auxiliar de Seguridad y Salud en el Trabajo en empresas públicas y privadas', 'Apoyo en comités paritarios (COPASST) y brigadas de emergencia', 'Inspector de condiciones de trabajo y uso de EPP', 'Asistente en programas de capacitación y prevención de riesgos']::text[],
    ARRAY['Documento de identidad vigente', 'Diploma o acta de grado de bachiller', 'Interés en normas de prevención laboral y primeros auxilios']::text[],
    NULL,
    NULL,
    4,
    true
  ),
  (
    'administracion',
    'Administración',
    'administracion',
    'Administración y empresa',
    'Fundamentos en planificación estratégica, organización de recursos, liderazgo de equipos y optimización de procesos productivos y de servicio.',
    'Desarrollar habilidades de gestión, toma de decisiones y organización para apoyar la operatividad de empresas y emprendimientos.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Asistente de gerencia y coordinación operativa', 'Supervisión de procesos y recursos administrativos', 'Gestión y creación de emprendimientos propios', 'Coordinador de áreas funcionales en pequeñas y medianas empresas']::text[],
    ARRAY['Documento de identidad vigente', 'Diploma o acta de grado de bachiller']::text[],
    NULL,
    NULL,
    5,
    true
  ),
  (
    'auxiliar-administrativo-y-contable',
    'Auxiliar Administrativo y Contable',
    'administracion',
    'Administración y empresa',
    'Registro de operaciones contables, conciliaciones bancarias, nómina, archivo documental y atención corporativa.',
    'Preparar personal técnico con dominio de registros contables básicos, soportes financieros y soporte administrativo integral.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Auxiliar contable y de tesorería', 'Asistente de nómina y recursos humanos', 'Recepción y gestión documental corporativa', 'Apoyo en trámites tributarios y facturación electrónica']::text[],
    ARRAY['Documento de identidad vigente', 'Diploma o acta de grado de bachiller', 'Manejo básico de hojas de cálculo']::text[],
    NULL,
    NULL,
    6,
    true
  ),
  (
    'mercadeo-y-ventas',
    'Mercadeo y Ventas',
    'administracion',
    'Administración y empresa',
    'Técnicas de negociación, servicio al cliente, canales de comercialización digital, fidelización de clientes e investigación básica de mercados.',
    'Capacitar en el diseño y ejecución de estrategias comerciales y de ventas para dinamizar el crecimiento de productos y servicios.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Ejecutivo de ventas y asesor comercial', 'Atención y fidelización de clientes', 'Auxiliar de mercadeo y promociones', 'Gestor de ventas en canales digitales y redes sociales']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller']::text[],
    NULL,
    NULL,
    7,
    true
  ),
  (
    'logistica',
    'Logística',
    'administracion',
    'Administración y empresa',
    'Gestión de cadenas de suministro, recepción, almacenamiento, despacho de mercancías, control de inventarios y distribución eficiente.',
    'Formar personal con habilidades operativas en bodegaje, trazabilidad, transporte y control logístico de insumos y productos terminados.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Auxiliar de bodega y centros de distribución', 'Coordinador de despachos y rutas de transporte', 'Controlador de inventarios y existencias', 'Asistente en empresas de transporte y comercio exterior']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller']::text[],
    NULL,
    NULL,
    8,
    true
  ),
  (
    'secretariado-ejecutivo',
    'Secretariado Ejecutivo',
    'administracion',
    'Administración y empresa',
    'Redacción corporativa, etiqueta empresarial, gestión de agenda, organización de eventos y manejo confidencial de correspondencia ejecutiva.',
    'Desarrollar competencias de comunicación, protocolo y organización para la asistencia directa a directivos y departamentos corporativos.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Asistente de presidencia y gerencias departamentales', 'Secretaria ejecutiva en despachos públicos y privados', 'Coordinadora de recepción y protocolo corporativo', 'Gestora de agendas, viajes y comunicaciones directivas']::text[],
    ARRAY['Documento de identidad vigente', 'Diploma o acta de grado de bachiller']::text[],
    NULL,
    NULL,
    9,
    true
  ),
  (
    'primera-infancia',
    'Primera Infancia',
    'educacion-social',
    'Educación y área social',
    'Pedagogía infantil, desarrollo integral en los primeros años de vida, nutrición, lúdica, estimulación temprana y cuidado socioafectivo.',
    'Formar agentes educativos y auxiliares con vocación y técnicas pedagógicas para el acompañamiento integral de niñas y niños de 0 a 6 años.',
    ARRAY['Presencial', 'Semipresencial']::text[],
    ARRAY['Auxiliar de aula en jardines infantiles y centros de desarrollo infantil (CDI)', 'Madre o padre comunitario y cuidador certificado', 'Promotor de actividades lúdicas y recreativas infantiles', 'Acompañante pedagógico en programas de bienestar familiar']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller', 'Certificado de antecedentes']::text[],
    NULL,
    NULL,
    10,
    true
  ),
  (
    'belleza-integral',
    'Belleza Integral',
    'otras',
    'Otras áreas de formación',
    'Cuidado capilar, cosmetología básica, maquillaje social, manicure, pedicure y técnicas modernas de estética y bienestar personal.',
    'Capacitar en destrezas prácticas de estética integral que faciliten la rápida inserción laboral y la creación de emprendimientos propios.',
    ARRAY['Presencial']::text[],
    ARRAY['Estilista y especialista en cuidado capilar', 'Técnico en cuidado de manos y pies (nail artist)', 'Maquillador social y asesor de imagen', 'Emprendedor y propietario de salón de belleza o spa']::text[],
    ARRAY['Documento de identidad vigente', 'Mayor de 16 años']::text[],
    NULL,
    NULL,
    11,
    true
  ),
  (
    'ingles',
    'Inglés',
    'otras',
    'Otras áreas de formación',
    'Desarrollo de habilidades comunicativas (escucha, habla, lectura y escritura) con énfasis en conversación práctica y contextos laborales.',
    'Permitir que los estudiantes adquieran solvencia comunicativa en lengua extranjera para ampliar sus oportunidades académicas y laborales.',
    ARRAY['Presencial', 'Virtual']::text[],
    ARRAY['Atención al cliente bilingüe en call centers y BPO', 'Sector turístico, hotelero y de transporte de pasajeros', 'Asistente en comercio internacional y correspondencia en inglés', 'Acompañamiento básico en academias y tutorías personalizadas']::text[],
    ARRAY['Documento de identidad vigente', 'Disponibilidad horaria para práctica conversacional']::text[],
    NULL,
    NULL,
    12,
    true
  ),
  (
    'vigilancia',
    'Vigilancia y Seguridad Privada',
    'otras',
    'Otras áreas de formación',
    'Procedimientos de seguridad física, control de accesos, manejo de centrales de monitoreo, protocolos de prevención y primeros auxilios.',
    'Preparar personal ético y disciplinado para el resguardo de personas, instalaciones y bienes patrimoniales según normatividad nacional.',
    ARRAY['Presencial']::text[],
    ARRAY['Vigilante de seguridad en conjuntos residenciales y empresas', 'Control de accesos y recepción en centros comerciales', 'Operador de medios tecnológicos y cámaras de circuito cerrado (CCTV)', 'Personal de seguridad para eventos y recintos feriales']::text[],
    ARRAY['Documento de identidad vigente', 'Libreta militar (si aplica)', 'Certificado judicial y antecedentes vigentes']::text[],
    NULL,
    NULL,
    13,
    true
  ),
  (
    'hoteleria-y-turismo',
    'Hotelería y Turismo',
    'otras',
    'Otras áreas de formación',
    'Atención al huésped, operaciones de recepción hotelera, servicios de alimentos y bebidas, y promoción del patrimonio cultural y ecoturístico.',
    'Formar talentos con calidez en el servicio para impulsar la industria turística regional e internacional.',
    ARRAY['Presencial', 'Semipresencial']::text[],
    ARRAY['Recepcionista y conserje en hoteles y hostales', 'Guía y orientador turístico local', 'Servicio en restaurantes, eventos y banquetes', 'Agencias de viajes y empresas de recreación turística']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller']::text[],
    NULL,
    NULL,
    14,
    true
  ),
  (
    'electricidad',
    'Electricidad',
    'otras',
    'Otras áreas de formación',
    'Instalaciones eléctricas residenciales y comerciales, interpretación de planos, normas de seguridad RETIE y mantenimiento de circuitos.',
    'Brindar conocimientos teóricos y prácticos para realizar montajes eléctricos seguros y eficientes conforme a la normativa técnica.',
    ARRAY['Presencial']::text[],
    ARRAY['Técnico en instalaciones eléctricas domiciliarias y comerciales', 'Mantenimiento eléctrico preventivo y correctivo', 'Instalador de sistemas de iluminación y tableros de distribución', 'Asistente en obras civiles y empresas de mantenimiento']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado de noveno grado o diploma de bachiller', 'Equipo de protección personal para prácticas']::text[],
    NULL,
    NULL,
    15,
    true
  ),
  (
    'mecanica-de-motos',
    'Mecánica de Motos',
    'otras',
    'Otras áreas de formación',
    'Diagnóstico, reparación y sincronización de motores de dos y cuatro tiempos, sistemas de frenos, suspensión, transmisión y circuitos eléctricos.',
    'Capacitar en el diagnóstico y mantenimiento integral de motocicletas, un sector con alta demanda laboral y potencial de emprendimiento.',
    ARRAY['Presencial']::text[],
    ARRAY['Mecánico en talleres y centros de servicio autorizados', 'Instalador y reparador en servitecas de motocicletas', 'Venta y asesoría técnica en almacenes de repuestos', 'Emprendedor de taller propio de mantenimiento y reparación']::text[],
    ARRAY['Documento de identidad vigente', 'Mayor de 16 años']::text[],
    NULL,
    NULL,
    16,
    true
  ),
  (
    'construccion',
    'Construcción',
    'otras',
    'Otras áreas de formación',
    'Lectura de planos arquitectónicos, mezclas, mampostería, pañetes, enchapes, acabados y normas de seguridad en obra.',
    'Desarrollar habilidades operativas de construcción y acabados para edificaciones sostenibles y seguras.',
    ARRAY['Presencial']::text[],
    ARRAY['Auxiliar de obra en proyectos civiles e inmobiliarios', 'Oficial de acabados, mampostería y enchapado', 'Mantenimiento y remodelación de viviendas y locales', 'Contratista independiente de obras menores']::text[],
    ARRAY['Documento de identidad vigente', 'Mayor de 18 años']::text[],
    NULL,
    NULL,
    17,
    true
  ),
  (
    'musica',
    'Música',
    'otras',
    'Otras áreas de formación',
    'Iniciación e interpretación instrumental, técnica vocal, teoría musical, ensamble y expresión artística comunitaria.',
    'Fomentar la cultura, la expresión artística y el talento musical como vehículo de transformación social y desarrollo personal.',
    ARRAY['Presencial']::text[],
    ARRAY['Músico ejecutante en agrupaciones comunitarias y orquestas', 'Tutor de iniciación musical infantil y juvenil', 'Apoyo en producción sonora y eventos culturales', 'Animador cultural en instituciones comunitarias y fundaciones']::text[],
    ARRAY['Documento de identidad vigente', 'Afinidad e interés por la formación musical']::text[],
    NULL,
    NULL,
    18,
    true
  ),
  (
    'validacion-del-bachillerato',
    'Validación del Bachillerato',
    'basica',
    'Educación básica',
    'Nivelación académica integral por ciclos para jóvenes y adultos que desean culminar sus estudios de básica y media y obtener su título de bachiller.',
    'Garantizar el derecho a la educación y abrir puertas a la educación superior y técnica para personas que por diversas razones no culminaron el bachillerato.',
    ARRAY['Presencial', 'Semipresencial', 'Virtual']::text[],
    ARRAY['Graduado como bachiller académico habilitado para educación superior', 'Habilitación para postulación a becas técnicas y universitarias', 'Crecimiento laboral y cumplimiento de requisitos para empleos formales']::text[],
    ARRAY['Documento de identidad vigente', 'Certificado del último año cursado y aprobado', 'Mayor de 18 años (o según requisitos normativos de la institución responsable)']::text[],
    NULL,
    NULL,
    19,
    true
  )
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
  ('contacto', '{"telefonos":["+57 313 577 9384","+57 318 915 7015","+57 323 294 6184","+57 317 165 7124"],"correo":"info@edufunasf.org","instagram":"@funasfinternacional","instagramUrl":"https://instagram.com/funasfinternacional","ciudadPrincipal":"Cali, Valle del Cauca — Colombia","direccionPrincipal":"CR 96 45 119, Cali","formularioInscripcion":"https://forms.gle/kYUoX2v1dewKUrMX8","horario":"Lunes a Viernes 8:00 AM - 5:00 PM"}'::jsonb),
  ('institucional', '{"nombre":"Fundación Internacional Amigos Sin Fronteras","sigla":"FUNASF","razonSocial":"FUNDACION INTERNACIONAL AMIGOS SIN FRONTERAS","nit":"901964394-1","eslogan":"Porque la educación no tiene fronteras.","esloganSecundario":"Una oportunidad puede comenzar con una conversación.","frases":["Somos los pies, las manos y la voz de los más necesitados.","Aquí la solidaridad no conoce fronteras."],"quienesSomos":{"intro":"La Fundación Internacional Amigos Sin Fronteras – FUNASF es una organización de carácter social orientada al desarrollo de programas y proyectos que contribuyen al bienestar, la educación, la formación, la inclusión y el fortalecimiento de las comunidades.","parrafos":["Nuestro trabajo nace de una convicción: una oportunidad puede cambiar una vida, pero una comunidad unida puede transformar una sociedad.","Desarrollamos iniciativas sociales, educativas, de formación para el trabajo, emprendimiento, salud, bienestar y apoyo comunitario. Para ello, articulamos esfuerzos con docentes, profesionales, voluntarios, instituciones, empresas, organizaciones sociales y personas comprometidas con la transformación social."],"compromiso":"Trabajamos para que las oportunidades no estén determinadas únicamente por la capacidad económica de una persona. Por eso impulsamos programas de apoyo, becas, formación y acompañamiento social.","destacado":"En FUNASF creemos que la educación no tiene fronteras y que el conocimiento debe convertirse en una herramienta para transformar vidas."},"mision":["Contribuir a la transformación social mediante programas de educación, formación, salud, emprendimiento, bienestar y acción comunitaria, brindando oportunidades especialmente a personas y comunidades en condición de vulnerabilidad.","Promovemos el acceso a procesos de formación y desarrollo de capacidades, fortaleciendo la autonomía, el emprendimiento, la inclusión social y las oportunidades para mejorar la calidad de vida.","Nuestra misión se fundamenta en la solidaridad, la dignidad humana, el respeto, la inclusión, la responsabilidad y el compromiso con las comunidades."],"vision":{"parrafos":["Ser una fundación reconocida a nivel nacional e internacional por su compromiso con la transformación social, la educación y el desarrollo humano.","Buscamos consolidar una red de oportunidades que permita llevar programas sociales y educativos a diferentes territorios, especialmente a comunidades que requieren mayores posibilidades de acceso a la educación, la formación y el desarrollo económico y social."],"futuro":["Ampliar nuestra presencia territorial.","Fortalecer nuestros programas de educación y formación.","Incrementar las oportunidades de becas.","Desarrollar nuevos proyectos sociales.","Fortalecer nuestros programas de emprendimiento.","Crear alianzas nacionales e internacionales.","Promover el voluntariado.","Impulsar proyectos de salud y bienestar.","Generar oportunidades para jóvenes, adultos y familias.","Llegar a más comunidades con el mensaje de que la educación no tiene fronteras."]},"proposito":{"titulo":"Transformar solidaridad en oportunidades","intro":"El propósito de FUNASF es contribuir a que las personas puedan desarrollar sus capacidades y encontrar nuevas oportunidades para mejorar sus condiciones de vida.","ejes":[{"nombre":"Educación","icono":"GraduationCap","texto":"Promovemos el acceso a procesos de formación que permitan adquirir conocimientos, desarrollar competencias y fortalecer los proyectos de vida."},{"nombre":"Salud y bienestar","icono":"HeartPulse","texto":"Apoyamos iniciativas orientadas a la promoción de la salud, la prevención, el bienestar y la atención de necesidades sociales relacionadas con las comunidades."},{"nombre":"Desarrollo social","icono":"Users","texto":"Trabajamos con comunidades y personas que requieren acompañamiento, orientación y oportunidades para fortalecer su desarrollo integral."},{"nombre":"Emprendimiento","icono":"Sprout","texto":"Impulsamos iniciativas que permitan transformar ideas y conocimientos en oportunidades económicas sostenibles."},{"nombre":"Solidaridad","icono":"HandHeart","texto":"Movilizamos voluntarios, aliados, empresas y ciudadanos para convertir la solidaridad en acciones concretas."}]},"valores":[{"nombre":"Solidaridad","texto":"Ayudar a quien lo necesita y trabajar por el bienestar colectivo."},{"nombre":"Respeto","texto":"Reconocer la dignidad y los derechos de cada persona."},{"nombre":"Responsabilidad","texto":"Cumplir nuestros compromisos con la comunidad."},{"nombre":"Inclusión","texto":"Crear oportunidades sin discriminación."},{"nombre":"Transparencia","texto":"Actuar con honestidad y claridad."},{"nombre":"Amor","texto":"Trabajar con humanidad, empatía y sensibilidad."},{"nombre":"Esperanza","texto":"Creer que siempre es posible construir un futuro diferente."}],"alcance":{"intro":"FUNASF busca continuar ampliando su presencia territorial y desarrollar actividades en diferentes municipios del departamento del Atlántico y otros territorios.","presencia":["Soledad – Atlántico","Santo Tomás – Atlántico","Ponedera – Atlántico","Sabanalarga – Atlántico"],"proyeccion":["Valledupar","Nuevos territorios"],"destacado":"Porque estudiar también debe ser posible cerca de casa."}}'::jsonb),
  ('becas', '{"titulo":"Estudia con el apoyo de la Fundación","porcentaje":"Becas de hasta el 90 %","aclaracion":"Sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.","intro":"FUNASF desarrolla convocatorias de becas de hasta el 90 %, sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.","proposito":"Nuestro propósito es contribuir a que más personas puedan acceder a oportunidades de formación sin que las dificultades económicas sean una barrera para alcanzar sus metas.","beneficios":["Becas de hasta el 90 %.","Programas de formación técnica.","Modalidad virtual en los programas disponibles.","Formación presencial en sedes disponibles.","Horarios flexibles.","Oportunidades de formación cerca de la comunidad."],"destacado":"La educación no debe ser un privilegio. Debe ser una oportunidad."}'::jsonb),
  ('sedes', '[{"ciudad":"Cali","pais":"Colombia","descripcion":"Sede registrada de la Fundación en Colombia.","direccion":"CR 96 45 119, Cali","telefono":"+57 313 577 9384","whatsapp":"+57 313 577 9384","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE CALI PENDIENTE]"},{"ciudad":"Costa Atlántica","pais":"Colombia","descripcion":"Territorio donde la Fundación desarrolla programas en Soledad, Santo Tomás, Ponedera y Sabanalarga.","direccion":"PENDIENTE","telefono":"+57 318 915 7015","whatsapp":"PENDIENTE","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE COSTA ATLÁNTICA PENDIENTE]"},{"ciudad":"Panamá","pais":"Panamá","descripcion":"País donde nace la Fundación, con una visión internacional.","direccion":"PENDIENTE","telefono":"PENDIENTE","whatsapp":"PENDIENTE","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE PANAMÁ PENDIENTE]"}]'::jsonb)
ON CONFLICT (clave) DO UPDATE SET
  valor = EXCLUDED.valor,
  updated_at = now();

-- 3. Artículos iniciales de ejemplo para Blog (19 artículos oficiales con imágenes)
INSERT INTO public.articulos (
  slug,
  titulo,
  resumen,
  contenido,
  autor_nombre,
  categoria,
  imagen_portada,
  estado,
  fecha_publicacion
) VALUES
  ('becas-seguridad-salud-trabajo-diplomados', 'Beca del 90% en Seguridad y Salud en el Trabajo con Diplomados Especializados', 'FUNASF abre inscripciones para el programa técnico en Seguridad y Salud en el Trabajo con 90% de beca, sin costo de matrícula ni inscripción, e incluyendo tres diplomados certificados.', 'La Fundación Internacional Amigos Sin Fronteras – FUNASF anuncia la apertura de su convocatoria institucional de becas para el programa de formación en Seguridad y Salud en el Trabajo (SST), dirigido a personas con vocación de proteger vidas y liderar entornos laborales seguros.

### Beneficios del programa
- **Beca de hasta el 90 %** otorgada por FUNASF.
- **Sin costo de matrícula ni inscripción.**
- **Tres diplomados complementarios incluidos:**
  1. Manejo y Uso de Extintores.
  2. Primeros Auxilios Básicos y Avanzados.
  3. Trabajo Seguro en Alturas.

### Perfil y campo de acción
El egresado en Seguridad y Salud en el Trabajo se capacita para:
- Promover ambientes laborales seguros y saludables.
- Identificar peligros, evaluar riesgos y ejecutar planes de prevención según la normatividad vigente.
- Diseñar protocolos de emergencia y bienestar para empresas de cualquier sector productivo.

Para mayor información y postulación inmediata a la beca, comunícate a nuestras líneas oficiales de atención WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**.', 'Coordinación Académica FUNASF', 'Convocatorias', '/blog/sst-beca-90-diplomados.jpeg', 'publicado', '2026-10-02T07:30:00.000Z'),
  ('seguridad-salud-trabajo-modalidad-virtual', 'Estudia Seguridad y Salud en el Trabajo 100% Virtual con FUNASF', 'Aprende a tu propio ritmo con nuestra plataforma digital interactiva, clases dinámicas en vivo con docentes expertos y certificación laboral.', 'La educación sin fronteras llega hasta tu hogar. FUNASF ofrece el programa en **Seguridad y Salud en el Trabajo en modalidad 100% virtual**, permitiendo a jóvenes y adultos capacitarse sin descuidar sus obligaciones laborales o familiares.

### Ventajas de la modalidad virtual
- **Plataforma fácil de usar:** Acceso las 24 horas a materiales, talleres, casos de estudio y evaluaciones.
- **Clases dinámicas en vivo:** Interacción directa con docentes especialistas en prevención de riesgos laborales.
- **Estudio a tu propio ritmo:** Flexibilidad horaria pensada para personas con empleo o responsabilidades en casa.
- **Certificación oficial:** Respaldo formativo para vincularte formalmente al sector productivo.

¡Tu futuro comienza hoy! Transforma tu proyecto de vida con el apoyo solidario de la Fundación. Escríbenos por WhatsApp al **+57 313 577 9384** o al **+57 318 915 7015** para reservar tu cupo becado.', 'Área de Educación Virtual', 'Educación', '/blog/sst-modalidad-virtual.jpeg', 'publicado', '2026-10-01T15:00:00.000Z'),
  ('estudia-mercadeo-y-ventas-beca-90', '¡Tu futuro se vende mejor con conocimiento! Beca del 90% en Mercadeo y Ventas', 'Desarrolla habilidades comerciales, comunicación estratégica y talento para el liderazgo y ventas en un mercado de alta demanda laboral.', 'En el mundo actual, saber vender es comunicar, conectar y liderar. FUNASF pone a disposición de la comunidad becas del 90% para el programa de formación en **Mercadeo y Ventas**, una de las áreas más demandadas por empresas comerciales y de servicios.

### ¿Qué aprenderás?
- **Técnicas de negociación y persuasión:** Conecta con clientes y presenta propuestas de valor convincentes.
- **Estrategias de ventas modernas:** Manejo de canales físicos y digitales para comercializar productos y servicios.
- **Servicio y fidelización de clientes:** Construcción de relaciones comerciales duraderas y de mutua confianza.
- **Emprendimiento comercial:** Herramientas para crear y hacer crecer tu propio negocio independiente.

### Condiciones del apoyo
- **Beca del 90%:** Con el objetivo de que el aspecto económico no sea una barrera.
- **Sin cobro de matrícula ni de inscripción.**

Comunícate hoy mismo con nuestros orientadores a través de WhatsApp: **+57 313 577 9384** o **+57 318 915 7015**.', 'Equipo de Emprendimiento FUNASF', 'Emprendimiento', '/blog/mercadeo-ventas-beca-90.jpeg', 'publicado', '2026-09-30T10:00:00.000Z'),
  ('expansion-sedes-atlantico-valledupar', 'FUNASF expande su cobertura: Presencia en el Atlántico y próxima sede en Valledupar', 'Estamos más cerca de ti en Santo Tomás, Ponedera, Sabanalarga y Soledad. Anunciamos además el inicio de gestiones para nuestra próxima apertura en Valledupar.', 'Fieles al principio de que la educación no tiene fronteras y debe ser accesible cerca de las comunidades, la Fundación Internacional Amigos Sin Fronteras consolida su red de presencia en el departamento del Atlántico y proyecta su expansión al Cesar.

### Cobertura en el Atlántico
Nuestras sedes y puntos de formación activa se encuentran en:
- **Santo Tomás**
- **Ponedera**
- **Sabanalarga**
- **Soledad**

En cada uno de estos municipios brindamos programas de formación técnica con becas del 90% y horarios flexibles para que la distancia nunca sea un obstáculo.

### Próximamente en Valledupar
Nos complace anunciar que hemos iniciado los preparativos para llevar nuestra oferta académica y social a la ciudad de **Valledupar**, ampliando las oportunidades de becas y formación técnica laboral para la juventud y las familias cesarenses.

¡Únete a la familia FUNASF! Juntos transformamos vidas. Contáctanos al **+57 313 577 9384** para consultar los puntos de atención y horarios en tu municipio.', 'Dirección Territorial FUNASF', 'Sedes', '/blog/sedes-atlantico-valledupar.jpeg', 'publicado', '2026-09-29T14:30:00.000Z'),
  ('primera-infancia-diplomado-tea-tdah', 'Primera Infancia con Diplomado en Niños con TEA y TDAH', 'Fórmate como agente educativo capacitado en neurodiversidad, inclusión y atención pedagógica diferencial para niños con TEA y TDAH con beca del 90%.', 'El desarrollo infantil temprano exige profesionales con profunda sensibilidad humana y sólidos conocimientos pedagógicos. FUNASF abre convocatorias para el programa técnico en **Primera Infancia**, complementado con un **Diplomado Especializado en Niños con Trastorno del Espectro Autista (TEA) y Déficit de Atención (TDAH)**.

### Ejes de formación
- **Pedagogía inclusiva:** Estrategias de estimulación sensorial, motriz y cognitiva para la primera infancia.
- **Manejo en el aula de TEA y TDAH:** Acompañamiento respetuoso, rutinas estructuradas y comunicación alternativa.
- **Desarrollo socioafectivo:** Fortalecimiento del vínculo, la autoestima y la resiliencia en la niñez.
- **Horarios flexibles:** Modalidades diurnas, nocturnas y de fin de semana adaptadas a tus tiempos.

### Facilidades de acceso
- **Beca institucional de hasta el 90%.**
- **Cero costo en matrícula y sin valor de inscripción.**

Escríbenos hoy por WhatsApp al **+57 313 577 9384** o al **+57 318 915 7015** y asegura tu beca en este ciclo educativo.', 'Área de Pedagogía Infantil', 'Educación', '/blog/primera-infancia-tea-tdah.jpeg', 'publicado', '2026-09-28T09:15:00.000Z'),
  ('administracion-en-salud-alta-demanda-laboral', '¿Por qué estudiar Administración en Salud? Gran demanda y oportunidades laborales', 'El sector salud requiere coordinadores y auxiliares administrativos capacitados en facturación, admisiones y gestión asistencial. Conoce cómo postularte con beca del 90%.', 'La salud es uno de los sectores con mayor crecimiento y necesidad constante de personal calificado en el país. El programa de **Administración en Salud** de FUNASF prepara a personas para ser piezas fundamentales en la organización de clínicas, hospitales, EPS e IPS.

### Razones para elegir Administración en Salud
1. **Alta demanda en el campo laboral:** Todas las instituciones de salud necesitan expertos en facturación, admisiones, triage administrativo y autorizaciones.
2. **Gestión con calidad humana:** Aprende a coordinar procesos que garantizan una atención oportuna y digna para el paciente.
3. **Crecimiento profesional y personal:** Una carrera técnica que abre puertas a puestos de coordinación y administración en salud pública y privada.
4. **Impacto comunitario:** Contribuyes de forma directa al bienestar y la salud de la población.

Aprovecha nuestra beca de hasta el 90%, sin cobros de matrícula ni inscripción. Solicita más detalles a través de WhatsApp en el **+57 313 577 9384** o **+57 318 915 7015**.', 'Dirección de Programas de Salud', 'Salud', '/blog/administracion-salud-demanda.jpeg', 'publicado', '2026-09-27T16:00:00.000Z'),
  ('auxiliar-de-enfermeria-vocacion-servicio-beca', 'Auxiliar de Enfermería: Cuidar es más que una profesión, es un acto de amor', 'Prepárate para cuidar, acompañar y transformar vidas con tu vocación de servicio. Clases prácticas y teóricas con beca del 90% respaldada por FUNASF.', '«Formamos con amor, servimos con vocación, transformamos vidas sin fronteras». El programa de **Auxiliar de Enfermería** es una de las iniciativas insignia de FUNASF para personas que sienten el llamado de cuidar a quienes más lo necesitan.

### Características de la formación
- **Formación de alta calidad:** Aulas prácticas dotadas para simulaciones clínicas y docentes con experiencia en el sector hospitalario.
- **Certificación por competencias:** Avalado y reconocido para el ejercicio asistencial.
- **Horarios flexibles:** Pensados para personas que requieren alternar sus estudios con el trabajo o el hogar.
- **Vocación que deja huella:** Aprende procedimientos de enfermería, primeros auxilios, cuidado hospitalario y atención domiciliaria.

### Acceso a la Beca 90%
- No pagas costo de matrícula ni derecho de inscripción.
- Acompañamiento y seguimiento académico durante todo el proceso.

¡Inscríbete ya y sé parte del cambio que el mundo necesita! Escríbenos al **+57 318 915 7015**, **+57 313 577 9384** o **+57 321 576 5250**.', 'Escuela de Enfermería FUNASF', 'Salud', '/blog/auxiliar-enfermeria-vocacion.jpeg', 'publicado', '2026-09-26T11:20:00.000Z'),
  ('vocacion-por-la-primera-infancia-becas', 'Estudia Primera Infancia: Transforma vidas desde el amor y la pedagogía', 'Los primeros años definen el futuro de una persona. Fórmate con FUNASF para guiar, proteger y estimular el desarrollo de nuestros niños con beca del 90%.', 'En FUNASF creemos que la educación de los niños es la semilla más valiosa para transformar una sociedad. Nuestro programa de **Primera Infancia** está diseñado para formar auxiliares docentes y cuidadores con sólida formación ética, humana y lúdica.

### Lo que lograrás en el programa
- **Desarrollar tu vocación:** Aprende metodologías activas como el juego, el arte, la literatura y la exploración del medio.
- **Promover el bienestar infantil:** Identificación de alertas en nutrición, desarrollo motriz y pautas de crianza positiva.
- **Ambientes de aprendizaje enriquecidos:** Creación de material didáctico creativo y adaptado a diferentes contextos comunitarios.

### Beca institucional FUNASF
- **90% de cobertura en la colegiatura.**
- **Sin pago de matrícula ni cobro de inscripción.**

Comunícate a nuestros canales de WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**. «¡Tu futuro comienza hoy, transforma vidas desde el amor!»', 'Comité Pedagógico FUNASF', 'Educación', '/blog/primera-infancia-amor-vocacion.jpeg', 'publicado', '2026-09-25T14:00:00.000Z'),
  ('auxiliar-electricidad-ponedera-santo-tomas', 'Convocatoria Técnica: Auxiliar Laboral en Electricidad en Ponedera y Santo Tomás', 'Capacítate en instalaciones eléctricas residenciales y comerciales con talleres prácticos, certificación oficial y beca del 90% en Ponedera y Santo Tomás.', 'El sector de la energía y las instalaciones eléctricas ofrece alta empleabilidad y excelentes oportunidades para el trabajo técnico independiente. FUNASF abre cupos becados para el programa de **Auxiliar Laboral en Electricidad** en las sedes de **Ponedera y Santo Tomás**.

### Contenido práctico del programa
- **Instalaciones eléctricas residenciales y comerciales:** Montaje de acometidas, tableros de distribución, circuitos y luminarias.
- **Normas de seguridad eléctrica y RETIE:** Prevención de accidentes eléctricos y uso adecuado de equipo de protección personal.
- **Mantenimiento y diagnóstico de fallas:** Detección de cortocircuitos, reparación de redes y optimización de consumo de energía.
- **Talleres 100% prácticos:** Clases con herramientas y paneles de prueba reales.

### Beca del 90% FUNASF
- Sin pagar matrícula ni costo de inscripción.
- Sedes disponibles: **Ponedera** y **Santo Tomás**.

Escríbenos por WhatsApp para solicitar tu formulario de beca: **+57 313 577 9384** o **+57 318 915 7015**.', 'Área Técnica e Industrial', 'Técnica', '/blog/auxiliar-electricidad-practica.jpeg', 'publicado', '2026-09-24T10:30:00.000Z'),
  ('sede-ponedera-colegio-candelaria', '¡Nueva sede en Ponedera! Clases fines de semana en el Colegio de La Candelaria', 'Confirmamos nuestro punto académico presencial en Ponedera en el Colegio Agropecuario de La Candelaria, con clases prácticas los días sábados y domingos.', 'Con gran alegría compartimos con la comunidad del departamento del Atlántico la apertura de nuestro centro de formación presencial en el municipio de **Ponedera**.

### Ubicación e instalaciones
- **Lugar:** Colegio Agropecuario de La Candelaria (ubicado al lado del estadio municipal).
- **Días de clase:** Sábados y Domingos en jornadas diurnas y flexibles.
- **Programas ofertados:** Electricidad, Construcción de Edificaciones, Secretariado Ejecutivo, Primera Infancia, Validación de Bachillerato y más.

### Propósito comunitario
Esta sede acerca las oportunidades educativas a los habitantes de Ponedera y municipios vecinos, evitando gastos de traslado hacia Barranquilla y permitiendo a jóvenes y adultos formarse cerca de su hogar.

«Educación que transforma, amistad que no tiene fronteras». Los esperamos. Para inscripciones e informes de matrícula, comunícate al **+57 313 577 9384** o **+57 318 915 7015**.', 'Coordinación Regional Atlántico', 'Sedes', '/blog/sede-ponedera-candelaria.jpeg', 'publicado', '2026-09-23T16:45:00.000Z'),
  ('ingles-avanzado-oportunidades-internacionales', 'Inglés Avanzado con enfoque conversacional y oportunidades laborales internacionales', 'Abre nuevos caminos profesionales con metodología conversacional, clubes de habla inmersivos y horarios flexibles con beca otorgada por FUNASF.', 'El dominio del inglés es la llave maestra para acceder a mejores salarios, trabajo remoto y vacantes en compañías multinacionales. El programa de **Inglés Avanzado de FUNASF** se enfoca en que hables con confianza desde el primer ciclo.

### Metodología del programa
1. **Horarios flexibles:** Opciones entre semana y fines de semana.
2. **Curso con práctica intensiva:** Simulaciones de entrevistas de trabajo, redacción de correos y presentaciones comerciales.
3. **Inglés conversatorio:** Debates dinámicos para perder el miedo y ganar fluidez natural.
4. **Trabajo de campo y proyectos:** Aplicación práctica en situaciones reales del mercado global.

### Beca y facilidades
- No pagas matrícula ni inscripción.
- Material didáctico interactivo incluido.

¡Pide tu beca hoy mismo! Escríbenos vía WhatsApp: **+57 318 915 7015** o **+57 313 577 9384**. ¡Tu futuro no tiene fronteras!', 'Centro de Idiomas FUNASF', 'Idiomas', '/blog/ingles-avanzado-internacional.jpeg', 'publicado', '2026-09-22T08:30:00.000Z'),
  ('valida-tu-bachillerato-en-6-meses', 'Valida tu bachillerato en 6 meses con beca del 90% y metodología por módulos', 'Nunca es tarde para cumplir tus metas. Obtén tu título de bachiller académico en un ciclo intensivo de 6 meses adaptado a jóvenes y adultos.', '¿Aún no has culminado tu bachillerato? En FUNASF creemos firmemente que cada persona merece una segunda oportunidad para progresar. Te presentamos nuestro programa de **Validación del Bachillerato en 6 meses con el 90% de beca**.

### Ventajas de nuestro modelo de validación
- **Duración acelerada:** Culmina tu ciclo académico en solo 6 meses de estudio enfocado.
- **Metodología por módulos:** Avanzas materia por materia, afianzando los conceptos esenciales.
- **Horarios flexibles:** Clases fines de semana o nocturnas para no interferir con tu trabajo.
- **Cero costo de matrícula e inscripción.**

### Requisitos mínimos
- Documento de identidad vigente.
- Certificados de años anteriores cursados (o prueba de nivelación diagnóstica).
- Deseo de superación y compromiso con tu aprendizaje.

¡Pide tu beca hoy y comienza a construir tu futuro! Llama o escribe al **+57 313 577 9384** o **+57 318 915 7015**.', 'Coordinación de Educación Básica', 'Bachillerato', '/blog/bachillerato-acelerado-6-meses.jpeg', 'publicado', '2026-09-21T13:00:00.000Z'),
  ('auxiliar-construccion-edificaciones-ponedera', 'Técnico Laboral Auxiliar de Construcción de Edificaciones en Ponedera', 'Fórmate en interpretación de planos, estructuras, acabados, obra blanca y seguridad en obra con beca del 90% en la sede Ponedera.', 'El crecimiento urbanístico y las obras de infraestructura en la región demandan personal técnico preparado en técnicas constructivas modernas. FUNASF presenta el programa **Técnico Laboral Auxiliar de Construcción de Edificaciones** con sede en **Ponedera**.

### ¿Qué vas a aprender?
- **Interpretación de planos técnicos:** Lectura arquitectónica, estructural y de redes hidrosanitarias y eléctricas.
- **Construcción de estructuras:** Fundición de zapatas, columnas, vigas y levantamiento de muros.
- **Acabados y obra blanca:** Enchapes, estuco, pintura y detalles de terminación de alta calidad.
- **Seguridad en obra:** Prevención de accidentes en obra, uso de EPP y normatividad constructiva.
- **Herramientas y materiales:** Manejo eficiente de mezclas, herramientas manuales y maquinaria liviana.

### Beca del 90%
- Sin pagar matrícula ni inscripción.
- Sede de aplicación: **Ponedera**.

¡Tu futuro se construye hoy! Escríbenos al **+57 318 915 7015** o al **+57 313 577 9384** para registrar tu solicitud de beca.', 'Escuela de Construcción e Infraestructura', 'Construcción', '/blog/construccion-edificaciones-ponedera.jpeg', 'publicado', '2026-09-20T11:00:00.000Z'),
  ('estudia-belleza-integral-y-crea-tu-empresa', 'Estudia Belleza Integral y Crea tu Propia Empresa: Uñas, Maquillaje, Cabello y Masajes', 'Conviértete en profesional del estilismo y la estética con formación completa y asesoría para emprender tu propio negocio independiente.', 'El sector de la estética y el cuidado personal es uno de los más rentables y con mayor dinamismo para emprender. FUNASF te invita a estudiar **Belleza Integral** y poner en marcha tu propio centro de estética o servicio a domicilio.

### Plan de estudios completo en 4 módulos
1. **Toda clase de uñas:** Manicure clásico, semipermanente, uñas acrílicas, polygel y diseños avanzados (nail art).
2. **Maquillaje profesional:** Maquillaje social, de día, noche, novias y técnicas de contorno y visagismo.
3. **Cuidado y diseño capilar:** Cortes modernos, peinados para eventos, colorimetría y tratamientos capilares.
4. **Masajes estéticos:** Masaje relajante, descontracturante, drenaje linfático y técnicas de spa.

### Facilidades de pago
- **Beca del 90% institucional.**
- **No pagas matrícula y tampoco inscripción.**
- **Horarios flexibles adaptados a ti.**

¡Tu talento puede cambiar tu vida! Escribe hoy por WhatsApp al **+57 318 915 7015** o **+57 313 577 9384** y pide tu beca de inmediato.', 'Escuela de Estética y Bienestar', 'Emprendimiento', '/blog/belleza-integral-emprendimiento.jpeg', 'publicado', '2026-09-19T15:30:00.000Z'),
  ('tecnico-secretariado-ejecutivo-ponedera-santo-tomas', 'Técnico Laboral en Secretariado Ejecutivo: Liderazgo administrativo para empresas', 'Aprende redacción ejecutiva, gestión documental, atención al cliente y herramientas de oficina digital en las sedes de Ponedera y Santo Tomás.', 'Las secretarias y asistentes ejecutivos son el motor administrativo y de coordinación en empresas, consultorios y entidades públicas. FUNASF anuncia la convocatoria de becas para el programa **Técnico Laboral en Secretariado Ejecutivo** en **Ponedera y Santo Tomás**.

### Habilidades que desarrollarás
- **Gestión documental y archivo digital:** Organización sistemática de expedientes, bases de datos y correspondencia corporativa.
- **Redacción comercial y ejecutiva:** Elaboración de actas, informes, circulares y correos profesionales con impecable ortografía.
- **Atención y servicio de excelencia:** Protocolo de recepción, atención telefónica y comunicación asertiva con clientes y directivos.
- **Herramientas ofimáticas:** Dominio de procesadores de texto, hojas de cálculo, presentaciones y software de agenda.

### Becas disponibles
- **Beca del 90%** en la mensualidad del programa.
- **Sin pago de matrícula ni derechos de inscripción.**
- **Certificación oficial como Técnico Laboral.**

Sedes de aplicación: **Ponedera** y **Santo Tomás**. ¡Inscríbete ya! Comunícate a los WhatsApp: **+57 313 577 9384** o **+57 318 915 7015**.', 'Área de Administración y Gestión', 'Administración', '/blog/secretariado-ejecutivo-tecnico.jpeg', 'publicado', '2026-09-18T10:15:00.000Z'),
  ('lideres-en-administracion-en-salud-comunitaria', 'Formamos Líderes Comprometidos con la Salud y el Bienestar Comunitario', 'La gestión de la salud requiere profesionales con sólidos principios éticos y técnicos. Conoce el programa de Administración en Salud con beca del 90%.', 'El sistema de salud colombiano exige profesionales que no solo conozcan los procesos de auditoría, admisiones y cuentas médicas, sino que mantengan un firme compromiso con la dignidad del usuario.

### El rol del Administrador en Salud de FUNASF
En nuestra institución formamos personas capacitadas para:
- Coordinar agendas médicas y salas de espera con criterio de equidad y calidez humana.
- Garantizar la correcta custodia de historias clínicas y confidencialidad de datos asistenciales.
- Gestionar convenios, facturación ante el ADRES y liquidación de servicios hospitalarios.
- Promover proyectos comunitarios de salud preventiva y bienestar familiar.

### Apoyo solidario FUNASF
- Beca institucional de hasta el 90 %.
- Sin cobro de matrícula ni cobro de inscripción.
- Acompañamiento tutorial en cada semestre.

Para postularte, contáctanos a nuestras líneas oficiales de WhatsApp: **+57 323 294 6184** o **+57 313 577 9384**. «La solidaridad no conoce de fronteras».', 'Dirección Académica FUNASF', 'Salud', '/blog/administracion-salud-lideres.jpeg', 'publicado', '2026-09-17T14:00:00.000Z'),
  ('curso-vigilancia-seguridad-4-meses', 'Curso de Vigilancia en 4 Meses: Prácticas de tiro y certificado oficial de seguridad', 'Capacitación intensiva en vigilancia privada, defensa preventiva, control de accesos y prácticas de tiro con horarios flexibles y rápida vinculación laboral.', 'El sector de la vigilancia y seguridad privada ofrece una de las tasas de vinculación laboral más rápidas del país. FUNASF presenta su **Curso de Vigilancia en 4 Meses con Certificación Oficial**.

### Puntos clave del curso
1. **Horario flexible:** Elige el turno que mejor se adapte a tu disponibilidad diaria.
2. **Prácticas de tiro y polígono:** Entrenamiento técnico práctico en manejo responsable y seguro de armamento autorizado.
3. **Duración de solo 4 meses:** Formación completa y expedita para comenzar a trabajar en el menor tiempo posible.
4. **Valores institucionales:** Seguridad, disciplina y compromiso con la protección ciudadana y patrimonial.

### Beneficios del apoyo FUNASF
- **Sin pago de matrícula y tampoco de inscripción.**
- Facilidades de pago por cuotas mínimas para los gastos operativos.

¡Tu futuro comienza hoy! Escribe al WhatsApp **+57 318 915 7015** o al **+57 313 577 9384** y solicita tu beca de inmediato.', 'Área de Seguridad y Convivencia', 'Seguridad', '/blog/curso-vigilancia-seguridad-tiro.jpeg', 'publicado', '2026-09-16T09:45:00.000Z'),
  ('bienvenida-nuevo-ciclo-academico', 'Apertura de la nueva convocatoria de becas y formación técnica', 'FUNASF abre postulaciones para programas técnicos en áreas de salud, administración y bienestar comunitario.', 'La Fundación Internacional Amigos Sin Fronteras inicia un nuevo ciclo formativo enfocado en brindar oportunidades reales de desarrollo humano y profesional a jóvenes y adultos de diferentes regiones.

Nuestros programas en alianza con instituciones acreditadas permiten acceder a becas de hasta el 90 %, con un acompañamiento cercano para asegurar la permanencia y culminación de los estudios.', 'Dirección Académica FUNASF', 'Convocatorias', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 'publicado', '2026-09-15T08:00:00.000Z'),
  ('el-impacto-de-la-solidaridad-en-las-comunidades', 'Cómo la educación transforma territorios vulnerables', 'Reflexiones sobre nuestro trabajo comunitario en el Valle del Cauca y la Costa Atlántica.', 'En FUNASF creemos firmemente que la educación no tiene fronteras. Cuando una persona accede a capacitación técnica de calidad, no solo mejora sus ingresos futuros, sino que eleva el bienestar de su familia y entorno.', 'Equipo de Trabajo Social', 'Comunidad', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', 'publicado', '2026-09-14T08:00:00.000Z')
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  resumen = EXCLUDED.resumen,
  contenido = EXCLUDED.contenido,
  autor_nombre = EXCLUDED.autor_nombre,
  categoria = EXCLUDED.categoria,
  imagen_portada = EXCLUDED.imagen_portada,
  estado = EXCLUDED.estado,
  updated_at = now();

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
