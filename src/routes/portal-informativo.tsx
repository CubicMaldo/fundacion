import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { Button } from "@/components/ui/button";
import {
  educacionSinFronteras,
  emprendimiento,
  programasSociales,
  voluntariado,
  alianzas,
  formacionAcademica,
} from "@/data/funasf";

export const Route = createFileRoute("/portal-informativo")({
  head: () => ({
    meta: [
      { title: "Portal informativo | FUNASF" },
      {
        name: "description",
        content:
          "Talleres, formación, emprendimiento, programas sociales, voluntariado y alianzas de la Fundación Internacional Amigos Sin Fronteras.",
      },
      { property: "og:title", content: "Portal informativo | FUNASF" },
      {
        property: "og:description",
        content: "Formación, emprendimiento, programas sociales, voluntariado y alianzas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortalInformativo,
});

function Lista({ items }: { items: readonly string[] }) {
  return (
    <ul className="text-muted-foreground mt-6 grid gap-2 text-sm sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full" />
          {i}
        </li>
      ))}
    </ul>
  );
}

function PortalInformativo() {
  return (
    <>
      <PageHero
        eyebrow="Portal informativo"
        title="Formación, oportunidades y acción comunitaria"
        description="Conoce las líneas de trabajo con las que FUNASF acerca la educación y las oportunidades a las comunidades."
      />

      <Section id="talleres">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Talleres"
              title="Educación sin fronteras"
              description={educacionSinFronteras.intro}
            />
            <Lista items={educacionSinFronteras.items} />
          </div>
          <div className="aspect-[4/3] w-full">
            <MediaPlaceholder label="[FOTOGRAFÍA TALLERES PENDIENTE]" />
          </div>
        </div>
      </Section>

      <Section id="formacion" tone="soft">
        <SectionHeading
          eyebrow="Formación"
          title={formacionAcademica.titulo}
          description={formacionAcademica.parrafos[0]}
        />
        <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
          {formacionAcademica.parrafos[1]}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {formacionAcademica.comoFunciona.map((c) => (
            <div key={c} className="card-institucional">
              <p className="text-muted-foreground text-sm leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
        <Button asChild className="mt-8" variant="outline">
          <Link to="/estudia" hash="programas">
            Ver programas académicos <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </Section>

      <Section id="emprendimiento">
        <SectionHeading
          eyebrow="Emprendimiento"
          title="De la idea al proyecto sostenible"
          description={emprendimiento.intro}
        />
        <Lista items={emprendimiento.items} />
        <p className="text-brand-brown mt-8 text-lg font-medium italic">{emprendimiento.cierre}</p>
      </Section>

      <Section id="programas-sociales" tone="surface">
        <SectionHeading eyebrow="Programas sociales" title="Nuestras líneas de acción" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programasSociales.map((p) => (
            <article key={p.nombre} className="card-institucional">
              <h3 className="text-brand-green-deep text-lg">{p.nombre}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{p.texto}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="voluntariado" tone="deep">
        <SectionHeading
          invert
          eyebrow="Voluntariado"
          title={voluntariado.titulo}
          description={voluntariado.intro}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-brand-gold text-sm font-bold tracking-[0.14em] uppercase">
              Puedes aportar
            </h3>
            <ul className="text-primary-foreground/85 mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {voluntariado.aportes.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-brand-gold text-sm font-bold tracking-[0.14em] uppercase">
              Áreas de voluntariado
            </h3>
            <ul className="text-primary-foreground/85 mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {voluntariado.areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-brand-gold mt-10 text-xl font-medium italic">{voluntariado.destacado}</p>
        <Button asChild className="mt-8" variant="gold">
          <Link to="/contacto">Quiero ser voluntario</Link>
        </Button>
      </Section>

      <Section id="alianzas">
        <SectionHeading
          eyebrow="Alianzas"
          title="Construimos juntos"
          description={alianzas.intro}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          {alianzas.tipos.map((t) => (
            <span
              key={t}
              className="border-border bg-card text-foreground rounded-full border px-4 py-2 text-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="surface-soft mt-12 rounded-2xl p-8">
          <h3 className="text-foreground text-2xl">{alianzas.cta}</h3>
          <p className="text-muted-foreground mt-3">{alianzas.ctaTexto}</p>
          <Button asChild className="mt-6">
            <Link to="/contacto">
              Hablemos <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
