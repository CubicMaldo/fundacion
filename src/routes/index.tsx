import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Leaf,
  Sprout,
  Stethoscope,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  org,
  quienesSomos,
  proposito,
  becas,
  categoriasProgramas,
  programasSociales,
  alcance,
  faq,
  llamadoAccion,
  valores,
} from "@/data/funasf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUNASF — Porque la educación no tiene fronteras" },
      {
        name: "description",
        content:
          "Fundación Internacional Amigos Sin Fronteras. Programas de formación técnica, becas de hasta el 90 %, emprendimiento, salud y acción comunitaria.",
      },
      { property: "og:title", content: "FUNASF — Porque la educación no tiene fronteras" },
      {
        property: "og:description",
        content:
          "Formación técnica, becas de hasta el 90 %, emprendimiento y programas sociales para las comunidades.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inicio,
});

const iconos: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  HandHeart,
  BookOpen,
  Stethoscope,
  Leaf,
  Store,
  Briefcase,
};

function Inicio() {
  return (
    <>
      {/* HERO */}
      <section className="surface-hero relative overflow-hidden">
        <div
          aria-hidden
          className="bg-brand-gold/15 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
        />
        <div className="container-page relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="fade-up">
            <span className="text-brand-gold text-xs font-bold tracking-[0.18em] uppercase">
              Fundación Internacional Amigos Sin Fronteras
            </span>
            <h1 className="text-primary-foreground mt-5 text-4xl leading-[1.08] md:text-6xl">
              Porque la educación
              <br />
              no tiene fronteras.
            </h1>
            <p className="text-primary-foreground/85 text-balance-pretty mt-6 max-w-xl text-lg leading-relaxed">
              {quienesSomos.intro}
            </p>
            <p className="text-primary-foreground/70 mt-4 text-sm italic">{org.frases[0]}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link to="/estudia" hash="programas">
                  Quiero estudiar <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outlineInvert">
                <Link to="/estudia" hash="becas">
                  Conocer las becas
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghostInvert">
                <Link to="/portal-informativo" hash="voluntariado">
                  Ser voluntario
                </Link>
              </Button>
            </div>
          </div>

          <div className="fade-up aspect-[4/3] w-full">
            <MediaPlaceholder tone="dark" label="[FOTOGRAFÍA PRINCIPAL PENDIENTE]" />
          </div>
        </div>

        <div className="border-primary-foreground/15 border-t">
          <div className="container-page text-primary-foreground/85 grid gap-6 py-8 sm:grid-cols-3">
            <p className="text-sm">
              <strong className="text-brand-gold block text-2xl">Hasta 90 %</strong>
              en becas, según convocatoria
            </p>
            <p className="text-sm">
              <strong className="text-brand-gold block text-2xl">Presencial y virtual</strong>
              según disponibilidad de cada programa
            </p>
            <p className="text-sm">
              <strong className="text-brand-gold block text-2xl">Panamá y Colombia</strong>
              origen y territorio de nuestra labor
            </p>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <Section id="quienes-somos">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Quiénes somos"
              title="Una oportunidad puede cambiar una vida"
            />
            <div className="text-muted-foreground mt-6 space-y-4 leading-relaxed">
              {quienesSomos.parrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{quienesSomos.compromiso}</p>
            </div>
            <p className="border-brand-green text-foreground mt-8 border-l-4 pl-5 text-lg font-medium italic">
              {quienesSomos.destacado}
            </p>
            <Button asChild className="mt-8" variant="default">
              <Link to="/quienes-somos">
                Conocer la Fundación <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="aspect-[4/5] w-full">
            <MediaPlaceholder label="[FOTOGRAFÍA COMUNIDAD PENDIENTE]" />
          </div>
        </div>
      </Section>

      {/* PROPÓSITO */}
      <Section tone="soft">
        <SectionHeading
          eyebrow="Nuestro propósito"
          title={proposito.titulo}
          description={proposito.intro}
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proposito.ejes.map((eje) => {
            const Icono = iconos[eje.icono] ?? GraduationCap;
            return (
              <article key={eje.nombre} className="card-institucional">
                <span className="bg-brand-green-soft text-brand-green-deep flex size-11 items-center justify-center rounded-lg">
                  <Icono aria-hidden className="size-5" />
                </span>
                <h3 className="text-foreground mt-5 text-xl">{eje.nombre}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{eje.texto}</p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* PROGRAMAS */}
      <Section id="programas">
        <SectionHeading
          eyebrow="Estudia con FUNASF"
          title="Programas de formación por áreas"
          description="Programas desarrollados con instituciones educativas aliadas responsables de la formación, la certificación y la expedición de títulos."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoriasProgramas.map((cat) => (
            <article key={cat.id} className="card-institucional">
              <h3 className="text-brand-green-deep text-lg">{cat.categoria}</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                {cat.programas.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span
                      aria-hidden
                      className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/estudia" hash="programas">
              Ver toda la oferta <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* BECAS */}
      <Section tone="deep">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading invert eyebrow="Becas" title={becas.titulo} description={becas.intro} />
            <p className="text-primary-foreground/80 mt-5 leading-relaxed">{becas.proposito}</p>
            <p className="text-brand-gold mt-8 text-2xl font-semibold">{becas.destacado}</p>
            <Button asChild className="mt-8" variant="gold">
              <Link to="/estudia" hash="becas">
                Conocer las convocatorias <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {becas.beneficios.map((b) => (
              <li
                key={b}
                className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/90 rounded-xl border p-4 text-sm"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-primary-foreground/60 mt-10 text-xs">{becas.aclaracion}</p>
      </Section>

      {/* PROGRAMAS SOCIALES */}
      <Section tone="soft">
        <SectionHeading
          eyebrow="Programas sociales"
          title="Líneas de acción de la Fundación"
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programasSociales.map((p) => {
            const Icono = iconos[p.icono] ?? HandHeart;
            return (
              <article key={p.nombre} className="card-institucional">
                <span className="bg-brand-brown-soft text-brand-brown flex size-11 items-center justify-center rounded-lg">
                  <Icono aria-hidden className="size-5" />
                </span>
                <h3 className="text-foreground mt-5 text-lg">{p.nombre}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.texto}</p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ALCANCE */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Nuestro alcance"
              title="Presencia territorial"
              description={alcance.intro}
            />
            <p className="text-brand-brown mt-8 text-xl font-medium italic">{alcance.destacado}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card-institucional">
              <h3 className="text-brand-green-deep text-base">Presencia actual</h3>
              <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                {alcance.presencia.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="card-institucional">
              <h3 className="text-brand-green-deep text-base">Proyección</h3>
              <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                {alcance.proyeccion.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* VALORES */}
      <Section tone="surface">
        <SectionHeading eyebrow="Nuestros valores" title="Lo que nos sostiene" align="center" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v) => (
            <div key={v.nombre} className="border-border bg-card rounded-xl border p-5">
              <h3 className="text-brand-green-deep text-base">{v.nombre}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resuelve tus dudas" />
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={f.pregunta} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base">{f.pregunta}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section tone="deep">
        <SectionHeading
          invert
          align="center"
          eyebrow="Da el primer paso"
          title={llamadoAccion.titulo}
          description={llamadoAccion.subtitulo}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {llamadoAccion.bloques.map((b) => (
            <div
              key={b.titulo}
              className="border-primary-foreground/20 bg-primary-foreground/5 rounded-xl border p-5"
            >
              <h3 className="text-brand-gold text-base">{b.titulo}</h3>
              <p className="text-primary-foreground/80 mt-2 text-sm leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="gold">
            <Link to="/contacto">Contáctanos</Link>
          </Button>
          <Button asChild size="lg" variant="outlineInvert">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Formulario de inscripción
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
