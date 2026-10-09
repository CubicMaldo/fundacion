import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { InscripcionForm } from "@/components/site/InscripcionForm";
import { org, whatsappLink } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/inscripcion")({
  head: () =>
    createSeoMeta({
      title: "Formulario de Inscripción y Becas | FUNASF Colombia — EduFUNASF",
      description:
        "Postúlate a las convocatorias de becas de hasta el 90 % en formación técnica, laboral y programas sociales de FUNASF en Colombia. Diligencia tu formulario oficial.",
      canonicalPath: "/inscripcion",
      keywords:
        "formulario inscripcion FUNASF, becas FUNASF, postularse beca fundacion, estudiar con FUNASF, formacion tecnica Cali Atlantico",
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Inscripción", path: "/inscripcion" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Formulario Oficial de Inscripción — FUNASF",
          url: `${SITE_URL}/inscripcion`,
          description: "Formulario de postulación para programas académicos y convocatorias de becas solidarias.",
        },
      ],
    }),
  component: InscripcionPage,
});

function InscripcionPage() {
  return (
    <>
      <PageHero
        badge="Admisiones 2026"
        badgeIcon={<GraduationCap className="size-4" />}
        title="Formulario Oficial de Inscripción y Solicitud de Beca"
        lead="Da el primer paso hacia tu formación técnica y profesional con respaldo social. Completa tus datos para postularte a beneficios de matrícula de hasta el 90 % con FUNASF."
      />

      <Section className="py-12 md:py-16 bg-background">
        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-12 items-start">
          {/* Formulario Principal */}
          <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            <InscripcionForm showHeader={true} />
          </div>

          {/* Información y Beneficios Laterales */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-cream/60 border border-brand-gold/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-gold-deep mb-3 font-semibold text-sm">
                <Sparkles className="size-4" />
                <span>¿Por qué postularte con FUNASF?</span>
              </div>
              <ul className="space-y-3 text-xs text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>
                    <strong>Cobertura solidaria:</strong> Acceso a becas de hasta el 90 % del costo formativo en programas técnicos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>
                    <strong>Flexibilidad horaria:</strong> Modalidades virtuales, sabatinas y presenciales adaptadas a trabajadores y jóvenes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>
                    <strong>Certificación válida:</strong> Programas en convenio y articulación con instituciones avaladas por secretarías de educación.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>
                    <strong>Acompañamiento integral:</strong> Tutoría docente personalizada y orientación para el empleo o emprendimiento.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-green mb-3 font-semibold text-sm">
                <ShieldCheck className="size-4" />
                <span>Documentos requeridos para legalizar matrícula</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Una vez aprobada tu solicitud preliminar de beca, nuestro equipo te solicitará:
              </p>
              <ul className="space-y-2 text-xs text-foreground/75 list-disc list-inside">
                <li>Fotocopia del documento de identidad vigente (C.C., T.I., C.E., PPT).</li>
                <li>Certificado de 9° grado aprobado o fotocopia del acta / diploma de bachiller.</li>
                <li>Certificado de afiliación a EPS o SISBÉN activo.</li>
                <li>Comprobante o recibo de servicio público del lugar de residencia.</li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-green mb-2 font-semibold text-sm">
                <Phone className="size-4" />
                <span>¿Dudas con tu postulación?</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Comunícate con nuestra línea directa de admisiones y becas para recibir asesoría personalizada.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green/10 text-brand-green hover:bg-brand-green/20 px-4 py-2.5 text-xs font-semibold transition-colors"
                >
                  Escribir a WhatsApp de Admisiones
                </a>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted/40 px-4 py-2.5 text-xs font-semibold transition-colors text-foreground"
                >
                  Ver sedes y otros canales de atención
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
