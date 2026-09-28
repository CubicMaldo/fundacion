import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog estudiantil | FUNASF" },
      { name: "description", content: "Noticias y contenidos de la comunidad educativa FUNASF." },
      { property: "og:title", content: "Blog estudiantil | FUNASF" },
      {
        property: "og:description",
        content: "Noticias y contenidos de la comunidad educativa FUNASF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PendingPage
      eyebrow="Blog estudiantil"
      title="Voces de nuestra comunidad"
      description="Este espacio recibirá noticias y contenidos institucionales en una próxima fase."
    />
  ),
});
