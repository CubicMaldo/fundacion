import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, FileCheck, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { org } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/terminos-condiciones")({
  head: () =>
    createSeoMeta({
      title: "Términos y Condiciones | FUNASF Colombia — EduFUNASF",
      description:
        "Términos y condiciones de uso del portal web, convocatorias de becas solidarias y programas formativos en convenio de la Fundación Internacional Amigos Sin Fronteras.",
      canonicalPath: "/terminos-condiciones",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Términos y condiciones", path: "/terminos-condiciones" },
      ]),
    }),
  component: TerminosCondicionesPage,
});

function TerminosCondicionesPage() {
  return (
    <>
      <PageHero
        eyebrow="Términos Legales"
        title="Términos y Condiciones"
        description="Condiciones generales de uso del portal web oficial de FUNASF, participación en convocatorias de becas y régimen de articulación académica con instituciones aliadas."
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-foreground/90">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-brand-green font-bold text-sm uppercase tracking-wider">
              <FileCheck className="size-5" />
              <span>Condiciones Generales de Uso</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              El acceso y uso de este portal web, así como la postulación a las convocatorias de
              becas promovidas por la <strong>{org.razonSocial} (FUNASF)</strong>, NIT{" "}
              <strong>{org.nit}</strong>, están sujetos a los presentes Términos y Condiciones. Al
              navegar en este sitio o enviar formularios de postulación, el usuario declara haber
              leído, comprendido y aceptado en su totalidad estas estipulaciones.
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                1. Naturaleza de la Fundación y de los Programas
              </h2>
              <p className="text-muted-foreground">
                FUNASF es una entidad de carácter social sin ánimo de lucro orientada a facilitar el
                acceso a la educación técnica, laboral y comunitaria. FUNASF actúa como entidad
                gestora, facilitadora y promotora de oportunidades educativas y becas de apoyo
                solidario.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                2. Modelo de Articulación con Instituciones Educativas Aliadas
              </h2>
              <p className="text-muted-foreground">
                FUNASF no sustituye a las instituciones educativas aliadas. La formación académica,
                la asignación de docentes, las evaluaciones, el plan de estudios, las prácticas
                formativas, la certificación de competencias y la expedición formal de títulos o
                diplomas corresponden de manera privativa y exclusiva a la institución educativa
                legalmente autorizada responsable de cada programa.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                3. Convocatorias de Becas y Apoyos Educativos
              </h2>
              <p className="text-muted-foreground">
                Las becas de hasta el 90 % otorgadas en las convocatorias de FUNASF están sujetas a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Disponibilidad de cupos en el municipio, sede y modalidad seleccionada.</li>
                <li>
                  Cumplimiento veraz y oportuno de los requisitos de admisión y documentación
                  requerida.
                </li>
                <li>
                  Formalización de matrícula ante la secretaría académica de la institución
                  educativa aliada respectiva.
                </li>
                <li>
                  Cumplimiento del reglamento académico y disciplinario de la institución aliada
                  durante el periodo de estudios.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                4. Veracidad de la Información Suministrada
              </h2>
              <p className="text-muted-foreground">
                El usuario y postulante garantiza que todos los datos consignados en los formularios
                de postulación o entregados al equipo de orientación son verídicos, exactos y
                vigentes. Cualquier inconsistencia o falsedad documental dará lugar a la anulación
                inmediata del cupo o beneficio de beca asignado.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                5. Propiedad Intelectual y Uso del Portal
              </h2>
              <p className="text-muted-foreground">
                Los contenidos, textos, marcas, logotipos, emblemas institucionales y diseños
                gráficos presentes en el portal www.edufunasf.org son propiedad de FUNASF o de sus
                respectivos titulares. Queda prohibida su reproducción, comercialización o
                distribución sin previa autorización expresa y por escrito de la Fundación.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                6. Canales de Contacto y Orientación Oficial
              </h2>
              <p className="text-muted-foreground">
                Para consultas acerca de estos términos o del estado de una postulación, el
                interesado puede comunicarse a través de:
              </p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  • <strong>Correo electrónico:</strong> {org.correo}
                </li>
                <li>
                  • <strong>Línea de orientación telefónica / WhatsApp:</strong> {org.telefonos[0]}
                </li>
                <li>
                  • <strong>Sede principal:</strong> {org.direccionPrincipal}, {org.ciudadPrincipal}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-wrap gap-4 items-center justify-between">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="size-4 mr-2" /> Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/estudia" hash="becas">
                Conocer las becas
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
