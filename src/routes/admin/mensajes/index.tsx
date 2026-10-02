import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/mensajes/")({
  head: () => ({
    meta: [{ title: "Buzón de Mensajes de Contacto | FUNASF Admin" }],
  }),
  component: AdminMensajesPage,
});

interface MensajeItem {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  asunto: string;
  mensaje: string;
  leido: boolean;
  estado: "nuevo" | "respondido" | "archivado";
  created_at: string;
}

const DEMO_MENSAJES: MensajeItem[] = [
  {
    id: "msg-1",
    nombre: "Carolina Herrera",
    correo: "carolina.herrera@gmail.com",
    telefono: "+57 312 450 9988",
    asunto: "Información sobre beca para Auxiliar de Enfermería",
    mensaje:
      "Buenas tardes, quisiera consultar qué requisitos se necesitan para postular a la beca del 90% en el programa de Auxiliar de Enfermería en la ciudad de Cali. Muchas gracias.",
    leido: false,
    estado: "nuevo",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "msg-2",
    nombre: "Javier Restrepo",
    correo: "javier.restrepo@empresa.com",
    telefono: "+57 318 776 2200",
    asunto: "Convenio institucional y prácticas laborales",
    mensaje:
      "Hola, represento a una IPS en el Valle del Cauca y nos gustaría conocer el proceso para vincular a estudiantes de sus programas técnicos en salud para prácticas asistenciales.",
    leido: true,
    estado: "respondido",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "msg-3",
    nombre: "Luisa Fernanda Morales",
    correo: "luisa.morales@hotmail.com",
    telefono: null,
    asunto: "Horarios disponibles para Primera Infancia",
    mensaje:
      "Hola, quisiera saber si el programa de Primera Infancia se puede cursar de manera semipresencial los fines de semana. Quedo atenta.",
    leido: true,
    estado: "archivado",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

function AdminMensajesPage() {
  const { isConfigured, isAdmin } = useAuth();
  const [mensajes, setMensajes] = useState<MensajeItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMensajes() {
      if (!isConfigured) {
        setMensajes(DEMO_MENSAJES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("mensajes_contacto")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setMensajes(DEMO_MENSAJES);
        } else {
          setMensajes(
            data.map((row) => ({
              id: row.id,
              nombre: row.nombre,
              correo: row.correo,
              telefono: row.telefono,
              asunto: row.asunto,
              mensaje: row.mensaje,
              leido: row.leido,
              estado: (row.estado as "nuevo" | "respondido" | "archivado") || "nuevo",
              created_at: row.created_at,
            })),
          );
        }
      } catch (err) {
        console.warn("Error cargando mensajes:", err);
        setMensajes(DEMO_MENSAJES);
      } finally {
        setLoading(false);
      }
    }

    loadMensajes();
  }, [isConfigured]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return mensajes.filter((m) => {
      const matchEstado =
        filtroEstado === "todos"
          ? true
          : filtroEstado === "no_leidos"
            ? !m.leido
            : m.estado === filtroEstado;

      const matchText =
        !q ||
        m.nombre.toLowerCase().includes(q) ||
        m.correo.toLowerCase().includes(q) ||
        m.asunto.toLowerCase().includes(q) ||
        m.mensaje.toLowerCase().includes(q);

      return matchEstado && matchText;
    });
  }, [mensajes, busqueda, filtroEstado]);

  const abrirMensaje = async (item: MensajeItem) => {
    setSelectedMensaje(item);
    if (!item.leido) {
      setMensajes((prev) => prev.map((m) => (m.id === item.id ? { ...m, leido: true } : m)));
      if (isConfigured && !item.id.startsWith("msg-")) {
        try {
          await supabase.from("mensajes_contacto").update({ leido: true }).eq("id", item.id);
        } catch (err) {
          console.error("Error marcando leído:", err);
        }
      }
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: "nuevo" | "respondido" | "archivado") => {
    setMensajes((prev) => prev.map((m) => (m.id === id ? { ...m, estado: nuevoEstado } : m)));
    if (selectedMensaje && selectedMensaje.id === id) {
      setSelectedMensaje((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
    }

    if (isConfigured && !id.startsWith("msg-")) {
      try {
        await supabase.from("mensajes_contacto").update({ estado: nuevoEstado }).eq("id", id);
      } catch (err) {
        console.error("Error cambiando estado de mensaje:", err);
      }
    }
  };

  const eliminarMensaje = async (id: string) => {
    setMensajes((prev) => prev.filter((m) => m.id !== id));
    if (selectedMensaje?.id === id) setSelectedMensaje(null);

    if (isConfigured && !id.startsWith("msg-")) {
      try {
        await supabase.from("mensajes_contacto").delete().eq("id", id);
      } catch (err) {
        console.error("Error eliminando mensaje:", err);
      }
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout
      title="Buzón de Mensajes de Contacto"
      subtitle="Mensajes y solicitudes enviadas por visitantes desde el sitio web público."
    >
      {/* Filtros y Buscador */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, correo o asunto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["todos", "no_leidos", "nuevo", "respondido", "archivado"].map((est) => (
            <Button
              key={est}
              type="button"
              size="sm"
              variant={filtroEstado === est ? "default" : "outline"}
              onClick={() => setFiltroEstado(est)}
              className="capitalize text-xs"
            >
              {est === "no_leidos" ? "No leídos" : est}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabla de Mensajes */}
      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Remitente</TableHead>
              <TableHead>Asunto & Resumen</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Cargando mensajes del buzón...
                </TableCell>
              </TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No hay mensajes que coincidan con el filtro seleccionado.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((item) => (
                <TableRow
                  key={item.id}
                  className={!item.leido ? "bg-muted/40 font-medium" : undefined}
                >
                  <TableCell className="text-center">
                    {!item.leido && (
                      <span
                        className="inline-block size-2 rounded-full bg-blue-600"
                        title="Mensaje sin leer"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{item.nombre}</div>
                    <div className="text-xs text-muted-foreground">{item.correo}</div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate text-sm text-foreground">{item.asunto}</div>
                    <div className="truncate text-xs text-muted-foreground">{item.mensaje}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        item.estado === "nuevo"
                          ? "default"
                          : item.estado === "respondido"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize text-[11px]"
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirMensaje(item)}
                        className="h-8 text-xs text-brand-green"
                      >
                        <Eye className="size-3.5 mr-1" /> Ver
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => eliminarMensaje(item.id)}
                          className="size-8 text-destructive hover:bg-destructive/10"
                          title="Eliminar mensaje"
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

      {/* Diálogo de Detalle del Mensaje */}
      <Dialog open={Boolean(selectedMensaje)} onOpenChange={() => setSelectedMensaje(null)}>
        {selectedMensaje && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize text-xs">
                  {selectedMensaje.estado}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(selectedMensaje.created_at)}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground mt-2">
                {selectedMensaje.asunto}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Remitente: <strong>{selectedMensaje.nombre}</strong> &bull; {selectedMensaje.correo}
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 rounded-lg bg-muted/30 p-4 border border-border text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedMensaje.mensaje}
            </div>

            {selectedMensaje.telefono && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                <Phone className="size-3.5 text-brand-green" />
                <span>Teléfono suministrado: {selectedMensaje.telefono}</span>
              </div>
            )}

            <div className="pt-2 border-t border-border flex flex-wrap gap-2 items-center justify-between">
              {/* Cambiar estado */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Marcar como:</span>
                <Button
                  size="sm"
                  variant={selectedMensaje.estado === "respondido" ? "secondary" : "outline"}
                  onClick={() => cambiarEstado(selectedMensaje.id, "respondido")}
                  className="text-xs h-7"
                >
                  <CheckCircle2 className="size-3 mr-1 text-emerald-600" /> Respondido
                </Button>
                <Button
                  size="sm"
                  variant={selectedMensaje.estado === "archivado" ? "secondary" : "outline"}
                  onClick={() => cambiarEstado(selectedMensaje.id, "archivado")}
                  className="text-xs h-7"
                >
                  <Archive className="size-3 mr-1" /> Archivar
                </Button>
              </div>

              {/* Botones de respuesta directa */}
              <div className="flex items-center gap-2">
                {selectedMensaje.telefono &&
                  (() => {
                    const digits = selectedMensaje.telefono.replace(/\D/g, "");
                    const waNumber = digits.startsWith("57") ? digits : `57${digits}`;
                    return (
                      <Button
                        asChild
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                      >
                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="size-3.5 mr-1" /> WhatsApp
                        </a>
                      </Button>
                    );
                  })()}
                <Button asChild size="sm" variant="outline" className="text-xs h-8">
                  <a
                    href={`mailto:${selectedMensaje.correo}?subject=Respuesta:%20${encodeURIComponent(
                      selectedMensaje.asunto,
                    )}`}
                  >
                    <Mail className="size-3.5 mr-1" /> Responder Email
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
