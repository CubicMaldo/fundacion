/**
 * Utilidades SEO para la Fundación Internacional Amigos Sin Fronteras – FUNASF.
 * Genera metadatos canónicos, OpenGraph, Twitter Cards y marcado estructurado Schema.org JSON-LD
 * sin inventar información, basado en los datos institucionales oficiales.
 */

import { org, faq } from "@/data/funasf";
import type { ProgramaAcademico } from "@/data/programas";

export const SITE_URL = "https://www.edufunasf.org";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Crea las etiquetas <meta>, <link> y <script> para el método head() de TanStack Router.
 */
export function createSeoMeta({
  title,
  description,
  canonicalPath = "/",
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
  noindex = false,
  jsonLd,
}: SeoOptions) {
  const normalizedPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "author", content: `${org.sigla} Colombia — EduFUNASF` },
    {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    },
    // Open Graph
    { property: "og:site_name", content: `EduFUNASF | ${org.sigla} Colombia` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: ogType },
    { property: "og:locale", content: "es_CO" },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: `EduFUNASF — ${org.eslogan}` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  if (keywords) {
    meta.push({ name: "keywords", content: keywords });
  }

  const links: Array<Record<string, string>> = [{ rel: "canonical", href: canonicalUrl }];

  const scripts: Array<{ type: string; children: string }> = [];

  if (jsonLd) {
    const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const item of data) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(item),
      });
    }
  }

  return { meta, links, scripts };
}

/**
 * Esquema Schema.org de EducationalOrganization / NGO oficial para FUNASF Colombia (edufunasf.org)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "NGO"],
    name: "Fundación Internacional Amigos Sin Fronteras – FUNASF Colombia",
    alternateName: ["FUNASF", "EduFUNASF", "FUNASF Colombia", "Fundación Amigos Sin Fronteras"],
    legalName: org.razonSocial,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    image: DEFAULT_OG_IMAGE,
    slogan: org.eslogan,
    description:
      "Portal educativo y de acción comunitaria oficial de FUNASF en Colombia. Programas de formación técnica y laboral en alianza, becas de hasta el 90 %, emprendimiento y desarrollo social en Cali, municipios del Atlántico y nuevos territorios.",
    taxID: org.nit,
    telephone: org.telefonos.map((t) => `+57${t.replace(/\s/g, "")}`),
    email: org.correo,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.direccionPrincipal,
      addressLocality: "Cali",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Cali, Valle del Cauca" },
      { "@type": "AdministrativeArea", name: "Soledad, Atlántico" },
      { "@type": "AdministrativeArea", name: "Santo Tomás, Atlántico" },
      { "@type": "AdministrativeArea", name: "Ponedera, Atlántico" },
      { "@type": "AdministrativeArea", name: "Sabanalarga, Atlántico" },
      { "@type": "AdministrativeArea", name: "Valledupar, Cesar" },
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "Panamá" },
    ],
    parentOrganization: {
      "@type": "NGO",
      name: "Fundación Internacional Amigos Sin Fronteras (Panamá)",
      url: "https://www.edufunasf.org",
    },
    sameAs: [org.instagramUrl, "https://www.edufunasf.org"],
  };
}

/**
 * Esquema Schema.org FAQPage basado en las preguntas oficiales
 */
export function getFaqSchema(items = faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.respuesta,
      },
    })),
  };
}

/**
 * Esquema Schema.org BreadcrumbList
 */
export function getBreadcrumbSchema(crumbs: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path.startsWith("/") ? crumb.path : `/${crumb.path}`}`,
    })),
  };
}

/**
 * Esquema Schema.org Course / EducationalOccupationalProgram para cada programa
 */
export function getCourseSchema(programa: ProgramaAcademico) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: programa.nombre,
    description: programa.descripcion,
    provider: {
      "@type": "EducationalOrganization",
      name: `${org.sigla} en convenio con Instituciones Educativas Aliadas`,
      url: SITE_URL,
    },
    courseMode: programa.modalidades,
    occupationalCategory: programa.perfilOcupacional,
    hasCourseInstance: programa.modalidades.map((m) => ({
      "@type": "CourseInstance",
      courseMode: m,
      courseWorkload:
        programa.duracionEstimada ?? "Según plan de estudios de la institución aliada",
    })),
    educationalCredentialAwarded:
      "Certificación o titulación otorgada por la institución educativa aliada responsable del programa",
    offers: {
      "@type": "Offer",
      category: "Beca solidaria de hasta el 90 %",
      description: "Becas de hasta el 90 % según convocatoria y condiciones de la Fundación.",
      url: `${SITE_URL}/estudia#becas`,
    },
  };
}

/**
 * Esquema Schema.org BlogPosting para artículos
 */
export function getArticleSchema(article: {
  titulo: string;
  resumen: string;
  slug: string;
  fechaPublicacion: string;
  autorNombre: string;
  imagenPortada?: string | null | undefined;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.titulo,
    description: article.resumen,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.fechaPublicacion,
    author: {
      "@type": "Person",
      name: article.autorNombre,
    },
    publisher: {
      "@type": "Organization",
      name: org.nombre,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
    image: article.imagenPortada ?? DEFAULT_OG_IMAGE,
  };
}
