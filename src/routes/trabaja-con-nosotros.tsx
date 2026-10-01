import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/trabaja-con-nosotros")({
  head: () =>
    createSeoMeta({
      title: "Trabaja con Nosotros | FUNASF — Oportunidades y Convocatorias",
      description:
        "Oportunidades de vinculación laboral y voluntariado en FUNASF para docentes, profesionales y líderes comunitarios.",
      canonicalPath: "/trabaja-con-nosotros",
      keywords: "trabajar en FUNASF, empleo fundacion, docentes FUNASF, voluntariado",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Trabaja con nosotros", path: "/trabaja-con-nosotros" },
      ]),
    }),
  component: () => (
    <PendingPage
      eyebrow="Talento"
      title="Trabaja con nosotros"
      description="Las convocatorias oficiales se publicarán aquí cuando estén disponibles."
    />
  ),
});
