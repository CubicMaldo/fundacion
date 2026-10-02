import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, CheckCircle2, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { org } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/tratamiento-datos")({
  head: () =>
    createSeoMeta({
      title: "Tratamiento de Datos Personales | FUNASF Colombia — Ley 1581",
      description:
        "Manual de políticas y procedimientos para el tratamiento de datos personales de la Fundación Internacional Amigos Sin Fronteras conforme a la Ley 1581 de 2012 de Colombia.",
      canonicalPath: "/tratamiento-datos",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Tratamiento de datos", path: "/tratamiento-datos" },
      ]),
    }),
  component: TratamientoDatosPage,
});

function TratamientoDatosPage() {
  return (
    <>
      <PageHero
        eyebrow="Protección de Datos Personales"
        title="Tratamiento de Datos Personales"
        description="Lineamientos y autorizaciones conforme a la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013 de la República de Colombia."
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-foreground/90">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-brand-green font-bold text-sm uppercase tracking-wider">
              <FileText className="size-5" />
              <span>Marco Legal Aplicable</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              En cumplimiento del Artículo 15 de la Constitución Política de Colombia, la{" "}
              <strong>Ley 1581 de 2012</strong> y su Decreto Reglamentario 1377 de 2013, la{" "}
              <strong>{org.razonSocial} (FUNASF)</strong> establece el presente régimen para la
              recolección, almacenamiento, uso, circulación y supresión de datos personales en el
              desarrollo de sus programas sociales, formativos y de becas.
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                1. Autorización del Titular
              </h2>
              <p className="text-muted-foreground">
                La recolección de datos personales por parte de FUNASF requiere la autorización
                previa, expresa e informada del titular. Dicha autorización se obtiene mediante
                consentimiento escrito, digital o a través de conductas inequívocas en el
                diligenciamiento de los formularios de postulación a becas o contacto.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                2. Tratamiento de Datos de Menores de Edad
              </h2>
              <p className="text-muted-foreground">
                En el caso de programas dirigidos a adolescentes (por ejemplo, validación de
                bachillerato o programas técnicos con edad de ingreso a partir de los 16 años),
                FUNASF asegura el respeto prevalente a los derechos de los niños, niñas y
                adolescentes. La autorización respectiva siempre deberá ser otorgada por sus padres,
                tutores o representantes legales.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                3. Tratamiento de Datos Sensibles
              </h2>
              <p className="text-muted-foreground">
                FUNASF no condiciona el acceso a sus servicios a la entrega de datos sensibles,
                salvo aquellos estrictamente requeridos para la asignación de becas de inclusión
                social (condición socioeconómica, pertenencia a grupos vulnerables o certificados
                médicos en programas de salud). En estos casos, se informa al titular el carácter
                facultativo de su respuesta.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                4. Procedimiento para Consultas y Reclamos
              </h2>
              <p className="text-muted-foreground">
                Cualquier titular o causahabiente podrá solicitar la actualización, rectificación o
                cancelación de sus datos siguiendo este procedimiento:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mt-2">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <span className="font-bold text-foreground block text-sm">Consultas</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Serán atendidas en un término máximo de diez (10) días hábiles contados a partir
                    de la fecha de recibo.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <span className="font-bold text-foreground block text-sm">
                    Reclamos y Correcciones
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Serán atendidos en un término máximo de quince (15) días hábiles conforme al
                    Artículo 15 de la Ley 1581 de 2012.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                5. Canales Institucionales de Contacto
              </h2>
              <p className="text-muted-foreground">Las solicitudes deben enviarse por escrito a:</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  • <strong>Correo electrónico:</strong> {org.correo} (Asunto: Habeas Data /
                  Tratamiento de Datos)
                </li>
                <li>
                  • <strong>Dirección física:</strong> {org.direccionPrincipal},{" "}
                  {org.ciudadPrincipal}
                </li>
                <li>
                  • <strong>Línea de atención:</strong> {org.telefonos[0]}
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
              <Link to="/politica-privacidad">Ver Política de Privacidad</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
