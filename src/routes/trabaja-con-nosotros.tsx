import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";

export const Route = createFileRoute("/trabaja-con-nosotros")({
  head: () => ({ meta: [
    { title: "Trabaja con nosotros | FUNASF" }, { name: "description", content: "Próximas oportunidades para colaborar profesionalmente con FUNASF." },
    { property: "og:title", content: "Trabaja con nosotros | FUNASF" }, { property: "og:description", content: "Próximas oportunidades para colaborar profesionalmente con FUNASF." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PendingPage eyebrow="Talento" title="Trabaja con nosotros" description="Las convocatorias oficiales se publicarán aquí cuando estén disponibles." />,
});