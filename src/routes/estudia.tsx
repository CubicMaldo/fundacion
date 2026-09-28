import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  categoriasProgramas,
  formacionAcademica,
  becas,
  modeloAlianzas,
  faq,
  org,
} from "@/data/funasf";
import { getSlugPorNombre } from "@/data/programas";

export const Route = createFileRoute("/estudia")({
  head: () => ({
    meta: [
      { title: "Estudia con FUNASF — Programas y becas" },
      {
        name: "description",
        content:
          "Programas técnicos en salud, administración, educación y otras áreas, con becas de hasta el 90 % según convocatoria, a través de instituciones aliadas.",
      },
      { property: "og:title", content: "Estudia con FUNASF — Programas y becas" },
      {
        property: "og:description",
        content: "Formación técnica y becas de hasta el 90 %, según convocatoria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Estudia,
});

function Estudia() {
  return (
    <>
      <PageHero
        eyebrow="Estudia con FUNASF"
        title="Formación que abre oportunidades"
        description={formacionAcademica.parrafos[0]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Formulario de inscripción
            </a>
          </Button>
          <Button asChild variant="outlineInvert" size="lg">
            <Link to="/contacto">Solicitar información</Link>
          </Button>
        </div>
      </PageHero>

      <Section id="programas">
        <SectionHeading
          eyebrow="Programas académicos"
          title="Oferta de formación por áreas"
          description={formacionAcademica.parrafos[1]}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoriasProgramas.map((cat) => (
            <article key={cat.id} className="card-institucional flex flex-col justify-between">
              <div>
                <h3 className="text-brand-green-deep text-lg font-bold">{cat.categoria}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
                  {cat.programas.map((p) => {
                    const slug = getSlugPorNombre(p);
                    return (
                      <li key={p} className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full"
                        />
                        <Link
                          to="/programas/$slug"
                          params={{ slug }}
                          className="hover:text-brand-green font-medium text-foreground/90 transition-colors hover:underline"
                        >
                          {p}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-brand-green/20 bg-brand-green-soft/30 p-6">
          <div>
            <h4 className="text-brand-green-deep text-base font-bold">
              ¿Quieres consultar fichas individuales o buscar por palabra clave?
            </h4>
            <p className="text-muted-foreground mt-1 text-sm">
              Visita el catálogo interactivo para filtrar los 19 programas oficiales y acceder a los
              requisitos de cada uno.
            </p>
          </div>
          <Button asChild variant="default" className="shrink-0">
            <Link to="/programas">
              Ver catálogo con buscador <ArrowRight aria-hidden className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground mt-8 text-sm">
          La duración, la modalidad y las condiciones de cada programa dependen de la institución
          aliada responsable y de la convocatoria vigente.
        </p>
      </Section>

      <Section id="becas" tone="deep">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading invert eyebrow="Becas" title={becas.titulo} description={becas.intro} />
            <p className="text-primary-foreground/80 mt-5 leading-relaxed">{becas.proposito}</p>
            <p className="text-brand-gold mt-8 text-2xl font-semibold">{becas.porcentaje}</p>
            <p className="text-primary-foreground/60 mt-2 text-xs">{becas.aclaracion}</p>
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
        <p className="text-brand-gold mt-12 text-xl font-medium italic">{becas.destacado}</p>
      </Section>

      <Section id="instituciones-aliadas" tone="soft">
        <SectionHeading
          eyebrow="Instituciones aliadas"
          title="Cómo funciona nuestro modelo"
          description={modeloAlianzas.intro}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Objetivos de las alianzas</h3>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              {modeloAlianzas.objetivos.map((o) => (
                <li key={o} className="flex gap-2">
                  <span aria-hidden className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Responsabilidades académicas</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {modeloAlianzas.responsabilidades.intro}
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              {modeloAlianzas.responsabilidades.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden
                    className="bg-brand-brown mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  {i}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4 text-xs">
              {modeloAlianzas.responsabilidades.nota}
            </p>
          </div>
        </div>
        <p className="border-brand-green text-foreground mt-10 border-l-4 pl-5 text-lg font-medium italic">
          {modeloAlianzas.responsabilidades.destacado}
        </p>
        <p className="text-muted-foreground mt-6 text-sm">
          El listado de instituciones aliadas será publicado cuando FUNASF lo suministre.{" "}
          <span className="text-brand-brown font-semibold">
            [LISTADO DE INSTITUCIONES ALIADAS PENDIENTE]
          </span>
        </p>
      </Section>

      <Section id="requisitos">
        <SectionHeading
          eyebrow="Requisitos"
          title="Antes de inscribirte"
          description="Los requisitos dependen de cada programa y de la convocatoria vigente de la institución aliada responsable."
        />
        <p className="text-brand-brown mt-6 font-semibold">
          [REQUISITOS ESPECÍFICOS POR PROGRAMA PENDIENTES DE SUMINISTRAR]
        </p>
        <p className="text-muted-foreground mt-4 max-w-3xl text-sm leading-relaxed">
          Si deseas conocer los requisitos de un programa en particular, escríbenos y te orientamos
          durante todo el proceso.
        </p>
      </Section>

      <Section id="matriculas" tone="surface">
        <SectionHeading
          eyebrow="Matrículas"
          title="Proceso de inscripción"
          description="En las convocatorias que así lo establezcan, no se cobra matrícula ni inscripción."
        />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Diligencia el formulario de inscripción o contáctanos por nuestros canales.",
            "Recibe orientación sobre el programa, la modalidad y los requisitos vigentes.",
            "Formaliza tu proceso con la institución aliada responsable del programa.",
          ].map((paso, i) => (
            <li key={paso} className="card-institucional">
              <span className="bg-brand-green text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{paso}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="default">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Ir al formulario <ArrowRight aria-hidden className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contacto">Hablar con la Fundación</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Sobre estudiar con FUNASF" />
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
    </>
  );
}
