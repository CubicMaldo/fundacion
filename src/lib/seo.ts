/**
 * Utilidades SEO para la Fundación Internacional Amigos Sin Fronteras – FUNASF.
 * Genera metadatos canónicos, OpenGraph, Twitter Cards y marcado estructurado Schema.org JSON-LD
 * sin inventar información, basado en los datos institucionales oficiales.
 */

import { org, faq, mision } from "@/data/funasf";
import type { ProgramaAcademico } from "@/data/programas";

export const SITE_URL = "https://www.edufunasf.org";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function toAbsoluteUrl(url?: string | null): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${SITE_URL}${clean}`;
}

export interface SeoOptions {
  title: string;
  description?: string;
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
  description = org.eslogan,
  canonicalPath = "/",
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
  noindex = false,
  jsonLd,
}: SeoOptions) {
  const normalizedPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
  const absoluteOgImage = toAbsoluteUrl(ogImage);

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
    { property: "og:image", content: absoluteOgImage },
    { property: "og:image:alt", content: `EduFUNASF — ${org.eslogan}` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteOgImage },
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
    description: mision[0],
    email: org.correo,
    telephone: org.telefonos[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: org.direccionPrincipal,
      addressLocality: "Cali",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    taxID: org.nit,
    sameAs: [org.instagramUrl],
  };
}

/**
 * Esquema Schema.org FAQPage basado en las preguntas frecuentes institucionales oficiales
 */
export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  };
}

/**
 * Esquema Schema.org BreadcrumbList para mejorar la navegación en SERP
 */
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const normalizedPath = item.path.startsWith("/") ? item.path : `/${item.path}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`,
      };
    }),
  };
}

/**
 * Esquema Schema.org Course para fichas de programas técnicos y de formación
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
    occupationalCategory: Array.isArray(programa.perfilOcupacional)
      ? programa.perfilOcupacional.join(", ")
      : programa.perfilOcupacional,
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
  fechaModificacion?: string | null | undefined;
  autorNombre: string;
  imagenPortada?: string | null | undefined;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    headline: article.titulo,
    description: article.resumen,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.fechaPublicacion,
    dateModified: article.fechaModificacion || article.fechaPublicacion,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    author: {
      "@type": "Person",
      name: article.autorNombre,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: org.nombre,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.svg`,
      },
    },
    image: toAbsoluteUrl(article.imagenPortada),
  };
}
