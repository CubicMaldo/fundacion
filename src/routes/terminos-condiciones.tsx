import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/terminos-condiciones")({
  head: () =>
    createSeoMeta({
      title: "Términos y Condiciones | FUNASF",
      description:
        "Términos y condiciones de uso del sitio web y convocatorias de la Fundación Internacional Amigos Sin Fronteras.",
      canonicalPath: "/terminos-condiciones",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Términos y condiciones", path: "/terminos-condiciones" },
      ]),
    }),
  component: () => (
    <PendingPage
      eyebrow="Legal"
      title="Términos y condiciones"
      description="Documento institucional pendiente de publicación."
    />
  ),
});
