import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategorizedPrograms } from "@/services/api";
import { programasAcademicos, type ProgramaAcademico } from "@/data/programas";
import { cn } from "@/lib/utils";

export function ProgramCatalog({
  programas = programasAcademicos,
}: {
  programas?: ProgramaAcademico[] | undefined;
} = {}) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const categoriasDinamicas = useMemo(() => {
    return getCategorizedPrograms(programas);
  }, [programas]);

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es");
    return programas.filter(
      (programa) =>
        (categoria === "todas" || programa.categoriaId === categoria) &&
        (!termino ||
          programa.nombre.toLocaleLowerCase("es").includes(termino) ||
          programa.categoria.toLocaleLowerCase("es").includes(termino)),
    );
  }, [busqueda, categoria, programas]);

  return (
    <div>
      <div className="border-border bg-card grid gap-4 rounded-lg border p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="relative block">
          <span className="sr-only">Buscar un programa</span>
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Busca por nombre o área"
            className="h-11 bg-background pl-10"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-2xl" aria-label="Filtrar por área">
          <Button
            type="button"
            size="sm"
            variant={categoria === "todas" ? "default" : "outline"}
            onClick={() => setCategoria("todas")}
            className="shrink-0"
          >
            Todas
          </Button>
          {categoriasDinamicas.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={categoria === item.id ? "default" : "outline"}
              onClick={() => setCategoria(item.id)}
              className="shrink-0"
            >
              {item.categoria.replace("Área de ", "")}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground mt-6 text-sm" aria-live="polite">
        {resultados.length}{" "}
        {resultados.length === 1 ? "programa encontrado" : "programas encontrados"}
      </p>

      {resultados.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resultados.map((programa) => (
            <article
              key={programa.slug}
              className="border-border bg-card group flex min-h-64 flex-col rounded-lg border p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="bg-brand-green-soft text-brand-green-deep flex size-10 items-center justify-center rounded-md">
                <BookOpen aria-hidden className="size-5" />
              </span>
              <p className="text-brand-brown mt-5 text-xs font-bold uppercase">
                {programa.categoria}
              </p>
              <h2 className="text-foreground mt-2 text-xl leading-snug">{programa.nombre}</h2>
              <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
                {programa.descripcion}
              </p>
              <Link
                to="/programas/$slug"
                params={{ slug: programa.slug }}
                className={cn(
                  "text-primary mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold",
                  "hover:text-brand-green-deep",
                )}
              >
                Ver información
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-border bg-surface mt-5 rounded-lg border p-8 text-center">
          <h2 className="text-foreground text-xl">No encontramos coincidencias</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Prueba otro nombre o selecciona todas las áreas.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => {
              setBusqueda("");
              setCategoria("todas");
            }}
          >
            Limpiar búsqueda
          </Button>
        </div>
      )}
    </div>
  );
}
