import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Newspaper,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getArticulosPublicados, type ArticuloBlog } from "@/services/api";

export const Route = createFileRoute("/admin/blog/")({
  head: () => ({
    meta: [{ title: "Gestión de Blog y Noticias | FUNASF Admin" }],
  }),
  component: AdminBlogIndexPage,
});

export interface ArticuloAdminItem extends ArticuloBlog {
  estado?: "borrador" | "publicado";
}

function AdminBlogIndexPage() {
  const { isConfigured, isAdmin } = useAuth();
  const [articulos, setArticulos] = useState<ArticuloAdminItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<ArticuloAdminItem | null>(null);

  useEffect(() => {
    async function loadArticulos() {
      if (!isConfigured) {
        const fallback = await getArticulosPublicados();
        setArticulos(fallback.map((a) => ({ ...a, estado: "publicado" })));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("articulos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          const fallback = await getArticulosPublicados();
          setArticulos(fallback.map((a) => ({ ...a, estado: "publicado" })));
        } else {
          setArticulos(
            data.map((row) => ({
              id: row.id,
              slug: row.slug,
              titulo: row.titulo,
              resumen: row.resumen,
              contenido: row.contenido,
              autorNombre: row.autor_nombre,
              categoria: row.categoria,
              imagenPortada: row.imagen_portada,
              estado: (row.estado as "borrador" | "publicado") || "borrador",
              fechaPublicacion: row.fecha_publicacion || row.created_at,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando artículos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticulos();
  }, [isConfigured]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return articulos.filter((a) => {
      const matchEstado = filtroEstado === "todos" ? true : a.estado === filtroEstado;
      const matchText =
        !q ||
        a.titulo.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.categoria.toLowerCase().includes(q) ||
        a.resumen.toLowerCase().includes(q);
      return matchEstado && matchText;
    });
  }, [articulos, busqueda, filtroEstado]);

  const toggleEstado = async (item: ArticuloAdminItem) => {
    const nuevoEstado = item.estado === "publicado" ? "borrador" : "publicado";
    setArticulos((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, estado: nuevoEstado } : a))
    );

    if (isConfigured && !item.id.startsWith("art-")) {
      try {
        await supabase
          .from("articulos")
          .update({ estado: nuevoEstado })
          .eq("id", item.id);
      } catch (err) {
        console.error("Error actualizando estado del artículo:", err);
      }
    }
  };

  const confirmarEliminar = async () => {
    if (!itemToDelete) return;
    setArticulos((prev) => prev.filter((a) => a.id !== itemToDelete.id));

    if (isConfigured && !itemToDelete.id.startsWith("art-")) {
      try {
        await supabase.from("articulos").delete().eq("id", itemToDelete.id);
      } catch (err) {
        console.error("Error eliminando artículo:", err);
      }
    }
    setItemToDelete(null);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout
      title="Gestión de Blog y Noticias"
      subtitle="Publica noticias de la comunidad, convocatorias, testimonios y reflexiones institucionales."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artículo por título o tema..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background">
            <Button
              type="button"
              size="sm"
              variant={filtroEstado === "todos" ? "secondary" : "ghost"}
              onClick={() => setFiltroEstado("todos")}
              className="text-xs h-7"
            >
              Todos
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtroEstado === "publicado" ? "secondary" : "ghost"}
              onClick={() => setFiltroEstado("publicado")}
              className="text-xs h-7"
            >
              Publicados
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtroEstado === "borrador" ? "secondary" : "ghost"}
              onClick={() => setFiltroEstado("borrador")}
              className="text-xs h-7"
            >
              Borradores
            </Button>
          </div>

          <Button asChild className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground">
            <Link to="/admin/blog/nuevo">
              <Plus className="size-4 mr-2" />
              Nuevo Artículo
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artículo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Cargando artículos del blog...
                </TableCell>
              </TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No se encontraron artículos con los criterios seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{item.titulo}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate max-w-sm">
                      /blog/{item.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {item.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{item.autorNombre}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(item.fechaPublicacion)}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleEstado(item)}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                      title="Haz clic para cambiar entre publicado y borrador"
                    >
                      {item.estado === "publicado" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs font-medium">
                          <CheckCircle className="size-3" /> Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Clock className="size-3" /> Borrador
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="size-8" title="Ver en el blog">
                        <Link to="/blog/$slug" params={{ slug: item.slug }}>
                          <Eye className="size-4 text-muted-foreground" />
                        </Link>
                      </Button>

                      <Button asChild variant="ghost" size="icon" className="size-8" title="Editar artículo">
                        <Link to="/admin/blog/$id" params={{ id: item.id }}>
                          <Edit className="size-4 text-brand-green" />
                        </Link>
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItemToDelete(item)}
                          className="size-8 text-destructive hover:bg-destructive/10"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo Eliminar */}
      <AlertDialog open={Boolean(itemToDelete)} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas eliminar este artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el artículo <strong>{itemToDelete?.titulo}</strong> del blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Artículo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
