/**
 * CONTENIDO DE DEMOSTRACIÓN — REEMPLAZABLE.
 * Estos elementos existen solo para visualizar la estructura de tarjetas.
 * Serán administrados posteriormente desde el CMS (fase siguiente).
 */

export type TallerDemo = {
  slug: string;
  titulo: string;
  fecha: string;
  categoria: string;
  modalidad: string;
  descripcion: string;
};

export const talleresDemo: TallerDemo[] = [
  {
    slug: "taller-demostracion-1",
    titulo: "[TÍTULO DEL TALLER PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Talleres",
    modalidad: "Presencial / Virtual",
    descripcion:
      "Contenido de demostración. Este espacio mostrará la información del taller cuando sea suministrada por FUNASF.",
  },
  {
    slug: "taller-demostracion-2",
    titulo: "[TÍTULO DEL TALLER PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Formación",
    modalidad: "[MODALIDAD PENDIENTE]",
    descripcion:
      "Contenido de demostración. Este espacio mostrará la información del taller cuando sea suministrada por FUNASF.",
  },
  {
    slug: "taller-demostracion-3",
    titulo: "[TÍTULO DEL TALLER PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Emprendimiento",
    modalidad: "[MODALIDAD PENDIENTE]",
    descripcion:
      "Contenido de demostración. Este espacio mostrará la información del taller cuando sea suministrada por FUNASF.",
  },
];

export type EntradaBlogDemo = {
  slug: string;
  titulo: string;
  autor: string;
  fecha: string;
  categoria: string;
  resumen: string;
};

export const blogDemo: EntradaBlogDemo[] = [
  {
    slug: "publicacion-demostracion-1",
    titulo: "[TÍTULO DE LA PUBLICACIÓN PENDIENTE]",
    autor: "[AUTOR PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Experiencias",
    resumen:
      "Espacio de demostración para artículos, investigaciones, proyectos y experiencias de la comunidad estudiantil.",
  },
  {
    slug: "publicacion-demostracion-2",
    titulo: "[TÍTULO DE LA PUBLICACIÓN PENDIENTE]",
    autor: "[AUTOR PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Investigaciones",
    resumen:
      "Espacio de demostración para artículos, investigaciones, proyectos y experiencias de la comunidad estudiantil.",
  },
  {
    slug: "publicacion-demostracion-3",
    titulo: "[TÍTULO DE LA PUBLICACIÓN PENDIENTE]",
    autor: "[AUTOR PENDIENTE]",
    fecha: "[FECHA PENDIENTE]",
    categoria: "Noticias estudiantiles",
    resumen:
      "Espacio de demostración para artículos, investigaciones, proyectos y experiencias de la comunidad estudiantil.",
  },
];

/** Instituciones aliadas: nombres y logos aún no suministrados. */
export const institucionesAliadasPendientes = [1, 2, 3].map((n) => ({
  id: n,
  nombre: "[NOMBRE INSTITUCIÓN ALIADA PENDIENTE]",
  descripcion: "[DESCRIPCIÓN PENDIENTE]",
  programas: "[PROGRAMAS ASOCIADOS PENDIENTES]",
  sitioWeb: "[SITIO WEB PENDIENTE]",
  logoPendiente: "[LOGO INSTITUCIÓN ALIADA PENDIENTE]",
}));
