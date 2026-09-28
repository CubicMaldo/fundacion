export type NavItem = {
  label: string;
  to: string;
  hash?: string;
  children?: { label: string; to: string; hash?: string }[];
};

export const navegacion: NavItem[] = [
  { label: "Inicio", to: "/" },
  {
    label: "Quiénes somos",
    to: "/quienes-somos",
    children: [
      { label: "Visión", to: "/quienes-somos", hash: "vision" },
      { label: "Misión", to: "/quienes-somos", hash: "mision" },
      { label: "Reseña histórica", to: "/quienes-somos", hash: "resena-historica" },
      { label: "Nuestro propósito", to: "/quienes-somos", hash: "proposito" },
      { label: "Nuestros valores", to: "/quienes-somos", hash: "valores" },
      { label: "Nuestro alcance", to: "/quienes-somos", hash: "alcance" },
      { label: "Sedes", to: "/quienes-somos", hash: "sedes" },
    ],
  },
  {
    label: "Portal informativo",
    to: "/portal-informativo",
    children: [
      { label: "Talleres", to: "/portal-informativo", hash: "talleres" },
      { label: "Formación", to: "/portal-informativo", hash: "formacion" },
      { label: "Emprendimiento", to: "/portal-informativo", hash: "emprendimiento" },
      { label: "Programas sociales", to: "/portal-informativo", hash: "programas-sociales" },
      { label: "Voluntariado", to: "/portal-informativo", hash: "voluntariado" },
      { label: "Alianzas", to: "/portal-informativo", hash: "alianzas" },
    ],
  },
  {
    label: "Estudia con FUNASF",
    to: "/estudia",
    children: [
      { label: "Programas académicos", to: "/estudia", hash: "programas" },
      { label: "Becas", to: "/estudia", hash: "becas" },
      { label: "Instituciones aliadas", to: "/estudia", hash: "instituciones-aliadas" },
      { label: "Requisitos", to: "/estudia", hash: "requisitos" },
      { label: "Matrículas", to: "/estudia", hash: "matriculas" },
    ],
  },
  { label: "Portal estudiantil", to: "/portal-estudiantil" },
  { label: "Galería", to: "/galeria" },
  { label: "Blog estudiantil", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
  { label: "Trabaja con nosotros", to: "/trabaja-con-nosotros" },
];
