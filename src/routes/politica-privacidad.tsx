import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { org } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/politica-privacidad")({
  head: () =>
    createSeoMeta({
      title: "Política de Privacidad | FUNASF Colombia — EduFUNASF",
      description:
        "Política de privacidad y protección de información personal de la Fundación Internacional Amigos Sin Fronteras – FUNASF. Conoce tus derechos y el tratamiento seguro de tus datos.",
      canonicalPath: "/politica-privacidad",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Política de privacidad", path: "/politica-privacidad" },
      ]),
    }),
  component: PoliticaPrivacidadPage,
});

function PoliticaPrivacidadPage() {
  return (
    <>
      <PageHero
        eyebrow="Marco Legal e Institucional"
        title="Política de Privacidad"
        description="Lineamientos sobre la recolección, uso, seguridad y confidencialidad de la información suministrada por estudiantes, postulantes, aliados y colaboradores de FUNASF."
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-foreground/90">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-brand-green font-bold text-sm uppercase tracking-wider">
              <Shield className="size-5" />
              <span>Identificación del Responsable</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              La <strong>{org.razonSocial} (FUNASF)</strong>, identificada con NIT{" "}
              <strong>{org.nit}</strong>, con domicilio principal en {org.ciudadPrincipal} (
              {org.direccionPrincipal}), correo electrónico <strong>{org.correo}</strong> y portal
              oficial <strong>{org.sitioWeb}</strong>, en su calidad de responsable del tratamiento
              de datos personales, pone a disposición de la comunidad su Política de Privacidad.
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                1. Principios Rectores
              </h2>
              <p className="text-muted-foreground">
                En el desarrollo y aplicación de la presente política, FUNASF aplicará de manera
                armónica e integral los principios de legalidad, finalidad, libertad, veracidad o
                calidad, transparencia, acceso y circulación restringida, seguridad y
                confidencialidad, de conformidad con las disposiciones constitucionales y legales
                vigentes en la República de Colombia.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                2. Finalidad de la Información Recopilada
              </h2>
              <p className="text-muted-foreground">
                Los datos personales suministrados a través de formularios físicos, formularios web,
                líneas telefónicas de WhatsApp y canales oficiales de atención serán utilizados
                exclusivamente para los siguientes fines:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Gestionar los procesos de inscripción, preselección y asignación de becas
                  solidarias de hasta el 90 %.
                </li>
                <li>
                  Brindar orientación vocacional y acompañamiento académico a los postulantes y
                  estudiantes activos.
                </li>
                <li>
                  Coordinar con las instituciones educativas aliadas responsables la formalización
                  de matrículas y expedición de certificaciones.
                </li>
                <li>
                  Enviar avisos informativos sobre inicio de clases, cronogramas de exámenes,
                  jornadas pedagógicas y convocatorias comunitarias.
                </li>
                <li>
                  Atender peticiones, quejas, reclamos o sugerencias presentadas por los titulares.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                3. Seguridad y Confidencialidad
              </h2>
              <p className="text-muted-foreground">
                FUNASF adopta las medidas técnicas, humanas y administrativas necesarias para
                otorgar seguridad a los registros, evitando su adulteración, pérdida, consulta, uso
                o acceso no autorizado o fraudulento. La información personal de los usuarios no
                será vendida, cedida ni transferida con fines comerciales a terceros sin previa
                autorización expresa.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                4. Derechos de los Titulares
              </h2>
              <p className="text-muted-foreground">
                Los titulares de la información tienen derecho a conocer, actualizar y rectificar
                sus datos personales frente a FUNASF, solicitar prueba de la autorización otorgada,
                ser informados sobre el uso que se les ha dado a sus datos, presentar consultas o
                quejas, y revocar la autorización o solicitar la supresión de los datos cuando no
                exista un deber legal o contractual de mantenerlos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                5. Canales de Atención para Habeas Data
              </h2>
              <p className="text-muted-foreground">
                Para ejercer sus derechos de consulta, actualización o retiro de base de datos, el
                titular puede comunicarse a través de los canales institucionales:
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface p-4 flex items-center gap-3">
                  <Mail className="size-5 text-brand-green shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Correo de atención</span>
                    <a
                      href={`mailto:${org.correo}`}
                      className="text-sm font-semibold text-foreground hover:underline"
                    >
                      {org.correo}
                    </a>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4 flex items-center gap-3">
                  <Phone className="size-5 text-brand-green shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Línea telefónica principal
                    </span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {org.telefonos[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                6. Vigencia de la Política
              </h2>
              <p className="text-muted-foreground">
                La presente política rige a partir de su publicación oficial y los datos personales
                permanecerán en las bases de datos de la Fundación mientras sea necesario para
                cumplir con las finalidades misionales y los deberes legales correspondientes.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-wrap gap-4 items-center justify-between">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="size-4 mr-2" /> Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/contacto">Contactar a la Fundación</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
