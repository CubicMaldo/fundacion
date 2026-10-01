import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Edit,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
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
import { programasAcademicos, type ProgramaAcademico } from "@/data/programas";

export const Route = createFileRoute("/admin/programas/")({
  head: () => ({
    meta: [{ title: "Gestión de Programas Académicos | FUNASF Admin" }],
  }),
  component: AdminProgramasIndex,
});

export interface ProgramaAdminItem extends ProgramaAcademico {
  id?: string;
  activo?: boolean;
  orden?: number;
}

function AdminProgramasIndex() {
  const { isConfigured, isAdmin } = useAuth();
  const [programas, setProgramas] = useState<ProgramaAdminItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<ProgramaAdminItem | null>(null);

  useEffect(() => {
    async function loadProgramas() {
      if (!isConfigured) {
        setProgramas(programasAcademicos.map((p, i) => ({ ...p, id: `local-${i}`, activo: true, orden: i + 1 })));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("programas")
          .select("*")
          .order("orden", { ascending: true });

        if (error || !data || data.length === 0) {
          setProgramas(programasAcademicos.map((p, i) => ({ ...p, id: `local-${i}`, activo: true, orden: i + 1 })));
        } else {
          setProgramas(
            data.map((row) => ({
              id: row.id,
              slug: row.slug,
              nombre: row.nombre,
              categoria: row.categoria,
              categoriaId: row.categoria_id,
              descripcion: row.descripcion,
              objetivo: row.objetivo,
              modalidades: row.modalidades || [],
              perfilOcupacional: row.perfil_ocupacional || [],
              requisitos: row.requisitos || [],
              certificacionNota: row.certificacion_nota || undefined,
              duracionEstimada: row.duracion_estimada || undefined,
              activo: row.activo,
              orden: row.orden,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando programas:", err);
        setProgramas(programasAcademicos.map((p, i) => ({ ...p, id: `local-${i}`, activo: true, orden: i + 1 })));
      } finally {
        setLoading(false);
      }
    }

    loadProgramas();
  }, [isConfigured]);

  const categorias = useMemo(() => {
    const map = new Map<string, string>();
    programas.forEach((p) => {
      if (p.categoriaId && p.categoria) {
        map.set(p.categoriaId, p.categoria);
      }
    });
    return Array.from(map.entries());
  }, [programas]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return programas.filter((p) => {
      const matchCat = categoriaFiltro === "todas" || p.categoriaId === categoriaFiltro;
      const matchText =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [programas, busqueda, categoriaFiltro]);

  const toggleEstado = async (item: ProgramaAdminItem) => {
    const nuevoEstado = !item.activo;
    setProgramas((prev) =>
      prev.map((p) => (p.slug === item.slug ? { ...p, activo: nuevoEstado } : p))
    );

    if (isConfigured && item.id && !item.id.startsWith("local-")) {
      try {
        await supabase
          .from("programas")
          .update({ activo: nuevoEstado })
          .eq("id", item.id);
      } catch (err) {
        console.error("Error actualizando estado:", err);
      }
    }
  };

  const confirmarEliminar = async () => {
    if (!itemToDelete) return;

    setProgramas((prev) => prev.filter((p) => p.slug !== itemToDelete.slug));

    if (isConfigured && itemToDelete.id && !itemToDelete.id.startsWith("local-")) {
      try {
        await supabase.from("programas").delete().eq("id", itemToDelete.id);
      } catch (err) {
        console.error("Error eliminando programa:", err);
      }
    }

    setItemToDelete(null);
  };

  return (
    <AdminLayout
      title="Catálogo de Programas Académicos"
      subtitle="Gestiona la oferta formativa, requisitos, modalidades y visibilidad en el sitio."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar programa por nombre o área..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:ring-1 focus:ring-ring"
          >
            <option value="todas">Todas las áreas ({programas.length})</option>
            {categorias.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Nuevo Programa */}
        <Button asChild className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground shrink-0">
          <Link to="/admin/programas/nuevo">
            <Plus className="size-4 mr-2" />
            Nuevo Programa
          </Link>
        </Button>
      </div>

      {/* Tabla de Programas */}
      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">Ord.</TableHead>
              <TableHead>Programa & Slug</TableHead>
              <TableHead>Área / Categoría</TableHead>
              <TableHead>Modalidades</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Cargando catálogo de programas...
                </TableCell>
              </TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No se encontraron programas con los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((item, index) => (
                <TableRow key={item.slug}>
                  <TableCell className="text-center text-xs font-mono text-muted-foreground">
                    {item.orden ?? index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{item.nombre}</div>
                    <div className="text-xs text-muted-foreground font-mono">/programas/{item.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">
                      {item.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.modalidades.map((m) => (
                        <span key={m} className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          {m}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleEstado(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
                      title="Haz clic para activar o pausar"
                    >
                      {item.activo !== false ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="size-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          <XCircle className="size-3" /> Pausado
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="size-8" title="Ver en la web pública">
                        <a href={`/programas/${item.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="size-4 text-muted-foreground" />
                        </a>
                      </Button>

                      <Button asChild variant="ghost" size="icon" className="size-8" title="Editar programa">
                        <Link to="/admin/programas/$id" params={{ id: item.id || item.slug }}>
                          <Edit className="size-4 text-brand-green" />
                        </Link>
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:bg-destructive/10"
                          title="Eliminar programa"
                          onClick={() => setItemToDelete(item)}
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

      {/* Diálogo de Confirmación para Eliminar */}
      <AlertDialog open={Boolean(itemToDelete)} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas eliminar este programa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el programa <strong>{itemToDelete?.nombre}</strong> del catálogo público.
              Los aspirantes existentes no se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Programa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
