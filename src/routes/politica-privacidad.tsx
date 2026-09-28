import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
export const Route = createFileRoute("/politica-privacidad")({ head: () => ({ meta: [
  { title: "Política de privacidad | FUNASF" }, { name: "description", content: "Espacio reservado para la política de privacidad oficial de FUNASF." },
  { property: "og:title", content: "Política de privacidad | FUNASF" }, { property: "og:description", content: "Espacio reservado para la política de privacidad oficial de FUNASF." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: () => <PendingPage eyebrow="Legal" title="Política de privacidad" description="Documento institucional pendiente de publicación." /> });