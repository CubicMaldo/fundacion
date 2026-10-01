import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProgramCatalog } from "@/components/site/ProgramCatalog";
import { Button } from "@/components/ui/button";
import { becas, formacionAcademica } from "@/data/funasf";
import { getProgramasAcademicos } from "@/services/api";

export const Route = createFileRoute("/programas/")({
  head: () => ({
    meta: [
      { title: "Programas Académicos | FUNASF — Fundación Internacional Amigos Sin Fronteras" },
      {
        name: "description",
        content:
          "Explora la oferta académica de FUNASF: programas en salud, seguridad y salud en el trabajo, administración, educación y áreas técnicas con becas de hasta el 90 %.",
      },
      { property: "og:title", content: "Programas Académicos | FUNASF" },
      {
        property: "og:description",
        content:
          "Explora los programas de formación por áreas con apoyo de instituciones educativas aliadas y becas solidarias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    return await getProgramasAcademicos();
  },
  component: ProgramasIndexComponent,
});

function ProgramasIndexComponent() {
  const programas = Route.useLoaderData();
  return (
    <div className="flex flex-col">
      <PageHero
        eyebrow="Oferta Académica FUNASF"
        title="Programas de formación por áreas"
        description="A través de alianzas con instituciones educativas aliadas, acercamos oportunidades de educación técnica, laboral y complementaria con opciones de becas solidarias de hasta el 90 %."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="gold">
            <Link to="/estudia" hash="becas">
              Conocer las becas <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outlineInvert">
            <Link to="/contacto">Solicitar orientación</Link>
          </Button>
        </div>
      </PageHero>

      {/* Franja de garantías y convenios */}
      <section className="border-border bg-brand-green-soft/40 border-b py-5">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium text-brand-green-deep">
            <ShieldCheck className="size-4 text-brand-green shrink-0" />
            <span>Certificación expedida por instituciones educativas aliadas</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-brand-brown">
            <Award className="size-4 text-brand-gold shrink-0" />
            <span>Becas de hasta el 90 % según convocatoria</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-foreground/80">
            <CheckCircle2 className="size-4 text-brand-green shrink-0" />
            <span>Modalidades presencial y virtual según el programa</span>
          </div>
        </div>
      </section>

      {/* Catálogo de programas con buscador y filtros */}
      <main className="container-page py-12 md:py-16">
        <div className="mb-10 max-w-3xl">
          <span className="text-brand-brown text-xs font-bold tracking-[0.16em] uppercase">
            Catálogo navegable
          </span>
          <h2 className="text-foreground mt-2 text-2xl font-semibold sm:text-3xl">
            Encuentra el programa ideal para tu proyecto de vida
          </h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Filtra por área de conocimiento o busca directamente por nombre para conocer el perfil,
            modalidad, requisitos y proceso de inscripción.
          </p>
        </div>

        <ProgramCatalog programas={programas} />

        {/* Bloque explicativo de cómo funciona la alianza educativa */}
        <section className="mt-16 rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-brand-green-deep text-xs font-bold tracking-[0.16em] uppercase">
                Transparencia institucional
              </span>
              <h3 className="text-foreground mt-3 text-xl font-bold sm:text-2xl">
                {formacionAcademica.titulo}
              </h3>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm leading-relaxed">
                {formacionAcademica.parrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 bg-surface p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-brown">
                ¿Cómo funciona el proceso?
              </h4>
              <ul className="space-y-3 text-sm text-foreground/80">
                {formacionAcademica.comoFunciona.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-xs font-bold text-brand-green-deep">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Llamado a la acción: Becas */}
        <section className="mt-16 rounded-2xl bg-brand-green-deep p-8 md:p-12 text-primary-foreground text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block rounded-full bg-brand-gold/20 px-4 py-1 text-xs font-semibold text-brand-gold uppercase tracking-wider">
              {becas.porcentaje}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold">{becas.titulo}</h3>
            <p className="text-primary-foreground/80 text-sm md:text-base leading-relaxed">
              {becas.intro} {becas.aclaracion}
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="gold">
                <Link to="/estudia" hash="becas">
                  Ver requisitos de beca
                </Link>
              </Button>
              <Button asChild size="lg" variant="outlineInvert">
                <Link to="/portal-estudiantil">
                  <GraduationCap className="size-4 mr-2" />
                  Ir al Portal Estudiantil
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
