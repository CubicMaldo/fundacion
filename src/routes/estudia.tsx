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
import { formacionAcademica, modeloAlianzas, faq } from "@/data/funasf";
import { getProgramasAcademicos, getSiteSettings, getCategorizedPrograms } from "@/services/api";
import { useSiteSettings } from "@/lib/site-settings-context";
import { createSeoMeta, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

export const Route = createFileRoute("/estudia")({
  head: () =>
    createSeoMeta({
      title: "Estudia con FUNASF Colombia | Becas de hasta 90 % — EduFUNASF",
      description:
        "Accede a programas de formación técnica y laboral en alianza: salud, administración, seguridad en el trabajo y validación de bachillerato. Convocatorias de becas de hasta el 90 % en Colombia.",
      canonicalPath: "/estudia",
      keywords:
        "estudiar con FUNASF, becas FUNASF Colombia, EduFUNASF, becas 90 por ciento, programas tecnicos Cali Atlantico, capacitacion laboral, validacion bachillerato",
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Estudia con FUNASF", path: "/estudia" },
        ]),
        getFaqSchema(),
      ],
    }),
  loader: async () => {
    const [programas, settings] = await Promise.all([getProgramasAcademicos(), getSiteSettings()]);
    return {
      programas,
      categoriasProgramas: getCategorizedPrograms(programas),
      becas: settings.becas,
      org: settings.org,
    };
  },
  component: Estudia,
});

function Estudia() {
  const loaderData = Route.useLoaderData();
  const { settings } = useSiteSettings();
  const org = settings?.org || loaderData.org;
  const becas = settings?.becas || loaderData.becas;
  const { programas, categoriasProgramas } = loaderData;

  return (
    <>
      <PageHero
        eyebrow="Estudia con FUNASF"
        title="Formación que abre oportunidades"
        description={formacionAcademica.parrafos[0]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg">
            <Link to="/inscripcion">Formulario de inscripción</Link>
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
        <div className="mt-12 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {categoriasProgramas.map((cat, i) => (
              <AccordionItem key={cat.id} value={`cat-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-lg font-medium text-brand-green-deep hover:text-brand-green hover:no-underline">
                  {cat.categoria}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="text-muted-foreground mt-2 space-y-3 p-2 text-base">
                    {cat.programas.map((p: string) => {
                      const matchProg = programas.find(
                        (pa) =>
                          pa.nombre.toLowerCase() === p.toLowerCase() ||
                          p.toLowerCase().includes(pa.nombre.toLowerCase()) ||
                          (p.toLowerCase().includes("bachillerato") &&
                            pa.slug === "validacion-del-bachillerato"),
                      );

                      return (
                        <li key={p} className="flex items-start gap-3">
                          <span
                            aria-hidden
                            className="bg-brand-gold mt-2 size-2 shrink-0 rounded-full"
                          />
                          <div className="flex-1">
                            {matchProg ? (
                              <Link
                                to="/programas/$slug"
                                params={{ slug: matchProg.slug }}
                                className="font-semibold text-foreground hover:text-brand-green flex items-center gap-1.5 transition-colors group"
                              >
                                <span>{matchProg.nombre}</span>
                                <ArrowRight className="size-3.5 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all text-brand-green" />
                              </Link>
                            ) : (
                              <span className="font-semibold text-foreground">{p}</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section id="matriculas" tone="surface">
        <SectionHeading
          eyebrow="Requisitos y matrícula"
          title="El camino hacia tu título técnico laboral"
          description={formacionAcademica.parrafos[2]}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-lg">Requisitos de ingreso</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Copia de documento de identidad, certificado de estudios (grado 9° o bachiller según el
              programa), 2 fotos 3x4 y diligenciamiento del formulario institucional de beca.
            </p>
          </div>
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-lg">Flexibilidad horaria</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Jornadas diurnas, nocturnas y sabatinas diseñadas para personas que trabajan o tienen
              responsabilidades familiares, con acompañamiento permanente de tutores.
            </p>
          </div>
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-lg">Doble certificación</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Formación técnica por competencias laborales certificada por institutos autorizados y
              diploma de participación comunitaria expedido por FUNASF.
            </p>
          </div>
        </div>
      </Section>

      <Section id="becas" tone="deep">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading invert eyebrow="Becas" title={becas.titulo} description={becas.intro} />
            <p className="text-primary-foreground/80 mt-5 leading-relaxed">{becas.proposito}</p>
            <p className="text-brand-gold mt-8 text-2xl font-semibold">{becas.porcentaje}</p>
            <p className="text-primary-foreground/60 mt-2 text-xs">{becas.aclaracion}</p>
          </div>
          <div className="bg-primary-foreground/5 rounded-2xl border border-white/10 p-8 backdrop-blur-xs">
            <h3 className="font-display text-xl font-semibold text-white">
              Beneficios del programa de apoyo
            </h3>
            <ul className="mt-6 space-y-4">
              {becas.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3 text-white/90">
                  <span className="bg-brand-gold mt-1.5 size-2 shrink-0 rounded-full" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="gold" className="w-full sm:w-auto">
                <Link to="/inscripcion">Solicitar beca de estudio</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section id="modelo">
        <SectionHeading
          eyebrow="Modelo institucional"
          title="Cómo funciona nuestra labor"
          description={modeloAlianzas.intro}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modeloAlianzas.objetivos.map((obj, i) => (
            <div
              key={obj}
              className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between"
            >
              <span className="text-brand-gold font-display text-2xl font-bold">
                0{i + 1}
              </span>
              <p className="text-foreground mt-4 font-semibold leading-snug">{obj}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="faq" tone="soft">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Resolvemos tus dudas sobre becas y estudio"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={item.pregunta} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-brand-green">
                  {item.pregunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}
