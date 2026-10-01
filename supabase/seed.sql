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
  ('contacto', '{"telefonos":["313 577 9384","318 915 7015","323 294 6184","317 165 7124"],"correo":"info@funasf.org","instagram":"@funasfinternacional","instagramUrl":"https://instagram.com/funasfinternacional","ciudadPrincipal":"Cali, Valle del Cauca — Colombia","direccionPrincipal":"CR 96 45 119, Cali","formularioInscripcion":"https://forms.gle/kYUoX2v1dewKUrMX8","horario":"Lunes a Viernes 8:00 AM - 5:00 PM"}'::jsonb),
  ('institucional', '{"nombre":"Fundación Internacional Amigos Sin Fronteras","sigla":"FUNASF","razonSocial":"FUNDACION INTERNACIONAL AMIGOS SIN FRONTERAS","nit":"901964394-1","eslogan":"Porque la educación no tiene fronteras.","esloganSecundario":"Una oportunidad puede comenzar con una conversación.","frases":["Somos los pies, las manos y la voz de los más necesitados.","Aquí la solidaridad no conoce fronteras."],"quienesSomos":{"intro":"La Fundación Internacional Amigos Sin Fronteras – FUNASF es una organización de carácter social orientada al desarrollo de programas y proyectos que contribuyen al bienestar, la educación, la formación, la inclusión y el fortalecimiento de las comunidades.","parrafos":["Nuestro trabajo nace de una convicción: una oportunidad puede cambiar una vida, pero una comunidad unida puede transformar una sociedad.","Desarrollamos iniciativas sociales, educativas, de formación para el trabajo, emprendimiento, salud, bienestar y apoyo comunitario. Para ello, articulamos esfuerzos con docentes, profesionales, voluntarios, instituciones, empresas, organizaciones sociales y personas comprometidas con la transformación social."],"compromiso":"Trabajamos para que las oportunidades no estén determinadas únicamente por la capacidad económica de una persona. Por eso impulsamos programas de apoyo, becas, formación y acompañamiento social.","destacado":"En FUNASF creemos que la educación no tiene fronteras y que el conocimiento debe convertirse en una herramienta para transformar vidas."},"mision":["Contribuir a la transformación social mediante programas de educación, formación, salud, emprendimiento, bienestar y acción comunitaria, brindando oportunidades especialmente a personas y comunidades en condición de vulnerabilidad.","Promovemos el acceso a procesos de formación y desarrollo de capacidades, fortaleciendo la autonomía, el emprendimiento, la inclusión social y las oportunidades para mejorar la calidad de vida.","Nuestra misión se fundamenta en la solidaridad, la dignidad humana, el respeto, la inclusión, la responsabilidad y el compromiso con las comunidades."],"vision":{"parrafos":["Ser una fundación reconocida a nivel nacional e internacional por su compromiso con la transformación social, la educación y el desarrollo humano.","Buscamos consolidar una red de oportunidades que permita llevar programas sociales y educativos a diferentes territorios, especialmente a comunidades que requieren mayores posibilidades de acceso a la educación, la formación y el desarrollo económico y social."],"futuro":["Ampliar nuestra presencia territorial.","Fortalecer nuestros programas de educación y formación.","Incrementar las oportunidades de becas.","Desarrollar nuevos proyectos sociales.","Fortalecer nuestros programas de emprendimiento.","Crear alianzas nacionales e internacionales.","Promover el voluntariado.","Impulsar proyectos de salud y bienestar.","Generar oportunidades para jóvenes, adultos y familias.","Llegar a más comunidades con el mensaje de que la educación no tiene fronteras."]},"proposito":{"titulo":"Transformar solidaridad en oportunidades","intro":"El propósito de FUNASF es contribuir a que las personas puedan desarrollar sus capacidades y encontrar nuevas oportunidades para mejorar sus condiciones de vida.","ejes":[{"nombre":"Educación","icono":"GraduationCap","texto":"Promovemos el acceso a procesos de formación que permitan adquirir conocimientos, desarrollar competencias y fortalecer los proyectos de vida."},{"nombre":"Salud y bienestar","icono":"HeartPulse","texto":"Apoyamos iniciativas orientadas a la promoción de la salud, la prevención, el bienestar y la atención de necesidades sociales relacionadas con las comunidades."},{"nombre":"Desarrollo social","icono":"Users","texto":"Trabajamos con comunidades y personas que requieren acompañamiento, orientación y oportunidades para fortalecer su desarrollo integral."},{"nombre":"Emprendimiento","icono":"Sprout","texto":"Impulsamos iniciativas que permitan transformar ideas y conocimientos en oportunidades económicas sostenibles."},{"nombre":"Solidaridad","icono":"HandHeart","texto":"Movilizamos voluntarios, aliados, empresas y ciudadanos para convertir la solidaridad en acciones concretas."}]},"valores":[{"nombre":"Solidaridad","texto":"Ayudar a quien lo necesita y trabajar por el bienestar colectivo."},{"nombre":"Respeto","texto":"Reconocer la dignidad y los derechos de cada persona."},{"nombre":"Responsabilidad","texto":"Cumplir nuestros compromisos con la comunidad."},{"nombre":"Inclusión","texto":"Crear oportunidades sin discriminación."},{"nombre":"Transparencia","texto":"Actuar con honestidad y claridad."},{"nombre":"Amor","texto":"Trabajar con humanidad, empatía y sensibilidad."},{"nombre":"Esperanza","texto":"Creer que siempre es posible construir un futuro diferente."}],"alcance":{"intro":"FUNASF busca continuar ampliando su presencia territorial y desarrollar actividades en diferentes municipios del departamento del Atlántico y otros territorios.","presencia":["Soledad – Atlántico","Santo Tomás – Atlántico","Ponedera – Atlántico","Sabanalarga – Atlántico"],"proyeccion":["Valledupar","Nuevos territorios"],"destacado":"Porque estudiar también debe ser posible cerca de casa."}}'::jsonb),
  ('becas', '{"titulo":"Estudia con el apoyo de la Fundación","porcentaje":"Becas de hasta el 90 %","aclaracion":"Sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.","intro":"FUNASF desarrolla convocatorias de becas de hasta el 90 %, sujetas a disponibilidad, requisitos y condiciones establecidas en cada convocatoria.","proposito":"Nuestro propósito es contribuir a que más personas puedan acceder a oportunidades de formación sin que las dificultades económicas sean una barrera para alcanzar sus metas.","beneficios":["Becas de hasta el 90 %.","Programas de formación técnica.","Modalidad virtual en los programas disponibles.","Formación presencial en sedes disponibles.","Horarios flexibles.","Oportunidades de formación cerca de la comunidad."],"destacado":"La educación no debe ser un privilegio. Debe ser una oportunidad."}'::jsonb),
  ('sedes', '[{"ciudad":"Cali","pais":"Colombia","descripcion":"Sede registrada de la Fundación en Colombia.","direccion":"CR 96 45 119, Cali","telefono":"313 577 9384","whatsapp":"313 577 9384","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE CALI PENDIENTE]"},{"ciudad":"Costa Atlántica","pais":"Colombia","descripcion":"Territorio donde la Fundación desarrolla programas en Soledad, Santo Tomás, Ponedera y Sabanalarga.","direccion":"PENDIENTE","telefono":"318 915 7015","whatsapp":"PENDIENTE","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE COSTA ATLÁNTICA PENDIENTE]"},{"ciudad":"Panamá","pais":"Panamá","descripcion":"País donde nace la Fundación, con una visión internacional.","direccion":"PENDIENTE","telefono":"PENDIENTE","whatsapp":"PENDIENTE","horario":"PENDIENTE","mapa":"PENDIENTE","imagenPendiente":"[FOTOGRAFÍA SEDE PANAMÁ PENDIENTE]"}]'::jsonb)
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
    'La Fundación Internacional Amigos Sin Fronteras inicia un nuevo ciclo formativo enfocado en brindar oportunidades reales de desarrollo humano y profesional a jóvenes y adultos de diferentes regiones.

Nuestros programas en alianza con instituciones acreditadas permiten acceder a becas de hasta el 90 %, con un acompañamiento cercano para asegurar la permanencia y culminación de los estudios.',
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
