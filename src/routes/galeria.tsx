import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getGaleriaActiva, type ItemGaleria } from "@/services/api";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería de Actividades | FUNASF" },
      {
        name: "description",
        content:
          "Registros fotográficos de eventos, programas de formación y actividades comunitarias de la Fundación Internacional Amigos Sin Fronteras.",
      },
      { property: "og:title", content: "Galería de Actividades | FUNASF" },
      {
        property: "og:description",
        content: "Fotografías de actividades y programas educativos y sociales de FUNASF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    return await getGaleriaActiva();
  },
  component: GaleriaPage,
});

function GaleriaPage() {
  const items = Route.useLoaderData();
  const [categoria, setCategoria] = useState("todas");
  const [selectedItem, setSelectedItem] = useState<ItemGaleria | null>(null);

  const categorias = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.categoria) set.add(item.categoria);
    });
    return Array.from(set);
  }, [items]);

  const filtrados = useMemo(() => {
    if (categoria === "todas") return items;
    return items.filter((item) => item.categoria === categoria);
  }, [items, categoria]);

  return (
    <>
      <PageHero
        eyebrow="Galería Institucional"
        title="Historias que transforman"
        description="Registros fotográficos de nuestras jornadas educativas, programas técnicos, brigadas de salud y encuentros comunitarios."
      />

      <Section>
        {/* Filtros de Categoría */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" aria-label="Filtrar por categoría">
          <Button
            type="button"
            size="sm"
            variant={categoria === "todas" ? "default" : "outline"}
            onClick={() => setCategoria("todas")}
            className="text-xs"
          >
            Todas ({items.length})
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

        {/* Cuadrícula de Fotografías */}
        {filtrados.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <ImageIcon className="size-10 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-base font-medium text-foreground">No hay fotos en esta categoría</p>
            <p className="text-sm mt-1">Pronto publicaremos más registros de nuestras actividades.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtrados.map((foto) => (
              <div
                key={foto.id}
                onClick={() => setSelectedItem(foto)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={foto.imagenUrl}
                    alt={foto.altText || foto.titulo}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-gold">
                      {foto.categoria}
                    </span>
                    <h3 className="font-semibold text-sm leading-snug mt-0.5 line-clamp-2">
                      {foto.titulo}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-white/80">
                      <Maximize2 className="size-3" /> Ver en grande
                    </div>
                  </div>
                </div>

                <div className="p-3.5 block group-hover:hidden sm:hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-deep">
                    {foto.categoria}
                  </span>
                  <p className="font-medium text-xs text-foreground truncate mt-0.5">{foto.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Lightbox Modal de Imagen en Pantalla Completa */}
      <Dialog open={Boolean(selectedItem)} onOpenChange={() => setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-neutral-800 text-white">
            <div className="relative flex flex-col">
              <div className="relative max-h-[75vh] w-full flex items-center justify-center bg-black">
                <img
                  src={selectedItem.imagenUrl}
                  alt={selectedItem.altText || selectedItem.titulo}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 bg-card border-t border-border text-foreground">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge className="bg-brand-green text-primary-foreground font-normal text-xs">
                    {selectedItem.categoria}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  {selectedItem.titulo}
                </h3>
                {selectedItem.descripcion && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {selectedItem.descripcion}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
