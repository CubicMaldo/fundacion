import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getArticuloBySlug, type ArticuloBlog } from "@/services/api";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    return await getArticuloBySlug(params.slug);
  },
  head: ({ loaderData, params }) => {
    const articulo = loaderData as ArticuloBlog | null;
    const title = articulo ? `${articulo.titulo} | Blog FUNASF` : "Artículo | FUNASF";
    const description = articulo?.resumen ?? "Artículo de la Fundación Internacional Amigos Sin Fronteras.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ArticuloDetailPage,
});

function ArticuloDetailPage() {
  const articulo = Route.useLoaderData() as ArticuloBlog | null;

  if (!articulo) {
    return (
      <div className="container-page py-24 text-center">
        <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-bold text-foreground">Artículo no encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            El contenido que buscas no existe o ha sido despublicado.
          </p>
          <Button asChild className="mt-6">
            <Link to="/blog">
              <ArrowLeft className="size-4 mr-2" />
              Volver al blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  return (
    <article className="min-h-screen pb-20">
      {/* Cabecera del Artículo */}
      <header className="border-b border-border bg-brand-green-deep text-primary-foreground py-12 md:py-16">
        <div className="container-page max-w-4xl">
          {/* Miga de pan */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-primary-foreground/75">
            <Link to="/" className="hover:text-brand-gold transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-brand-gold transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-primary-foreground font-semibold truncate max-w-xs sm:max-w-none">
              {articulo.categoria}
            </span>
          </nav>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-gold text-brand-green-deep font-bold text-xs uppercase tracking-wider">
                {articulo.categoria}
              </Badge>
              <span className="text-xs text-primary-foreground/80 flex items-center gap-1">
                <Calendar className="size-3" /> {formatDate(articulo.fechaPublicacion)}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {articulo.titulo}
            </h1>

            <p className="text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
              {articulo.resumen}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white font-semibold text-xs">
                {articulo.autorNombre[0]}
              </div>
              <span className="text-xs text-primary-foreground/90 font-medium">
                Por {articulo.autorNombre}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Imagen Destacada */}
      {articulo.imagenPortada && (
        <div className="container-page max-w-4xl -mt-6 sm:-mt-10">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg aspect-21/9 bg-muted">
            <img
              src={articulo.imagenPortada}
              alt={articulo.titulo}
              className="size-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Cuerpo del Artículo */}
      <div className="container-page max-w-3xl mt-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {articulo.contenido.split("\n\n").map((parrafo, idx) => (
            <p key={idx} className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-6">
              {parrafo}
            </p>
          ))}
        </div>

        {/* Botones inferiores */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <Button asChild variant="outline">
            <Link to="/blog">
              <ArrowLeft className="size-4 mr-2" /> Volver a todas las noticias
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: articulo.titulo,
                  text: articulo.resumen,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Enlace copiado al portapapeles");
              }
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="size-4 mr-1.5" /> Compartir artículo
          </Button>
        </div>
      </div>
    </article>
  );
}
