/**
 * Catálogo Oficial de Programas de FUNASF.
 * Fuente: Documento oficial institucional FUNASF (Sección 6: Formación Académica)
 * y RUT institucional.
 *
 * REGLA ESTRICTA: Sin alucinaciones. Ningún dato inventado o copiado de otras instituciones.
 * Todo dato específico de plan de estudio, duración u horarios que dependa de la institución aliada
 * se marca explícitamente como PENDIENTE.
 */

import { org, telefonoPrincipal } from "./funasf";

export const PENDIENTE_DATO = "PENDIENTE";

export type AreaId = "salud" | "sst" | "administracion" | "educacion-social" | "otras" | "basica";

export type AreaAcademica = {
  id: AreaId;
  nombre: string;
  descripcion: string;
};

export const areasAcademicas: AreaAcademica[] = [
  {
    id: "salud",
    nombre: "Área de salud",
    descripcion:
      "Programas orientados a la formación en servicios y atención en salud mediante convenios con instituciones aliadas autorizadas.",
  },
  {
    id: "sst",
    nombre: "Seguridad y Salud en el Trabajo",
    descripcion:
      "Capacitación en prevención de riesgos laborales y normatividad de seguridad en entornos de trabajo.",
  },
  {
    id: "administracion",
    nombre: "Administración y empresa",
    descripcion:
      "Formación técnica orientada a la gestión empresarial, contabilidad, mercadeo y operaciones logísticas.",
  },
  {
    id: "educacion-social",
    nombre: "Educación y área social",
    descripcion: "Programas dedicados a la atención y acompañamiento pedagógico y social.",
  },
  {
    id: "otras",
    nombre: "Otras áreas de formación",
    descripcion:
      "Formación técnica y ocupacional en oficios productivos, servicios, idiomas y expresiones culturales.",
  },
  {
    id: "basica",
    nombre: "Educación básica",
    descripcion:
      "Nivelación y validación del bachillerato para jóvenes y adultos mediante instituciones aliadas legalmente facultadas.",
  },
];

export type ProgramaAcademico = {
  slug: string;
  nombre: string;
  areaId: AreaId;
  areaNombre: string;
  tipo: string;
  esValidacion?: boolean;
  resumen: string;
  descripcion: string;
  modalidad: string;
  duracion: string;
  horarios: string;
  titulacion: string;
  institucionAliada: string;
  beneficioBeca: string;
  matricula: string;
  requisitosGenerales: string[];
  requisitosEspecificos: string;
  planEstudioPendiente: string;
  avisoLegal: string;
};

const AVISO_LEGAL_BASE =
  "FUNASF facilita y promueve el acceso a este programa de formación mediante convocatorias y acompañamiento comunitario con becas de hasta el 90 %. La formación académica, el plan de estudios, las prácticas, las evaluaciones y la expedición de títulos o certificaciones corresponden a la institución educativa aliada legalmente autorizada.";

const REQUISITOS_GENERALES_BASE = [
  "Documento de identidad vigente (cédula de ciudadanía, tarjeta de identidad o documento de extranjería válido).",
  "Certificado de estudios mínimos requeridos para el programa según convocatoria.",
  "Diligenciamiento del formulario oficial de inscripción o postulación de FUNASF.",
];

export const programasFunasf: ProgramaAcademico[] = [
  // --- ÁREA DE SALUD ---
  {
    slug: "auxiliar-de-enfermeria",
    nombre: "Auxiliar de Enfermería",
    areaId: "salud",
    areaNombre: "Área de salud",
    tipo: "Técnico Laboral",
    resumen:
      "Formación técnica en apoyo a la atención y cuidado integral de pacientes en articulación con instituciones educativas aliadas de salud.",
    descripcion:
      "El programa de Auxiliar de Enfermería promovido por FUNASF permite a las personas prepararse para apoyar servicios de salud, atención humanizada a pacientes y cuidado comunitario, a través de instituciones educativas aliadas responsables de la formación teórica, clínica y práctica.",
    modalidad: "Presencial / Teórico-práctico (según disponibilidad de sede y convocatoria)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios, asignaturas y horas de práctica clínica son definidos y administrados por la institución educativa aliada legalmente acreditada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "servicios-farmaceuticos",
    nombre: "Servicios Farmacéuticos",
    areaId: "salud",
    areaNombre: "Área de salud",
    tipo: "Técnico Laboral",
    resumen:
      "Capacitación para el apoyo en recepción, almacenamiento y dispensación de medicamentos y productos farmacéuticos.",
    descripcion:
      "Programa orientado a desarrollar competencias en el manejo de medicamentos, dispensación orientada y control en farmacias y droguerías, con el aval académico y de prácticas de la institución formadora aliada.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios por módulos y prácticas farmacéuticas corresponde a la institución aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "administracion-en-salud",
    nombre: "Administración en Salud",
    areaId: "salud",
    areaNombre: "Área de salud",
    tipo: "Técnico Laboral",
    resumen:
      "Formación técnica orientada a los procesos administrativos, admisión, facturación y registros de salud.",
    descripcion:
      "Capacita a los estudiantes en la gestión de citas, historias clínicas, facturación médica y atención a usuarios del sistema de salud en entidades prestadoras.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios institucional es expedido y avalado por la entidad educativa aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },

  // --- SEGURIDAD Y SALUD EN EL TRABAJO ---
  {
    slug: "seguridad-y-salud-en-el-trabajo",
    nombre: "Seguridad y Salud en el Trabajo",
    areaId: "sst",
    areaNombre: "Seguridad y Salud en el Trabajo",
    tipo: "Técnico Laboral",
    resumen:
      "Capacitación en identificación de factores de riesgo, prevención de accidentes y fomento de entornos seguros.",
    descripcion:
      "Brinda conocimientos para apoyar la implementación de sistemas de gestión de seguridad y salud laboral en organizaciones públicas y privadas, en articulación con entidades educativas aliadas.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios y módulos normativos son administrados por la institución aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },

  // --- ADMINISTRACIÓN Y EMPRESA ---
  {
    slug: "administracion",
    nombre: "Administración",
    areaId: "administracion",
    areaNombre: "Administración y empresa",
    tipo: "Técnico Laboral",
    resumen:
      "Formación integral en gestión de recursos, coordinación operativa y procesos administrativos organizacionales.",
    descripcion:
      "Prepara a las personas para apoyar procesos operativos, archivo, atención y dirección básica en empresas y proyectos productivos.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios corresponde a la institución educativa aliada responsable.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "auxiliar-administrativo-y-contable",
    nombre: "Auxiliar Administrativo y Contable",
    areaId: "administracion",
    areaNombre: "Administración y empresa",
    tipo: "Técnico Laboral",
    resumen:
      "Competencias en registro de operaciones contables, nómina, facturación y documentación institucional.",
    descripcion:
      "Programa técnico orientado a dar soporte en los departamentos de finanzas, contabilidad y administración de comercios y empresas.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios contable y administrativo es establecido por la entidad aliada certificadora.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "mercadeo-y-ventas",
    nombre: "Mercadeo y Ventas",
    areaId: "administracion",
    areaNombre: "Administración y empresa",
    tipo: "Técnico Laboral",
    resumen:
      "Técnicas comerciales, atención al cliente, fidelización y estrategias de comercialización.",
    descripcion:
      "Formación orientada a desarrollar destrezas en promoción de productos, negociación comercial y servicio posventa para empresas y emprendimientos locales.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios de ventas y mercadeo corresponde a la entidad formadora aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "logistica",
    nombre: "Logística",
    areaId: "administracion",
    areaNombre: "Administración y empresa",
    tipo: "Técnico Laboral",
    resumen: "Gestión de inventarios, almacén, compras y despacho eficiente de mercancías.",
    descripcion:
      "Capacita en la cadena de suministros, recepción, control y distribución de bienes y materiales en almacenes y centros de distribución.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de estudios logístico es estructurado por la institución aliada responsable.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "secretariado-ejecutivo",
    nombre: "Secretariado Ejecutivo",
    areaId: "administracion",
    areaNombre: "Administración y empresa",
    tipo: "Técnico Laboral",
    resumen:
      "Asistencia ejecutiva, gestión de correspondencia, agenda directiva y relaciones corporativas.",
    descripcion:
      "Desarrolla habilidades en comunicación corporativa, redacción de documentos oficiales y asistencia de alta dirección.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "Los módulos y talleres de secretariado son certificados por la entidad aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },

  // --- EDUCACIÓN Y ÁREA SOCIAL ---
  {
    slug: "primera-infancia",
    nombre: "Primera Infancia",
    areaId: "educacion-social",
    areaNombre: "Educación y área social",
    tipo: "Técnico Laboral",
    resumen:
      "Acompañamiento pedagógico y cuidado integral para niños y niñas en etapas tempranas de desarrollo.",
    descripcion:
      "Formación orientada al cuidado, estimulación lúdica y bienestar infantil en jardines, centros de desarrollo comunitario y entornos familiares.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan pedagógico y requisitos de práctica infantil corresponden a la institución educativa aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },

  // --- OTRAS ÁREAS DE FORMACIÓN ---
  {
    slug: "belleza-integral",
    nombre: "Belleza Integral",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Técnico Laboral",
    resumen:
      "Técnicas de estética, cuidado capilar, facial, corporal y barbería para emprendimiento personal.",
    descripcion:
      "Formación técnica orientada a brindar competencias en cuidado estético y generar oportunidades directas de autoempleo y emprendimiento.",
    modalidad: "Presencial (talleres prácticos en sede autorizada)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente: "El plan de estudios práctico es coordinado por la institución aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "ingles",
    nombre: "Inglés",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Programa de Formación y Conocimientos Académicos",
    resumen:
      "Aprendizaje del idioma inglés por niveles para comunicación cotidiana, laboral y académica.",
    descripcion:
      "Programa enfocado en desarrollar comprensión auditiva, lectura, escritura y conversación para ampliar horizontes laborales y de estudio.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado de conocimientos académicos en idiomas expedido por la institución aliada responsable.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El marco de niveles y metodología corresponde a la institución aliada correspondiente.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "vigilancia",
    nombre: "Vigilancia",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Programa de Formación para el Trabajo",
    resumen:
      "Capacitación en control de accesos, seguridad de instalaciones y protocolos de protección.",
    descripcion:
      "Brinda conocimientos para el desempeño en servicios de vigilancia y seguridad privada a través de entidades formadoras especializadas.",
    modalidad: "Presencial (según convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificación emitida conforme a la normatividad aplicable por la institución formadora aliada.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "Los módulos de seguridad y normatividad corresponden a la entidad aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "hoteleria-y-turismo",
    nombre: "Hotelería y Turismo",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Técnico Laboral",
    resumen:
      "Servicio de atención a huéspedes, guiado, recepción y promoción de destinos turísticos.",
    descripcion:
      "Prepara al estudiante para trabajar en el sector hotelero, agencias de viaje y eventos turísticos en la región.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente: "El plan de estudios turístico es determinado por la institución aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "electricidad",
    nombre: "Electricidad",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Técnico Laboral",
    resumen:
      "Instalación, mantenimiento y reparación de redes e instalaciones eléctricas residenciales y comerciales.",
    descripcion:
      "Desarrolla habilidades técnicas para montar circuitos, aplicar normas técnicas y realizar mantenimiento seguro en instalaciones eléctricas.",
    modalidad: "Presencial (talleres prácticos en sede autorizada)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "Los módulos técnicos y normas de seguridad eléctrica son administrados por la entidad aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "mecanica-de-motos",
    nombre: "Mecánica de Motos",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Técnico Laboral",
    resumen:
      "Diagnóstico, mantenimiento preventivo y reparación mecánica y eléctrica de motocicletas.",
    descripcion:
      "Capacitación eminentemente práctica en motores de dos y cuatro tiempos, sistemas de frenos, transmisión y ajuste mecánico.",
    modalidad: "Presencial (talleres prácticos en sede autorizada)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente: "El plan de taller mecánico es expedido por la institución aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "construccion",
    nombre: "Construcción",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Técnico Laboral",
    resumen:
      "Procesos constructivos, mampostería, acabados, lectura de planos y normas de seguridad en obra.",
    descripcion:
      "Capacita para apoyar obras civiles, remodelaciones y proyectos de edificación comunitaria con destrezas técnicas prácticas.",
    modalidad: "Presencial (talleres prácticos en sede autorizada)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado o título técnico expedido por la institución educativa aliada responsable del programa.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de módulos y prácticas de construcción corresponde a la entidad formadora aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },
  {
    slug: "musica",
    nombre: "Música",
    areaId: "otras",
    areaNombre: "Otras áreas de formación",
    tipo: "Programa de Formación y Expresión Artística",
    resumen:
      "Iniciación y práctica instrumental, apreciación musical y expresión artística comunitaria.",
    descripcion:
      "Espacio formativo para potenciar el talento artístico y musical en jóvenes y adultos, impulsando proyectos culturales y comunitarios.",
    modalidad: "Presencial (talleres en sedes comunitarias)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Certificado de formación artística y musical emitido por la institución aliada correspondiente.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: REQUISITOS_GENERALES_BASE,
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "El plan de ensambles e instrumentos musicales corresponde a la entidad aliada.",
    avisoLegal: AVISO_LEGAL_BASE,
  },

  // --- EDUCACIÓN BÁSICA / VALIDACIÓN ---
  {
    slug: "validacion-del-bachillerato",
    nombre: "Programas de validación del bachillerato",
    areaId: "basica",
    areaNombre: "Educación básica",
    tipo: "Educación Básica y Media de Adultos (Por Ciclos)",
    esValidacion: true,
    resumen:
      "Nivelación y culminación del bachillerato por ciclos lectivos especiales integrados, según la institución responsable.",
    descripcion:
      "Permite a jóvenes y adultos culminar su educación básica y media de manera flexible y acelerada, conforme a las condiciones, requisitos y normatividad establecida por la institución educativa aliada responsable.",
    modalidad: "Presencial y virtual (según disponibilidad y convocatoria vigente)",
    duracion: PENDIENTE_DATO,
    horarios: PENDIENTE_DATO,
    titulacion:
      "Título de Bachiller Académico expedido directamente por la institución educativa aliada con registro y reconocimiento legal ante la Secretaría de Educación.",
    institucionAliada: PENDIENTE_DATO,
    beneficioBeca: "Beca de hasta el 90 %, según disponibilidad y convocatoria vigente.",
    matricula: "En las convocatorias que así lo establezcan, no se cobra matrícula o inscripción.",
    requisitosGenerales: [
      "Documento de identidad vigente.",
      "Certificados de estudio de los años o ciclos previamente aprobados.",
      "Diligenciamiento del formulario oficial de inscripción de FUNASF.",
    ],
    requisitosEspecificos: PENDIENTE_DATO,
    planEstudioPendiente:
      "La estructura por ciclos lectivos especiales y materias académicas es administrada por la institución educativa aliada responsable.",
    avisoLegal:
      "FUNASF no emite títulos de bachiller. La validación, formación por ciclos y expedición del título de bachiller corresponde exclusivamente a la institución educativa aliada con autorización de la Secretaría de Educación.",
  },
];

/**
 * Devuelve el enlace de WhatsApp prellenado para un programa específico.
 */
export function getWhatsappProgramaUrl(nombrePrograma: string): string {
  const tel = telefonoPrincipal.replace(/\s/g, "");
  const texto = encodeURIComponent(
    `Hola, deseo información sobre el programa de ${nombrePrograma} en FUNASF.`,
  );
  return `https://wa.me/57${tel}?text=${texto}`;
}

/**
 * Busca un programa por su slug.
 */
export function getProgramaPorSlug(slug: string): ProgramaAcademico | undefined {
  return programasFunasf.find((p) => p.slug === slug);
}

/**
 * Devuelve el slug a partir del nombre del programa.
 */
export function getSlugPorNombre(nombre: string): string {
  const normalizar = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const query = normalizar(nombre);
  const encontrado = programasFunasf.find((p) => {
    const pNom = normalizar(p.nombre);
    return (
      pNom === query ||
      (p.esValidacion && query.includes("validaci")) ||
      pNom.includes(query) ||
      query.includes(pNom)
    );
  });

  return encontrado ? encontrado.slug : "validacion-del-bachillerato";
}
