import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ArticuloBlog } from "@/services/api";

interface BlogSectionProps {
  articulos: ArticuloBlog[];
}

export function BlogSection({ articulos }: BlogSectionProps) {
  if (!articulos || articulos.length === 0) {
    return null;
  }

  const postsToShow = articulos.slice(0, 3);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Section id="blog" tone="soft">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeading
          eyebrow="Actualidad y Comunidad"
          title="Últimas novedades y publicaciones"
          description="Entérate de nuestras convocatorias académicas, historias de superación y las actividades de impacto de la Fundación en los territorios."
        />
        <Button asChild variant="outline" className="hidden md:inline-flex shrink-0">
          <Link to="/blog">
            Ver todas las publicaciones <ArrowRight aria-hidden className="size-4 ml-1.5" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {postsToShow.map((articulo) => (
          <article
            key={articulo.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-colors hover:border-brand-green/45"
          >
            {/* Imagen de Portada */}
            <div className="relative aspect-16/10 overflow-hidden bg-muted">
              {articulo.imagenPortada ? (
                <img
                  src={articulo.imagenPortada}
                  alt={articulo.titulo}
                  className="size-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-brand-green/10 text-brand-green">
                  <Newspaper className="size-10 opacity-70" />
                </div>
              )}
            </div>

            {/* Contenido de la Tarjeta */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
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

                <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
                  <Link to="/blog/$slug" params={{ slug: articulo.slug }}>
                    {articulo.titulo}
                  </Link>
                </h3>

                <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {articulo.resumen}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[150px]">
                  Por {articulo.autorNombre || "FUNASF"}
                </span>

                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs font-semibold text-brand-green"
                >
                  <Link to="/blog/$slug" params={{ slug: articulo.slug }}>
                    Leer más <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-center md:hidden">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/blog">
            Ver todas las publicaciones <ArrowRight aria-hidden className="size-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
