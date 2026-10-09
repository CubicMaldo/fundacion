import { createFileRoute } from "@tanstack/react-router";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";
import { PortalEstudiantilView } from "@/components/site/portal-estudiantil/PortalEstudiantilView";

export const Route = createFileRoute("/portal-estudiantil")({
  head: () =>
    createSeoMeta({
      title: "Portal Estudiantil | FUNASF — Recursos, Notas y Aulas Virtuales",
      description:
        "Espacio de acceso académico para estudiantes de FUNASF: consulta de notas, asignaturas matriculadas, plataformas virtuales y trámites de certificados.",
      canonicalPath: "/portal-estudiantil",
      keywords:
        "portal estudiantil FUNASF, notas FUNASF, campus virtual FUNASF, certificados FUNASF, atencion estudiantes",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Portal Estudiantil", path: "/portal-estudiantil" },
      ]),
    }),
  component: PortalEstudiantilView,
});
