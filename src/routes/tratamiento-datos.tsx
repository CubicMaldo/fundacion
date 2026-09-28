import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";
export const Route = createFileRoute("/tratamiento-datos")({ head: () => ({ meta: [
  { title: "Tratamiento de datos | FUNASF" }, { name: "description", content: "Espacio reservado para la política de tratamiento de datos de FUNASF." },
  { property: "og:title", content: "Tratamiento de datos | FUNASF" }, { property: "og:description", content: "Espacio reservado para la política de tratamiento de datos de FUNASF." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: () => <PendingPage eyebrow="Legal" title="Tratamiento de datos" description="Documento institucional pendiente de publicación." /> });