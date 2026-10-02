import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getArticuloBySlug, type ArticuloBlog } from "@/services/api";
import { createSeoMeta, getBreadcrumbSchema, getArticleSchema, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    return await getArticuloBySlug(params.slug);
  },
  head: ({ loaderData, params }) => {
    const articulo = loaderData as ArticuloBlog | null;
    if (!articulo) {
      return createSeoMeta({
        title: "Artículo no encontrado | Blog FUNASF",
        description: "El artículo solicitado no existe o ha sido despublicado.",
        canonicalPath: `/blog/${params.slug}`,
        noindex: true,
      });
    }

    return createSeoMeta({
      title: `${articulo.titulo} | Blog FUNASF`,
      description: articulo.resumen,
      canonicalPath: `/blog/${articulo.slug}`,
      ogType: "article",
      ogImage: articulo.imagenPortada || DEFAULT_OG_IMAGE,
      keywords: `${articulo.categoria}, noticias FUNASF, ${articulo.titulo}`,
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: articulo.titulo, path: `/blog/${articulo.slug}` },
        ]),
        getArticleSchema(articulo),
      ],
    });
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
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <span>{articulo.categoria}</span>
              <span aria-hidden="true" className="text-primary-foreground/40">
                ·
              </span>
              <span className="text-primary-foreground/85 flex items-center gap-1 font-normal normal-case">
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
                toast.success("Enlace copiado al portapapeles");
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
