import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  HelpCircle,
  Laptop,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  getProgramaPorSlug,
  getWhatsappProgramaUrl,
  PENDIENTE_DATO,
  programasFunasf,
} from "@/data/programas";
import { org } from "@/data/funasf";

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

      {/* BLOQUE DE VALOR Y RESUMEN TÉCNICO */}
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

      {/* FORMACIÓN Y PERFIL DEL PROGRAMA */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading
              eyebrow="Formación académica"
              title="Sobre este programa"
              description={programa.descripcion}
            />

            <div className="mt-8 space-y-6">
              <div className="border-border bg-card rounded-xl border p-6">
                <h3 className="text-brand-green-deep text-lg font-semibold">
                  Certificación y titulación
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {programa.titulacion}
                </p>
                <p className="text-muted-foreground mt-3 text-xs">
                  FUNASF acompaña, orienta y canaliza becas de apoyo social para el ingreso al
                  programa. La institución educativa aliada evalúa y expide los certificados
                  correspondientes.
                </p>
              </div>

              <div className="border-border bg-card rounded-xl border p-6">
                <h3 className="text-brand-green-deep text-lg font-semibold">
                  Plan de estudios y módulos
                </h3>
                <p className="text-brand-brown mt-2 text-sm font-semibold">
                  [PLAN DE ESTUDIOS ESPECÍFICO PENDIENTE DE ASIGNACIÓN SEGÚN INSTITUCIÓN ALIADA]
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {programa.planEstudioPendiente}
                </p>
              </div>
            </div>
          </div>

          {/* REQUISITOS Y PROCEDIMIENTO */}
          <div className="space-y-6">
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="text-brand-green-deep flex items-center gap-2 text-lg font-semibold">
                <CheckCircle2 aria-hidden="true" className="text-brand-green size-5" />
                Requisitos de ingreso
              </h3>
              <ul className="mt-4 space-y-3">
                {programa.requisitosGenerales.map((req) => (
                  <li key={req} className="flex gap-2 text-sm text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="bg-brand-gold mt-1.5 size-1.5 shrink-0 rounded-full"
                    />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="border-border/60 mt-4 border-t pt-4">
                <p className="text-brand-brown text-xs font-semibold">
                  [REQUISITOS ADICIONALES ESPECÍFICOS DE LA INSTITUCIÓN ALIADA PENDIENTES DE
                  SUMINISTRAR]
                </p>
              </div>
            </div>

            {/* CAJA DE CONVERSIÓN RÁPIDA */}
            <div className="bg-brand-green-soft/50 border-brand-green/20 rounded-xl border p-6">
              <h3 className="text-brand-green-deep text-base font-semibold">
                ¿Te interesa estudiar este programa?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Postúlate hoy mediante el formulario de inscripción o comunícate directamente con un
                orientador de FUNASF vía WhatsApp.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button asChild variant="default" className="w-full">
                  <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                    Completar inscripción
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle aria-hidden className="mr-2 size-4" />
                    Preguntar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* BLOQUE RECUERDA: MARCO LEGAL INSTITUCIONAL */}
      <Section tone="deep">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <span className="text-brand-gold text-xs font-bold tracking-wider uppercase">
              Marco institucional y legal
            </span>
            <h2 className="text-primary-foreground mt-2 text-2xl font-bold">
              Recuerda: Modelo de formación con instituciones aliadas
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-sm leading-relaxed">
              {programa.avisoLegal}
            </p>
            <p className="text-primary-foreground/70 mt-3 text-xs italic">
              “FUNASF acompaña, gestiona y promueve oportunidades. Nuestras instituciones aliadas
              forman y certifican.”
            </p>
          </div>
          <div className="shrink-0">
            <Button asChild variant="gold" size="lg">
              <Link to="/estudia" hash="instituciones-aliadas">
                Conocer el modelo de alianzas
              </Link>
            </Button>
          </div>
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
