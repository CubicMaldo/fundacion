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
import { ModalInscripcion } from "@/components/site/ModalInscripcion";

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
          <ModalInscripcion
            triggerButton={
              <Button variant="gold" size="lg">
                Formulario de inscripción
              </Button>
            }
          />
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
                    {cat.programas.map((p) => {
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
                          {matchProg ? (
                            <Link
                              to="/programas/$slug"
                              params={{ slug: matchProg.slug }}
                              className="font-medium text-foreground hover:text-brand-green transition-colors inline-flex items-center gap-1.5 group"
                            >
                              <span>{p}</span>
                              <ArrowRight
                                aria-hidden
                                className="size-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-green shrink-0"
                              />
                            </Link>
                          ) : (
                            <span>{p}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/programas">
              Ver catálogo completo con filtros y fichas técnicas
              <ArrowRight aria-hidden className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-6 text-center text-xs">
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
                className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/90 rounded-lg border p-4 text-sm transition-colors hover:bg-primary-foreground/10"
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
        <p className="text-muted-foreground mt-6 text-sm leading-relaxed max-w-3xl">
          Las instituciones educativas aliadas y los convenios específicos correspondientes a cada
          área se informan a cada estudiante durante el proceso de orientación y formalización de
          matrícula según el municipio y modalidad seleccionada.
        </p>
      </Section>

      <Section id="requisitos">
        <SectionHeading
          eyebrow="Requisitos"
          title="Antes de inscribirte"
          description="Los requisitos generales dependen de cada programa y de la convocatoria vigente de la institución aliada responsable."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-institucional">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">
              Criterio 1
            </span>
            <h3 className="font-semibold text-foreground text-sm mt-1">Identidad</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Documento de identidad vigente (cédula de ciudadanía, tarjeta de identidad o documento
              válido según corresponda).
            </p>
          </div>
          <div className="card-institucional">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">
              Criterio 2
            </span>
            <h3 className="font-semibold text-foreground text-sm mt-1">Escolaridad previa</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Certificado de noveno grado o diploma de bachiller, conforme al plan de estudios del
              programa y la institución responsable.
            </p>
          </div>
          <div className="card-institucional">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">
              Criterio 3
            </span>
            <h3 className="font-semibold text-foreground text-sm mt-1">Convocatoria</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Cumplimiento de las condiciones, fechas y disponibilidad de cupos establecidas en cada
              convocatoria de becas.
            </p>
          </div>
          <div className="card-institucional">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">
              Criterio 4
            </span>
            <h3 className="font-semibold text-foreground text-sm mt-1">Requisitos específicos</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Cada programa detalla sus requerimientos particulares (por ejemplo, esquema de
              vacunación en el área de salud).
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/programas">Consultar requisitos detallados en el catálogo</Link>
          </Button>
          <span className="text-xs text-muted-foreground">
            O comunícate a nuestras líneas de atención para recibir orientación personalizada.
          </span>
        </div>
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
          <ModalInscripcion
            triggerButton={
              <Button variant="default">
                Ir al formulario <ArrowRight aria-hidden className="size-4 ml-1.5" />
              </Button>
            }
          />
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
