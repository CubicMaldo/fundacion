import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategorizedPrograms } from "@/services/api";
import { programasAcademicos, type ProgramaAcademico } from "@/data/programas";
import { cn } from "@/lib/utils";

function formatCategoryTag(categoria: string, id: string): string {
  if (id === "salud" || categoria.trim().toLowerCase() === "área de salud") {
    return "Salud";
  }
  const clean = categoria.replace(/^Área de\s+/i, "").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function resolveProgramImageUrl(programa: ProgramaAcademico): string {
  if (programa.imagenUrl && programa.imagenUrl.trim() !== "") {
    return programa.imagenUrl;
  }
  const match = programasAcademicos.find(
    (p) =>
      p.slug === programa.slug ||
      p.nombre.toLowerCase().trim() === programa.nombre.toLowerCase().trim(),
  );
  if (match?.imagenUrl) {
    return match.imagenUrl;
  }
  switch (programa.categoriaId) {
    case "salud":
      return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=640&q=80";
    case "sst":
      return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=640&q=80";
    case "administracion":
      return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80";
    case "educacion-social":
      return "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=640&q=80";
    case "basica":
      return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=640&q=80";
    default:
      return "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=640&q=80";
  }
}

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

  const categoriaActivaNombre = useMemo(() => {
    if (categoria === "todas") return null;
    const cat = categoriasDinamicas.find((c) => c.id === categoria);
    return cat ? formatCategoryTag(cat.categoria, cat.id) : null;
  }, [categoria, categoriasDinamicas]);

  return (
    <div className="space-y-6">
      {/* Contenedor de búsqueda y filtros organizados */}
      <div className="border-border bg-card rounded-xl border p-4 sm:p-5 shadow-xs space-y-4">
        {/* Barra de búsqueda accesible */}
        <div className="relative">
          <label htmlFor="buscador-programas" className="sr-only">
            Buscar programa académico
          </label>
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
          <Input
            id="buscador-programas"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Busca por nombre del programa o palabra clave (ej. Enfermería, Contable, Farmacia...)"
            className="h-11 bg-background pl-10 pr-10 text-sm"
          />
          {busqueda ? (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              aria-label="Borrar término de búsqueda"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Fila de tags de categorías organizadas con salto natural */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filtrar por área de formación:
            </span>
            {(categoria !== "todas" || busqueda) && (
              <button
                type="button"
                onClick={() => {
                  setCategoria("todas");
                  setBusqueda("");
                }}
                className="text-xs text-brand-green font-medium hover:underline"
              >
                Restablecer filtros
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap gap-2 items-center"
            role="toolbar"
            aria-label="Filtrar programas por área temática"
          >
            <Button
              type="button"
              size="sm"
              variant={categoria === "todas" ? "default" : "outline"}
              onClick={() => setCategoria("todas")}
              className="h-8 px-3 text-xs font-medium rounded-lg transition-colors"
            >
              Todas las áreas ({programas.length})
            </Button>
            {categoriasDinamicas.map((item) => {
              const label = formatCategoryTag(item.categoria, item.id);
              const isActive = categoria === item.id;
              const count = item.programas.length;
              return (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setCategoria(item.id)}
                  className="h-8 px-3 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{label}</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen del conteo de resultados */}
      <div
        className="flex items-center justify-between text-sm text-muted-foreground"
        aria-live="polite"
      >
        <p>
          <span className="font-semibold text-foreground">{resultados.length}</span>{" "}
          {resultados.length === 1 ? "programa disponible" : "programas disponibles"}
          {categoriaActivaNombre && (
            <span>
              {" "}
              en el área de <strong className="text-foreground">{categoriaActivaNombre}</strong>
            </span>
          )}
          {busqueda && (
            <span>
              {" "}
              para &ldquo;<span className="text-foreground italic">{busqueda}</span>&rdquo;
            </span>
          )}
        </p>
      </div>

      {/* Cuadrícula de programas */}
      {resultados.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resultados.map((programa) => (
            <article
              key={programa.slug}
              className="border-border bg-card group flex flex-col overflow-hidden rounded-xl border shadow-xs transition-colors hover:border-brand-green/45"
            >
              {/* Espacio para imagen del programa (como en la maqueta de referencia) */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-brand-sand/40">
                <img
                  src={resolveProgramImageUrl(programa)}
                  alt={`Formación técnica: ${programa.nombre}`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="bg-brand-green-soft text-brand-green-deep flex size-10 items-center justify-center rounded-md">
                    <BookOpen aria-hidden className="size-5" />
                  </span>
                  <span className="text-brand-brown text-[11px] font-bold uppercase tracking-wider">
                    {programa.categoriaId === "salud" ? "Salud" : programa.categoria}
                  </span>
                </div>

                <h3 className="text-foreground mt-4 text-xl font-bold font-display leading-snug">
                  {programa.nombre}
                </h3>
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
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-border bg-surface rounded-xl border p-8 text-center">
          <h3 className="text-foreground text-xl font-bold font-display">
            No encontramos coincidencias
          </h3>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            No se encontraron programas con ese criterio de búsqueda. Prueba con otro término o
            selecciona todas las áreas.
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
            Limpiar filtros y ver todos
          </Button>
        </div>
      )}
    </div>
  );
}
