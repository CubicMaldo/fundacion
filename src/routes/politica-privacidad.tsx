import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/politica-privacidad")({
  head: () =>
    createSeoMeta({
      title: "Política de Privacidad | FUNASF",
      description:
        "Términos de la política de privacidad de la Fundación Internacional Amigos Sin Fronteras.",
      canonicalPath: "/politica-privacidad",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Política de privacidad", path: "/politica-privacidad" },
      ]),
    }),
  component: () => (
    <PendingPage
      eyebrow="Legal"
      title="Política de privacidad"
      description="Documento institucional pendiente de publicación."
    />
  ),
});
