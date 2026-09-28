import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería | FUNASF" },
      { name: "description", content: "Galería institucional de actividades y programas FUNASF." },
      { property: "og:title", content: "Galería | FUNASF" },
      {
        property: "og:description",
        content: "Galería institucional de actividades y programas FUNASF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PendingPage
      eyebrow="Galería"
      title="Historias que transforman"
      description="Las fotografías institucionales se publicarán cuando sean suministradas por FUNASF."
    />
  ),
});
