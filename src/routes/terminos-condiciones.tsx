import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
export const Route = createFileRoute("/terminos-condiciones")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones | FUNASF" },
      {
        name: "description",
        content: "Espacio reservado para los términos y condiciones oficiales de FUNASF.",
      },
      { property: "og:title", content: "Términos y condiciones | FUNASF" },
      {
        property: "og:description",
        content: "Espacio reservado para los términos y condiciones oficiales de FUNASF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PendingPage
      eyebrow="Legal"
      title="Términos y condiciones"
      description="Documento institucional pendiente de publicación."
    />
  ),
});
