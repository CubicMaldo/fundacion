import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Laptop,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProgramaPorSlug, getWhatsappProgramaUrl, programasFunasf } from "@/data/programas";
import { org, telefonoPrincipal } from "@/data/funasf";

export const Route = createFileRoute("/programas/$slug")({
  loader: ({ params }) => {
    const programa = getProgramaPorSlug(params.slug);
    return { programa };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.programa;
    const title = p ? `${p.nombre} — Estudia con FUNASF` : "Programa académico | FUNASF";
    const description =
      p?.resumen ??
      "Programas técnicos con becas de hasta el 90 % a través de instituciones aliadas.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProgramaDetalle,
});

function ProgramaDetalle() {
  const { slug } = Route.useParams();
  const programa = getProgramaPorSlug(slug);

  if (!programa) {
    return (
      <div className="container-page py-24 text-center">
        <span className="eyebrow">Oferta académica</span>
        <h1 className="text-foreground mt-4 text-3xl font-bold md:text-4xl">
          Programa no encontrado
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base leading-relaxed">
          El programa académico que estás buscando no forma parte de la oferta oficial vigente o el
          enlace es incorrecto.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild variant="default">
            <Link to="/estudia" hash="programas">
              <ArrowLeft aria-hidden className="mr-2 size-4" />
              Ver catálogo de programas
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contacto">Contactar a la Fundación</Link>
          </Button>
        </div>
      </div>
    );
  }

  const whatsappUrl = getWhatsappProgramaUrl(programa.nombre);
  const programasRelacionados = programasFunasf
    .filter((p) => p.areaId === programa.areaId && p.slug !== programa.slug)
    .slice(0, 3);

  return (
    <>
      {/* NAVEGACIÓN Y BREADCRUMB */}
      <div className="border-border/60 bg-muted/30 border-b text-xs">
        <div className="container-page flex flex-wrap items-center gap-2 py-3 text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/estudia" className="hover:text-primary transition-colors">
            Estudia con FUNASF
          </Link>
          <span>/</span>
          <Link to="/estudia" hash="programas" className="hover:text-primary transition-colors">
            {programa.areaNombre}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {programa.nombre}
          </span>
        </div>
      </div>

      {/* HERO DEL PROGRAMA */}
      <PageHero
        eyebrow={`FUNASF · ${programa.areaNombre}`}
        title={programa.nombre}
        description={programa.resumen}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="gold" size="lg">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Inscribirme a este programa <ArrowRight aria-hidden className="ml-2 size-4" />
            </a>
          </Button>
          <Button asChild variant="outlineInvert" size="lg">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden className="mr-2 size-4" />
              Consultar por WhatsApp
            </a>
          </Button>
          <Button asChild variant="ghostInvert" size="lg">
            <Link to="/estudia" hash="programas">
              <ArrowLeft aria-hidden className="mr-2 size-4" />
              Ver otros programas
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* BLOQUE DE VALOR Y RESUMEN RÁPIDO */}
      <Section tone="surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-institucional">
            <div className="bg-brand-green/10 text-brand-green-deep flex size-10 items-center justify-center rounded-lg">
              <GraduationCap aria-hidden className="size-5" />
            </div>
            <h2 className="text-foreground mt-4 text-base font-semibold">Tipo de formación</h2>
            <p className="text-muted-foreground mt-1 text-sm">{programa.tipo}</p>
          </div>

          <div className="card-institucional">
            <div className="bg-brand-gold/20 text-brand-brown flex size-10 items-center justify-center rounded-lg">
              <Award aria-hidden className="size-5" />
            </div>
            <h2 className="text-foreground mt-4 text-base font-semibold">Apoyo educativo</h2>
            <p className="text-brand-green-deep mt-1 text-sm font-semibold">
              {programa.beneficioBeca}
            </p>
          </div>

          <div className="card-institucional">
            <div className="bg-brand-brown/10 text-brand-brown flex size-10 items-center justify-center rounded-lg">
              <Laptop aria-hidden className="size-5" />
            </div>
            <h2 className="text-foreground mt-4 text-base font-semibold">Modalidad</h2>
            <p className="text-muted-foreground mt-1 text-sm">{programa.modalidad}</p>
          </div>

          <div className="card-institucional">
            <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg">
              <Clock aria-hidden className="size-5" />
            </div>
            <h2 className="text-foreground mt-4 text-base font-semibold">Duración y horarios</h2>
            <p className="text-brand-brown mt-1 text-xs font-semibold">
              [SUJETOS A LA CONVOCATORIA VIGENTE DE LA INSTITUCIÓN ALIADA]
            </p>
          </div>
        </div>
      </Section>

      {/* SECCIÓN PRINCIPAL: ACORDEÓN DESPLEGABLE DE INFORMACIÓN */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Estructura del programa"
              title="Información detallada"
              description="Haz clic en cada sección desplegable para conocer el perfil, plan de estudios, requisitos, campo laboral y condiciones de certificación."
            />

            {/* ACORDEÓN DESPLEGABLE AL ESTILO DEL SITIO DE REFERENCIA */}
            <div className="mt-8">
              <Accordion
                type="multiple"
                defaultValue={["formacion-perfil", "plan-estudio", "campo-laboral", "requisitos"]}
                className="w-full space-y-4"
              >
                {/* 1. FORMACIÓN Y PERFIL DE EGRESO */}
                <AccordionItem
                  value="formacion-perfil"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <GraduationCap className="size-4" />
                      </span>
                      Formación y perfil del egresado
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <p>{programa.descripcion}</p>
                    <div className="bg-muted/40 mt-4 rounded-lg p-4">
                      <h4 className="text-foreground font-semibold">Certificación otorgada:</h4>
                      <p className="mt-1">{programa.titulacion}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 2. PLAN DE ESTUDIO */}
                <AccordionItem
                  value="plan-estudio"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <BookOpen className="size-4" />
                      </span>
                      Plan de estudio y módulos
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <p className="text-brand-brown font-semibold">
                      [PLAN DE ESTUDIOS POR MÓDULOS PENDIENTE DE ASIGNACIÓN SEGÚN LA INSTITUCIÓN
                      EDUCATIVA ALIADA]
                    </p>
                    <p className="mt-2">{programa.planEstudioPendiente}</p>
                    <p className="mt-3 text-xs italic">
                      Los módulos teóricos, prácticas y talleres son administrados por el cuerpo
                      docente de la institución formadora aliada responsable del programa.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* 3. MODALIDAD, DURACIÓN Y HORARIOS */}
                <AccordionItem
                  value="modalidad-duracion"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <Clock className="size-4" />
                      </span>
                      Modalidad, duración y horarios
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="border-border bg-background rounded-lg border p-3.5">
                        <strong className="text-foreground block text-xs tracking-wider uppercase">
                          Modalidad
                        </strong>
                        <span className="mt-1 block text-sm">{programa.modalidad}</span>
                      </div>
                      <div className="border-border bg-background rounded-lg border p-3.5">
                        <strong className="text-foreground block text-xs tracking-wider uppercase">
                          Horarios y duración
                        </strong>
                        <span className="text-brand-brown mt-1 block text-xs font-semibold">
                          [SUJETOS A DISPONIBILIDAD DE CADA CONVOCATORIA]
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 4. CAMPO LABORAL */}
                <AccordionItem
                  value="campo-laboral"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <Briefcase className="size-4" />
                      </span>
                      Campo laboral y salidas ocupacionales
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <p>
                      Al culminar el proceso de formación y certificación con la institución aliada,
                      el egresado podrá desempeñarse en:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {programa.campoLaboral.map((campo) => (
                        <li key={campo} className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className="bg-brand-green mt-2 size-1.5 shrink-0 rounded-full"
                          />
                          <span>{campo}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* 5. REQUISITOS DE INGRESO */}
                <AccordionItem
                  value="requisitos"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <CheckCircle2 className="size-4" />
                      </span>
                      Requisitos de ingreso
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <ul className="space-y-2.5">
                      {programa.requisitosGenerales.map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-border/60 mt-4 border-t pt-3">
                      <p className="text-brand-brown text-xs font-semibold">
                        [REQUISITOS ADICIONALES ESPECÍFICOS DE LA INSTITUCIÓN ALIADA PENDIENTES DE
                        SUMINISTRAR]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 6. BECAS Y MATRÍCULA */}
                <AccordionItem
                  value="becas-costos"
                  className="border-border bg-card rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green-soft text-brand-green-deep flex size-8 items-center justify-center rounded-md">
                        <Award className="size-4" />
                      </span>
                      Becas FUNASF, costos y matrícula
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <p className="text-foreground font-semibold">{programa.beneficioBeca}</p>
                    <p className="mt-2">{programa.matricula}</p>
                    <p className="mt-3 text-xs leading-relaxed">
                      El propósito de FUNASF es que la situación económica no sea una barrera para
                      estudiar. Las becas se asignan conforme a la disponibilidad de cada
                      convocatoria.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* 7. RECUERDA: MARCO LEGAL */}
                <AccordionItem
                  value="recuerda"
                  className="border-brand-green/30 bg-brand-green-soft/20 rounded-xl border px-6 shadow-2xs"
                >
                  <AccordionTrigger className="text-brand-green-deep hover:text-brand-green py-5 text-base font-bold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="bg-brand-green text-primary-foreground flex size-8 items-center justify-center rounded-md">
                        <ShieldCheck className="size-4" />
                      </span>
                      Recuerda: Modelo institucional y marco legal
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-1 pb-6 text-sm leading-relaxed">
                    <p className="text-foreground font-medium">{programa.avisoLegal}</p>
                    <p className="border-brand-green mt-3 border-l-3 pl-3 text-xs italic">
                      “FUNASF acompaña, gestiona y promueve oportunidades. Nuestras instituciones
                      aliadas forman y certifican.”
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* COLUMNA LATERAL: CAJA DE CONVERSIÓN Y DATOS */}
          <aside className="sticky top-28 space-y-6">
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <span className="text-brand-gold text-xs font-bold tracking-wider uppercase">
                Inscripción y orientación
              </span>
              <h3 className="text-brand-green-deep mt-2 text-xl font-bold">
                ¿Deseas estudiar {programa.nombre}?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Completa el formulario oficial para postularte a las becas de hasta el 90 % o
                comunícate directamente con nuestro equipo de admisiones.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="gold" className="w-full">
                  <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                    Formulario de inscripción <ArrowRight aria-hidden className="ml-1.5 size-4" />
                  </a>
                </Button>
                <Button asChild variant="default" className="w-full">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle aria-hidden className="mr-2 size-4" />
                    Consultar por WhatsApp
                  </a>
                </Button>
              </div>

              <div className="border-border/60 mt-6 border-t pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone aria-hidden className="size-3.5" />
                  Línea de atención:{" "}
                  <a
                    href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}
                    className="text-foreground font-semibold hover:underline"
                  >
                    {telefonoPrincipal}
                  </a>
                </p>
              </div>
            </div>

            <div className="border-border bg-muted/40 rounded-xl border p-5">
              <h4 className="text-foreground text-sm font-semibold">Resumen de condiciones</h4>
              <ul className="text-muted-foreground mt-3 space-y-2 text-xs">
                <li>• Beca de hasta el 90 % sujeta a convocatoria.</li>
                <li>• Sin cobro de matrícula en convocatorias aplicables.</li>
                <li>• Certificación expedida por la institución aliada.</li>
                <li>• Horarios y cupos limitados por periodo.</li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      {/* PROGRAMAS RELACIONADOS DEL MISMO ÁREA */}
      {programasRelacionados.length > 0 && (
        <Section tone="soft">
          <SectionHeading
            eyebrow="Oferta complementaria"
            title={`Otros programas en ${programa.areaNombre}`}
            description="Explora más alternativas de formación disponibles en esta misma área académica."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {programasRelacionados.map((rel) => (
              <article key={rel.slug} className="card-institucional flex flex-col justify-between">
                <div>
                  <span className="text-brand-gold text-xs font-semibold uppercase">
                    {rel.tipo}
                  </span>
                  <h3 className="text-brand-green-deep mt-2 text-lg font-bold">{rel.nombre}</h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                    {rel.resumen}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <span className="text-brand-green-deep text-xs font-medium">Beca hasta 90 %</span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/programas/$slug" params={{ slug: rel.slug }}>
                      Ver detalle <ArrowRight aria-hidden className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* CTA FINAL */}
      <Section>
        <div className="border-border bg-card rounded-2xl border p-8 text-center sm:p-12">
          <span className="eyebrow">Tu futuro no tiene fronteras</span>
          <h2 className="text-foreground mt-3 text-3xl font-bold md:text-4xl">
            Comienza tu proceso de formación con FUNASF
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed">
            Diligencia el formulario o habla con nosotros para verificar la disponibilidad de becas
            y los periodos de convocatoria vigentes para {programa.nombre}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="default">
              <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                Formulario de inscripción
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden className="mr-2 size-4" />
                Hablar con un orientador
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
