import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  HelpCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { InscripcionForm } from "@/components/site/InscripcionForm";
import { whatsappLink } from "@/data/funasf";
import { programasAcademicos } from "@/data/programas";
import { createSeoMeta, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export interface InscripcionSearchParams {
  programa?: string | undefined;
}

export const Route = createFileRoute("/inscripcion")({
  validateSearch: (search: Record<string, unknown>): InscripcionSearchParams => {
    return {
      programa: typeof search["programa"] === "string" ? (search["programa"] as string) : undefined,
    };
  },
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
  const { programa: programaQuery } = Route.useSearch();

  // Si viene por query param (ej. /inscripcion?programa=auxiliar-de-enfermeria o nombre directo)
  const matchedProgram = programaQuery
    ? programasAcademicos.find(
        (p) =>
          p.slug === programaQuery ||
          p.nombre.toLowerCase().trim() === programaQuery.toLowerCase().trim(),
      )
    : undefined;

  const preselectedName = matchedProgram?.nombre || programaQuery || undefined;
  const preselectedId = matchedProgram?.slug || undefined;

  return (
    <>
      <PageHero
        badge="Convocatoria 2026"
        badgeIcon={<GraduationCap className="size-4" />}
        title="Formulario Oficial de Postulación y Beca"
        lead="Da el primer paso hacia tu formación técnica laboral. Diligencia tus datos para verificar tu elegibilidad a las becas de hasta el 90 % con FUNASF y nuestras instituciones aliadas."
      />

      <Section className="py-10 md:py-16 bg-background">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-12 items-start">
          {/* Formulario Principal */}
          <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-border/70">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-2">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <span>Paso 1: Registro preliminar de aspirante</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                Datos de Postulación
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Completa tus datos de contacto para iniciar tu proceso. No realizas ningún pago hoy; primero evaluamos tu postulación a la beca del 90 %.
              </p>
            </div>

            <InscripcionForm
              programaNombre={preselectedName}
              programaId={preselectedId}
              showHeader={false}
            />
          </div>

          {/* Información y Beneficios Laterales */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-cream/60 border border-brand-gold/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-gold-deep mb-3 font-semibold text-sm">
                <HelpCircle className="size-4" />
                <span>¿Cómo funciona el proceso de beca?</span>
              </div>
              <ul className="space-y-3.5 text-xs text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white font-bold text-[10px]">
                    1
                  </span>
                  <span>
                    <strong>Envías este formulario:</strong> Recibimos tus datos e iniciamos tu expediente preliminar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white font-bold text-[10px]">
                    2
                  </span>
                  <span>
                    <strong>Contacto de orientación:</strong> Un asesor te contacta por WhatsApp o llamada para validar tu sede y horarios.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white font-bold text-[10px]">
                    3
                  </span>
                  <span>
                    <strong>Formalización de matrícula:</strong> Entregas tus documentos básicos e inicias tu formación con tu beca activa.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-brand-green mb-3 font-semibold text-sm">
                <ShieldCheck className="size-4" />
                <span>Documentos para formalizar</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Una vez aprobada tu solicitud preliminar, se te solicitará:
              </p>
              <ul className="space-y-2 text-xs text-foreground/75 list-disc list-inside">
                <li>Fotocopia de tu documento de identidad vigente (C.C., T.I., C.E., PPT).</li>
                <li>Certificado de 9° grado aprobado o fotocopia de acta/diploma de bachiller.</li>
                <li>Certificado de afiliación a salud (EPS o SISBÉN activo).</li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-brand-green mb-2 font-semibold text-sm">
                <Phone className="size-4" />
                <span>¿Prefieres atención telefónica?</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Comunícate directamente con nuestro equipo de admisiones si requieres asistencia con el formulario.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 text-xs transition-colors shadow-xs"
              >
                Chatear con Orientador de Admisiones
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
