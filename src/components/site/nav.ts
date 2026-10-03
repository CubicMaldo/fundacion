export type NavItem = {
  label: string;
  to: string;
  hash?: string;
  children?: { label: string; to: string; hash?: string; description?: string }[];
};

export const navegacion: NavItem[] = [
  { label: "Inicio", to: "/" },
  {
    label: "Quiénes somos",
    to: "/quienes-somos",
    children: [
      {
        label: "Misión y visión",
        to: "/quienes-somos",
        hash: "mision",
        description: "Nuestro propósito y horizonte social",
      },
      {
        label: "Reseña histórica",
        to: "/quienes-somos",
        hash: "resena-historica",
        description: "Trayectoria y origen de FUNASF",
      },
      {
        label: "Propósito y valores",
        to: "/quienes-somos",
        hash: "valores",
        description: "Principios éticos y vocación comunitaria",
      },
      {
        label: "Alcance y sedes",
        to: "/quienes-somos",
        hash: "sedes",
        description: "Presencia territorial y cobertura",
      },
    ],
  },
  {
    label: "Estudia",
    to: "/estudia",
    children: [
      {
        label: "Programas académicos",
        to: "/programas",
        description: "Catálogo completo de áreas y programas",
      },
      {
        label: "Convocatoria de becas",
        to: "/estudia",
        hash: "becas",
        description: "Apoyo educativo para poblaciones prioritarias",
      },
      {
        label: "Requisitos y matrícula",
        to: "/estudia",
        hash: "matriculas",
        description: "Proceso de admisión paso a paso",
      },
      {
        label: "Formulario de inscripción",
        to: "/inscripcion",
        description: "Postúlate en línea a nuestras becas",
      },
      {
        label: "Portal estudiantil",
        to: "/portal-estudiantil",
        description: "Servicios y recursos para estudiantes",
      },
    ],
  },
  {
    label: "Iniciativas",
    to: "/portal-informativo",
    children: [
      {
        label: "Talleres y formación",
        to: "/portal-informativo",
        hash: "talleres",
        description: "Capacitación práctica y cursos breves",
      },
      {
        label: "Emprendimiento",
        to: "/portal-informativo",
        hash: "emprendimiento",
        description: "Impulso a proyectos comunitarios",
      },
      {
        label: "Programas sociales",
        to: "/portal-informativo",
        hash: "programas-sociales",
        description: "Bienestar, inclusión y apoyo a familias",
      },
      {
        label: "Voluntariado y alianzas",
        to: "/portal-informativo",
        hash: "voluntariado",
        description: "Suma tus talentos y capacidades",
      },
    ],
  },
  {
    label: "Comunidad",
    to: "/blog",
    children: [
      {
        label: "Blog institucional",
        to: "/blog",
        description: "Noticias, testimonios y reflexiones",
      },
      {
        label: "Galería de actividades",
        to: "/galeria",
        description: "Registros de eventos y experiencias",
      },
      {
        label: "Trabaja con nosotros",
        to: "/trabaja-con-nosotros",
        description: "Oportunidades docentes y voluntarias",
      },
    ],
  },
  { label: "Contacto", to: "/contacto" },
];
