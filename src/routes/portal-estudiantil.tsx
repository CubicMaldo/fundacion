import { createFileRoute } from "@tanstack/react-router";
import { PendingPage } from "@/components/site/PendingPage";

export const Route = createFileRoute("/portal-estudiantil")({
  head: () => ({ meta: [
    { title: "Portal estudiantil | FUNASF" },
    { name: "description", content: "Próximo acceso al portal estudiantil de FUNASF." },
    { property: "og:title", content: "Portal estudiantil | FUNASF" },
    { property: "og:description", content: "Próximo acceso al portal estudiantil de FUNASF." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PendingPage eyebrow="Próximamente" title="Portal estudiantil" description="El acceso académico será habilitado en una próxima fase del proyecto." />,
});