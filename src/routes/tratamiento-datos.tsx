import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/tratamiento-datos")({
  head: () =>
    createSeoMeta({
      title: "Tratamiento de Datos Personales | FUNASF",
      description:
        "Directrices y política para el tratamiento y protección de datos personales en FUNASF conforme a la Ley 1581 de Colombia.",
      canonicalPath: "/tratamiento-datos",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Tratamiento de datos", path: "/tratamiento-datos" },
      ]),
    }),
  component: () => (
    <PendingPage
      eyebrow="Legal"
      title="Tratamiento de datos"
      description="Documento institucional pendiente de publicación."
    />
  ),
});
