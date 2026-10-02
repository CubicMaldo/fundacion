import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Newspaper, Search, User } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getArticulosPublicados, type ArticuloBlog } from "@/services/api";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () =>
    createSeoMeta({
      title: "Blog Institucional y Comunitario | FUNASF",
      description:
        "Noticias oficiales, convocatorias de becas técnicas, historias de impacto social y novedades educativas de la Fundación Internacional Amigos Sin Fronteras.",
      canonicalPath: "/blog",
      keywords: "blog FUNASF, noticias FUNASF, convocatorias becas, impacto social Colombia Panamá",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Blog institucional", path: "/blog" },
      ]),
    }),
  loader: async () => {
    return await getArticulosPublicados();
  },
  component: BlogPage,
});

function BlogPage() {
  const articulos = Route.useLoaderData();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const categorias = useMemo(() => {
    const set = new Set<string>();
    articulos.forEach((a) => {
      if (a.categoria) set.add(a.categoria);
    });
    return Array.from(set);
  }, [articulos]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return articulos.filter((a) => {
      const matchCat = categoria === "todas" || a.categoria === categoria;
      const matchText =
        !q ||
        a.titulo.toLowerCase().includes(q) ||
        a.resumen.toLowerCase().includes(q) ||
        a.categoria.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [articulos, busqueda, categoria]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Blog Institucional"
        title="Voces de nuestra comunidad"
        description="Noticias, convocatorias académicas, testimonios de becarios y proyectos de impacto social de FUNASF."
      />

      <Section>
        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div className="relative min-w-[260px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en el blog..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2" aria-label="Filtrar por categoría">
            <Button
              type="button"
              size="sm"
              variant={categoria === "todas" ? "default" : "outline"}
              onClick={() => setCategoria("todas")}
              className="text-xs"
            >
              Todas ({articulos.length})
            </Button>
            {categorias.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={categoria === cat ? "default" : "outline"}
                onClick={() => setCategoria(cat)}
                className="text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Listado de Artículos */}
        {filtrados.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Newspaper className="size-10 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-base font-medium text-foreground">No se encontraron artículos</p>
            <p className="text-sm mt-1">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((articulo) => (
              <article
                key={articulo.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-colors hover:border-brand-green/45"
              >
                {/* Imagen de Portada */}
                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                  {articulo.imagenPortada ? (
                    <picture>
                      <source
                        srcSet={articulo.imagenPortada.replace(/\.jpeg$/i, ".webp")}
                        type="image/webp"
                      />
                      <img
                        src={articulo.imagenPortada}
                        alt={articulo.titulo}
                        className="size-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    <div className="flex size-full items-center justify-center bg-brand-green/10 text-brand-green">
                      <Newspaper className="size-10 opacity-70" />
                    </div>
                  )}
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
                      {articulo.categoria && (
                        <>
                          <span className="font-semibold text-brand-brown text-[11px] uppercase tracking-wider">
                            {articulo.categoria}
                          </span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <time dateTime={articulo.fechaPublicacion}>
                        {formatDate(articulo.fechaPublicacion)}
                      </time>
                    </div>

                    <h2 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-brand-green transition-colors">
                      <Link to="/blog/$slug" params={{ slug: articulo.slug }}>
                        {articulo.titulo}
                      </Link>
                    </h2>

                    <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {articulo.resumen}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium truncate max-w-[160px]">
                      Por {articulo.autorNombre}
                    </span>

                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs font-semibold text-brand-green"
                    >
                      <Link to="/blog/$slug" params={{ slug: articulo.slug }}>
                        Leer artículo <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
