import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  UserCheck,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/inscripciones/")({
  head: () => ({
    meta: [{ title: "Gestión de Inscripciones y Becas | FUNASF Admin" }],
  }),
  component: AdminInscripcionesPage,
});

interface InscripcionItem {
  id: string;
  nombre_completo: string;
  documento_tipo: string;
  documento_numero: string;
  telefono: string;
  correo: string;
  ciudad: string;
  programa_nombre: string;
  programa_id: string | null;
  estado: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
  notas_internas: string | null;
  created_at: string;
}

const DEMO_INSCRIPCIONES: InscripcionItem[] = [
  {
    id: "ins-1",
    nombre_completo: "Valentina Gómez López",
    documento_tipo: "CC",
    documento_numero: "1144098231",
    telefono: "315 889 4421",
    correo: "valentina.gomez@gmail.com",
    ciudad: "Cali",
    programa_nombre: "Auxiliar de Enfermería",
    programa_id: null,
    estado: "nuevo",
    notas_internas: "Interesada en jornada diurna. Tiene certificado de bachiller.",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "ins-2",
    nombre_completo: "Carlos Andrés Peña",
    documento_tipo: "CC",
    documento_numero: "1005992144",
    telefono: "318 442 1190",
    correo: "carlos.pena@outlook.com",
    ciudad: "Soledad",
    programa_nombre: "Seguridad y Salud en el Trabajo",
    programa_id: null,
    estado: "contactado",
    notas_internas: "Se llamó el día de ayer. Quedó de enviar documento por WhatsApp.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ins-3",
    nombre_completo: "Daniela Martínez Ruiz",
    documento_tipo: "CC",
    documento_numero: "1118234567",
    telefono: "320 665 9912",
    correo: "daniela.martinez@gmail.com",
    ciudad: "Barranquilla",
    programa_nombre: "Primera Infancia",
    programa_id: null,
    estado: "admitido",
    notas_internas: "Beca 90% aprobada para modalidad semipresencial.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const ESTADOS_INFO: Record<
  InscripcionItem["estado"],
  { label: string; badgeClass: string }
> = {
  nuevo: { label: "Nuevo", badgeClass: "bg-amber-500 text-white" },
  contactado: { label: "Contactado", badgeClass: "bg-blue-500 text-white" },
  en_revision: { label: "En revisión", badgeClass: "bg-purple-500 text-white" },
  admitido: { label: "Admitido", badgeClass: "bg-emerald-600 text-white" },
  descartado: { label: "Descartado", badgeClass: "bg-muted text-muted-foreground" },
};

function AdminInscripcionesPage() {
  const { isConfigured, isAdmin } = useAuth();
  const [inscripciones, setInscripciones] = useState<InscripcionItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [selectedItem, setSelectedItem] = useState<InscripcionItem | null>(null);
  const [editNotas, setEditNotas] = useState("");
  const [editEstado, setEditEstado] = useState<InscripcionItem["estado"]>("nuevo");
  const [guardandoDetalle, setGuardandoDetalle] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInscripciones() {
      if (!isConfigured) {
        setInscripciones(DEMO_INSCRIPCIONES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("inscripciones")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setInscripciones(DEMO_INSCRIPCIONES);
        } else {
          setInscripciones(
            data.map((row) => ({
              id: row.id,
              nombre_completo: row.nombre_completo,
              documento_tipo: row.documento_tipo,
              documento_numero: row.documento_numero,
              telefono: row.telefono,
              correo: row.correo,
              ciudad: row.ciudad,
              programa_nombre: row.programa_nombre,
              programa_id: row.programa_id,
              estado: (row.estado as InscripcionItem["estado"]) || "nuevo",
              notas_internas: row.notas_internas,
              created_at: row.created_at,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando inscripciones:", err);
        setInscripciones(DEMO_INSCRIPCIONES);
      } finally {
        setLoading(false);
      }
    }

    loadInscripciones();
  }, [isConfigured]);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return inscripciones.filter((item) => {
      const matchEstado = filtroEstado === "todos" ? true : item.estado === filtroEstado;
      const matchText =
        !q ||
        item.nombre_completo.toLowerCase().includes(q) ||
        item.documento_numero.includes(q) ||
        item.telefono.includes(q) ||
        item.programa_nombre.toLowerCase().includes(q) ||
        item.ciudad.toLowerCase().includes(q);
      return matchEstado && matchText;
    });
  }, [inscripciones, busqueda, filtroEstado]);

  const abrirDetalle = (item: InscripcionItem) => {
    setSelectedItem(item);
    setEditNotas(item.notas_internas || "");
    setEditEstado(item.estado);
  };

  const guardarDetalle = async () => {
    if (!selectedItem) return;
    setGuardandoDetalle(true);

    setInscripciones((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? { ...i, estado: editEstado, notas_internas: editNotas }
          : i
      )
    );

    if (isConfigured && !selectedItem.id.startsWith("ins-")) {
      try {
        await supabase
          .from("inscripciones")
          .update({ estado: editEstado, notas_internas: editNotas })
          .eq("id", selectedItem.id);
      } catch (err) {
        console.error("Error guardando inscripción:", err);
      }
    }

    setGuardandoDetalle(false);
    setSelectedItem(null);
  };

  const exportarCSV = () => {
    const encabezados = [
      "Fecha",
      "Nombre",
      "Documento",
      "Telefono",
      "Correo",
      "Ciudad",
      "Programa",
      "Estado",
      "Notas",
    ];
    const filas = filtradas.map((i) => [
      `"${new Date(i.created_at).toLocaleDateString("es-CO")}"`,
      `"${i.nombre_completo}"`,
      `"${i.documento_tipo} ${i.documento_numero}"`,
      `"${i.telefono}"`,
      `"${i.correo}"`,
      `"${i.ciudad}"`,
      `"${i.programa_nombre}"`,
      `"${i.estado}"`,
      `"${(i.notas_internas || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [encabezados.join(","), ...filas.map((f) => f.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inscripciones_funasf_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout
      title="Gestión de Inscripciones y Becas"
      subtitle="Control de aspirantes a programas técnicos, convocatorias de becas y seguimiento de admisión."
    >
      {/* Barra de Filtros, Búsqueda y Exportar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por aspirante, documento, ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["todos", "nuevo", "contactado", "en_revision", "admitido", "descartado"].map((est) => (
            <Button
              key={est}
              type="button"
              size="sm"
              variant={filtroEstado === est ? "default" : "outline"}
              onClick={() => setFiltroEstado(est)}
              className="capitalize text-xs"
            >
              {est === "todos"
                ? `Todos (${inscripciones.length})`
                : ESTADOS_INFO[est as InscripcionItem["estado"]]?.label || est}
            </Button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportarCSV}
            className="text-xs ml-auto sm:ml-2"
          >
            <Download className="size-3.5 mr-1" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tabla de Postulaciones */}
      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aspirante</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Programa Solicitado</TableHead>
              <TableHead>Ciudad & Contacto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Cargando aspirantes inscritos...
                </TableCell>
              </TableRow>
            ) : filtradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No se encontraron inscripciones con los criterios seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filtradas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{item.nombre_completo}</div>
                    <div className="text-xs text-muted-foreground">{item.correo}</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {item.documento_tipo} {item.documento_numero}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <GraduationCap className="size-4 text-brand-green shrink-0" />
                      <span>{item.programa_nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{item.ciudad}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="size-3 text-brand-green" /> {item.telefono}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        ESTADOS_INFO[item.estado]?.badgeClass || "bg-muted"
                      }`}
                    >
                      {ESTADOS_INFO[item.estado]?.label || item.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`https://wa.me/57${item.telefono.replace(/\s+/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-border p-1.5 text-brand-green hover:bg-brand-green/10"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="size-4" />
                      </a>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirDetalle(item)}
                        className="h-8 text-xs text-brand-green"
                      >
                        <Eye className="size-3.5 mr-1" /> Detalle
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de Detalle y Seguimiento */}
      <Dialog open={Boolean(selectedItem)} onOpenChange={() => setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    ESTADOS_INFO[selectedItem.estado]?.badgeClass || "bg-muted"
                  }`}
                >
                  {ESTADOS_INFO[selectedItem.estado]?.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  Registrado el {formatDate(selectedItem.created_at)}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground mt-2">
                {selectedItem.nombre_completo}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Programa solicitado: <strong>{selectedItem.programa_nombre}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 grid gap-3 rounded-lg border border-border bg-muted/20 p-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Documento:</span>
                  <p className="font-semibold text-foreground">
                    {selectedItem.documento_tipo} {selectedItem.documento_numero}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciudad:</span>
                  <p className="font-semibold text-foreground">{selectedItem.ciudad}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <p className="font-semibold text-foreground">{selectedItem.telefono}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Correo:</span>
                  <p className="font-semibold text-foreground truncate">{selectedItem.correo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estado-aspirante">Estado del proceso de admisión</Label>
                <select
                  id="estado-aspirante"
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as InscripcionItem["estado"])}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                >
                  <option value="nuevo">Nuevo (Sin contactar)</option>
                  <option value="contactado">Contactado (En conversación)</option>
                  <option value="en_revision">En revisión (Evaluando documentos)</option>
                  <option value="admitido">Admitido (Beca / Cupo asignado)</option>
                  <option value="descartado">Descartado (No cumple requisitos / desiste)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas-internas">Notas internas de seguimiento</Label>
                <Textarea
                  id="notas-internas"
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  placeholder="Escribe observaciones sobre la llamada, documentos pendientes o acuerdos de matrícula..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a
                  href={`https://wa.me/57${selectedItem.telefono.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-3.5 mr-1 text-emerald-600" /> WhatsApp
                </a>
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                  Cerrar
                </Button>
                <Button
                  size="sm"
                  onClick={guardarDetalle}
                  disabled={guardandoDetalle}
                  className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground"
                >
                  Guardar Cambios
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
