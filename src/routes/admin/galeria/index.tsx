import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  CheckCircle,
  Edit,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getGaleriaActiva, type ItemGaleria } from "@/services/api";

export const Route = createFileRoute("/admin/galeria/")({
  head: () => ({
    meta: [{ title: "Gestión de Galería Fotográfica | FUNASF Admin" }],
  }),
  component: AdminGaleriaPage,
});

export interface GaleriaAdminItem extends ItemGaleria {
  activo?: boolean;
}

const CATEGORIAS_GALERIA = ["Eventos", "Talleres", "Comunidad", "Salud", "Sedes", "General"];

function AdminGaleriaPage() {
  const { isConfigured, isAdmin } = useAuth();
  const [items, setItems] = useState<GaleriaAdminItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [loading, setLoading] = useState(true);

  // Modal para crear / editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GaleriaAdminItem | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Comunidad");
  const [imagenUrl, setImagenUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [orden, setOrden] = useState(1);
  const [activo, setActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Modal de eliminar
  const [itemToDelete, setItemToDelete] = useState<GaleriaAdminItem | null>(null);

  useEffect(() => {
    async function loadGaleria() {
      if (!isConfigured) {
        const fallback = await getGaleriaActiva();
        setItems(fallback.map((g) => ({ ...g, activo: true })));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("galeria")
          .select("*")
          .order("orden", { ascending: true });

        if (error || !data || data.length === 0) {
          const fallback = await getGaleriaActiva();
          setItems(fallback.map((g) => ({ ...g, activo: true })));
        } else {
          setItems(
            data.map((row) => ({
              id: row.id,
              titulo: row.titulo,
              descripcion: row.descripcion,
              categoria: row.categoria,
              imagenUrl: row.imagen_url,
              altText: row.alt_text,
              orden: row.orden,
              activo: row.activo,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando galería:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGaleria();
  }, [isConfigured]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = filtroCategoria === "todas" ? true : item.categoria === filtroCategoria;
      const matchText =
        !q ||
        item.titulo.toLowerCase().includes(q) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(q)) ||
        item.categoria.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [items, busqueda, filtroCategoria]);

  const abrirCrear = () => {
    setEditingItem(null);
    setTitulo("");
    setDescripcion("");
    setCategoria("Comunidad");
    setImagenUrl("");
    setAltText("");
    setOrden(items.length + 1);
    setActivo(true);
    setModalOpen(true);
  };

  const abrirEditar = (item: GaleriaAdminItem) => {
    setEditingItem(item);
    setTitulo(item.titulo);
    setDescripcion(item.descripcion || "");
    setCategoria(item.categoria);
    setImagenUrl(item.imagenUrl);
    setAltText(item.altText || "");
    setOrden(item.orden);
    setActivo(item.activo ?? true);
    setModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const payload = {
      titulo,
      descripcion: descripcion || null,
      categoria,
      imagen_url: imagenUrl,
      alt_text: altText || titulo,
      orden: Number(orden),
      activo,
    };

    if (isConfigured) {
      try {
        if (editingItem && !editingItem.id.startsWith("gal-")) {
          await supabase.from("galeria").update(payload).eq("id", editingItem.id);
        } else {
          await supabase.from("galeria").insert(payload);
        }
      } catch (err) {
        console.error("Error guardando elemento en galería:", err);
      }
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, titulo, descripcion, categoria, imagenUrl, altText, orden: Number(orden), activo }
            : i
        )
      );
    } else {
      const newItem: GaleriaAdminItem = {
        id: `local-${Date.now()}`,
        titulo,
        descripcion,
        categoria,
        imagenUrl,
        altText,
        orden: Number(orden),
        activo,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setGuardando(false);
    setModalOpen(false);
  };

  const toggleEstado = async (item: GaleriaAdminItem) => {
    const nuevoEstado = !item.activo;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, activo: nuevoEstado } : i))
    );

    if (isConfigured && !item.id.startsWith("gal-") && !item.id.startsWith("local-")) {
      try {
        await supabase.from("galeria").update({ activo: nuevoEstado }).eq("id", item.id);
      } catch (err) {
        console.error("Error actualizando estado de foto:", err);
      }
    }
  };

  const confirmarEliminar = async () => {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));

    if (isConfigured && !itemToDelete.id.startsWith("gal-") && !itemToDelete.id.startsWith("local-")) {
      try {
        await supabase.from("galeria").delete().eq("id", itemToDelete.id);
      } catch (err) {
        console.error("Error eliminando foto:", err);
      }
    }
    setItemToDelete(null);
  };

  return (
    <AdminLayout
      title="Gestión de Galería Fotográfica"
      subtitle="Publica y organiza registros fotográficos de talleres, eventos y actividades comunitarias."
    >
      {/* Barra de Filtros, Buscador y Botón Crear */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar fotos por título o tema..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs"
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS_GALERIA.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={abrirCrear}
          className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground shrink-0"
        >
          <Plus className="size-4 mr-2" />
          Añadir Fotografía
        </Button>
      </div>

      {/* Cuadrícula de Fotografías */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand-green" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          No se encontraron fotografías con los filtros seleccionados.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-xs flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <img
                  src={item.imagenUrl}
                  alt={item.altText || item.titulo}
                  className="size-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-xs font-normal text-[11px]">
                    {item.categoria}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => toggleEstado(item)}
                    className="cursor-pointer"
                    title={item.activo !== false ? "Pausar visibilidad" : "Activar visibilidad"}
                  >
                    {item.activo !== false ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                        <Check className="size-3.5" />
                      </span>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted-foreground/80 text-white shadow-xs">
                        <XCircle className="size-3.5" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">{item.titulo}</h3>
                  {item.descripcion && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.descripcion}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Orden: #{item.orden}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => abrirEditar(item)}
                      className="size-7 text-brand-green"
                      title="Editar foto"
                    >
                      <Edit className="size-3.5" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemToDelete(item)}
                        className="size-7 text-destructive hover:bg-destructive/10"
                        title="Eliminar foto"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear / Editar Foto */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleGuardar}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingItem ? "Editar Fotografía" : "Añadir Fotografía a Galería"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Ingresa la URL o enlace directo de la imagen para exhibirla en la galería pública.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="foto-titulo">Título del registro *</Label>
                <Input
                  id="foto-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Jornada de orientación vocacional"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto-cat">Categoría</Label>
                <select
                  id="foto-cat"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                >
                  {CATEGORIAS_GALERIA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto-url">URL de la imagen *</Label>
                <Input
                  id="foto-url"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
                {imagenUrl && (
                  <div className="mt-2 aspect-video overflow-hidden rounded-md border border-border">
                    <img
                      src={imagenUrl}
                      alt="Vista previa"
                      className="size-full object-cover"
                      onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto-desc">Descripción (opcional)</Label>
                <Textarea
                  id="foto-desc"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Contexto del evento o lugar..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1">
                  <Label htmlFor="foto-orden">Posición / Orden</Label>
                  <Input
                    id="foto-orden"
                    type="number"
                    min={1}
                    value={orden}
                    onChange={(e) => setOrden(Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="foto-activo" className="text-xs">Visible en web</Label>
                  <Switch id="foto-activo" checked={activo} onCheckedChange={setActivo} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={guardando || !titulo || !imagenUrl}
                className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground"
              >
                {guardando ? "Guardando..." : "Guardar Registro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo Eliminar */}
      <AlertDialog open={Boolean(itemToDelete)} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas eliminar esta fotografía?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará <strong>{itemToDelete?.titulo}</strong> de la galería pública.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
