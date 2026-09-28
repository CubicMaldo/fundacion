import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, MessageCircle, Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  areasAcademicas,
  getWhatsappProgramaUrl,
  programasFunasf,
  type AreaId,
} from "@/data/programas";
import { formacionAcademica, org } from "@/data/funasf";

export const Route = createFileRoute("/programas/")({
  head: () => ({
    meta: [
      { title: "Catálogo de Programas Académicos | FUNASF" },
      {
        name: "description",
        content:
          "Explora los 19 programas de formación técnica y educación básica de FUNASF con becas de hasta el 90 % en convenio con instituciones aliadas.",
      },
      { property: "og:title", content: "Catálogo de Programas Académicos | FUNASF" },
      {
        property: "og:description",
        content: "Formación técnica por áreas con becas de hasta el 90 %.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogoProgramas,
});

function CatalogoProgramas() {
  const [busqueda, setBusqueda] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState<AreaId | "todas">("todas");

  const programasFiltrados = programasFunasf.filter((p) => {
    const coincideArea = areaSeleccionada === "todas" ? true : p.areaId === areaSeleccionada;
    const coincideTexto =
      busqueda.trim() === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.areaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.resumen.toLowerCase().includes(busqueda.toLowerCase());
    return coincideArea && coincideTexto;
  });

  return (
    <>
      <PageHero
        eyebrow="Oferta académica oficial"
        title="Catálogo de programas de formación"
        description={formacionAcademica.parrafos[0]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Formulario de inscripción
            </a>
          </Button>
          <Button asChild variant="outlineInvert" size="lg">
            <Link to="/estudia" hash="becas">
              Conocer las becas (hasta 90 %)
            </Link>
          </Button>
        </div>
      </PageHero>

      <Section tone="surface">
        <div className="mx-auto max-w-4xl">
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative">
            <Search
              aria-hidden="true"
              className="text-muted-foreground absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
            />
            <Input
              type="search"
              placeholder="Buscar programa por nombre (ej. Enfermería, Administración, Electricidad...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-card pl-11 text-base h-12 rounded-xl"
            />
          </div>

          {/* FILTRO POR ÁREAS */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAreaSeleccionada("todas")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                areaSeleccionada === "todas"
                  ? "bg-brand-green text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todas las áreas ({programasFunasf.length})
            </button>
            {areasAcademicas.map((area) => {
              const count = programasFunasf.filter((p) => p.areaId === area.id).length;
              const activo = areaSeleccionada === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setAreaSeleccionada(area.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    activo
                      ? "bg-brand-green text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {area.nombre} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* LISTADO DE PROGRAMAS */}
        <div className="mt-12">
          {programasFiltrados.length === 0 ? (
            <div className="border-border bg-card rounded-2xl border p-12 text-center">
              <BookOpen aria-hidden="true" className="text-muted-foreground mx-auto size-10" />
              <h3 className="text-foreground mt-4 text-xl font-bold">
                No se encontraron programas
              </h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
                No encontramos ningún programa que coincida con tu búsqueda. Intenta con otro
                término o selecciona &ldquo;Todas las áreas&rdquo;.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setBusqueda("");
                  setAreaSeleccionada("todas");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programasFiltrados.map((programa) => {
                const whatsappUrl = getWhatsappProgramaUrl(programa.nombre);
                return (
                  <article
                    key={programa.slug}
                    className="card-institucional flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-brand-brown text-xs font-semibold uppercase">
                          {programa.areaNombre}
                        </span>
                        <span className="bg-brand-gold/15 text-brand-brown rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                          Hasta 90 % beca
                        </span>
                      </div>

                      <h3 className="text-brand-green-deep mt-3 text-xl font-bold">
                        {programa.nombre}
                      </h3>

                      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                        {programa.resumen}
                      </p>

                      <div className="border-border/60 mt-4 border-t pt-3 text-xs text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Modalidad:</strong>{" "}
                          {programa.modalidad}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 border-t pt-4">
                      <Button asChild variant="default" className="w-full">
                        <Link to="/programas/$slug" params={{ slug: programa.slug }}>
                          Ver ficha del programa{" "}
                          <ArrowRight aria-hidden className="ml-1.5 size-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={whatsappUrl} target="_blank" rel="noreferrer">
                          <MessageCircle aria-hidden className="mr-1.5 size-4" />
                          Consultar por WhatsApp
                        </a>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* BLOQUE INSTITUCIONAL DE ALIANZAS */}
      <Section tone="soft">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Transparencia académica"
              title="¿Quién entrega los títulos y certificados?"
              description="FUNASF conecta oportunidades comunitarias con instituciones educativas acreditadas."
            />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              La formación académica, los docentes, los planes de estudio y la expedición de títulos
              técnicos y certificados corresponden a la institución educativa aliada responsable de
              cada programa, de acuerdo con su naturaleza, autorización y condiciones académicas.
            </p>
          </div>
          <div className="border-brand-green-deep/15 bg-card rounded-2xl border p-6 shadow-xs">
            <h4 className="text-brand-green-deep font-semibold">
              Beneficios al estudiar con FUNASF:
            </h4>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="bg-brand-gold mt-1.5 size-1.5 shrink-0 rounded-full" />
                Becas de hasta el 90 % según disponibilidad en convocatoria.
              </li>
              <li className="flex gap-2">
                <span className="bg-brand-gold mt-1.5 size-1.5 shrink-0 rounded-full" />
                En convocatorias que así lo establezcan, sin cobro de matrícula.
              </li>
              <li className="flex gap-2">
                <span className="bg-brand-gold mt-1.5 size-1.5 shrink-0 rounded-full" />
                Acompañamiento, orientación y vocación comunitaria permanente.
              </li>
              <li className="flex gap-2">
                <span className="bg-brand-gold mt-1.5 size-1.5 shrink-0 rounded-full" />
                Modalidades virtuales y presenciales según el programa.
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
