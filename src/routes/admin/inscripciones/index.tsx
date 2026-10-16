import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  GraduationCap,
  Loader2,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  UserPlus,
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
import { cleanPhoneDigits } from "@/services/api";
import { toast } from "sonner";

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
  modalidad: string | null;
  mensaje: string | null;
  programa_nombre: string;
  programa_id: string | null;
  estado: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
  notas_internas: string | null;
  created_at: string;
}

interface CursoSimple {
  id: string;
  codigo: string;
  nombre: string;
  periodo: string;
}

const DEMO_INSCRIPCIONES: InscripcionItem[] = [
  {
    id: "ins-1",
    nombre_completo: "Valentina Gómez López",
    documento_tipo: "CC",
    documento_numero: "1144098231",
    telefono: "+57 315 889 4421",
    correo: "valentina.gomez@gmail.com",
    ciudad: "Cali",
    modalidad: "Presencial Cali",
    mensaje: null,
    programa_nombre: "Auxiliar de Enfermería",
    programa_id: null,
    estado: "nuevo",
    notas_internas: "Interesada en jornada diurna. Tiene certificado de bachiller.",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

const ESTADOS_INFO: Record<InscripcionItem["estado"], { label: string; badgeClass: string }> = {
  nuevo: { label: "Nuevo", badgeClass: "bg-amber-600 text-white" },
  contactado: { label: "Contactado", badgeClass: "bg-sky-600 text-white" },
  en_revision: { label: "En revisión", badgeClass: "bg-brand-brown text-white" },
  admitido: { label: "Admitido", badgeClass: "bg-brand-green text-white" },
  descartado: { label: "Descartado", badgeClass: "bg-muted text-muted-foreground" },
};

function AdminInscripcionesPage() {
  const { isConfigured, isAdmin } = useAuth();
  const [inscripciones, setInscripciones] = useState<InscripcionItem[]>([]);
  const [cursosActivos, setCursosActivos] = useState<CursoSimple[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [selectedItem, setSelectedItem] = useState<InscripcionItem | null>(null);
  const [editNotas, setEditNotas] = useState("");
  const [editEstado, setEditEstado] = useState<InscripcionItem["estado"]>("nuevo");
  const [cursoDestinoId, setCursoDestinoId] = useState("");
  const [guardandoDetalle, setGuardandoDetalle] = useState(false);
  const [promoviendoEstudiante, setPromoviendoEstudiante] = useState(false);
  const [credencialesPromovidas, setCredencialesPromovidas] = useState<{
    documento: string;
    usuario: string;
    password: string;
    reutilizado?: boolean;
    matriculado?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInscripciones() {
      if (!isConfigured) {
        setInscripciones(DEMO_INSCRIPCIONES);
        setLoading(false);
        return;
      }

      try {
        const [inscRes, curRes] = await Promise.all([
          supabase.from("inscripciones").select("*").order("created_at", { ascending: false }),
          supabase
            .from("cursos")
            .select("id, codigo, nombre, periodo")
            .eq("activo", true)
            .order("nombre"),
        ]);

        if (curRes.data) {
          setCursosActivos(curRes.data);
        }

        if (inscRes.error) {
          console.error("Error cargando inscripciones:", inscRes.error);
          setInscripciones([]);
        } else {
          setInscripciones(
            (inscRes.data || []).map((row) => ({
              id: row.id,
              nombre_completo: row.nombre_completo,
              documento_tipo: row.documento_tipo,
              documento_numero: row.documento_numero,
              telefono: row.telefono,
              correo: row.correo,
              ciudad: row.ciudad,
              modalidad: row.modalidad,
              mensaje: row.mensaje,
              programa_nombre: row.programa_nombre,
              programa_id: row.programa_id,
              estado: (row.estado as InscripcionItem["estado"]) || "nuevo",
              notas_internas: row.notas_internas,
              created_at: row.created_at,
            })),
          );
        }
      } catch (err) {
        console.warn("Error cargando inscripciones:", err);
        setInscripciones([]);
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
    setCursoDestinoId("");
    setCredencialesPromovidas(null);
  };

  const guardarDetalle = async () => {
    if (!selectedItem) return;
    setGuardandoDetalle(true);

    setInscripciones((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, estado: editEstado, notas_internas: editNotas } : i,
      ),
    );

    if (isConfigured && !selectedItem.id.startsWith("ins-")) {
      try {
        const { error } = await supabase
          .from("inscripciones")
          .update({ estado: editEstado, notas_internas: editNotas })
          .eq("id", selectedItem.id);

        if (error) {
          toast.error("Error guardando cambios: " + error.message);
        } else {
          toast.success("Seguimiento de inscripción actualizado.");
        }
      } catch (err) {
        console.error("Error guardando inscripción:", err);
      }
    }

    setGuardandoDetalle(false);
    setSelectedItem(null);
  };

  const handlePromoverAEstudiante = async () => {
    if (!selectedItem) return;
    const cleanDoc = selectedItem.documento_numero.replace(/\s+/g, "").trim();
    if (!cleanDoc) {
      toast.error("El aspirante no tiene un número de documento válido.");
      return;
    }

    setPromoviendoEstudiante(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-usuarios", {
        body: {
          accion: "crear",
          rol: "estudiante",
          nombre_completo: selectedItem.nombre_completo.trim(),
          documento: cleanDoc,
          telefono: selectedItem.telefono.trim(),
          curso_id: cursoDestinoId || undefined,
          inscripcion_id: selectedItem.id.startsWith("ins-") ? undefined : selectedItem.id,
          reutilizar_existente: true,
        },
      });

      if (error || !data?.ok) {
        toast.error(error?.message || data?.error || "No se pudo habilitar la cuenta de estudiante.");
        return;
      }

      const nextNotas = `${editNotas ? editNotas + "\n" : ""}[Admisión] Cuenta estudiantil habilitada (Doc: ${cleanDoc})${
        data.matriculado ? " y matriculado en curso." : "."
      }`;
      setEditEstado("admitido");
      setEditNotas(nextNotas);

      if (isConfigured && !selectedItem.id.startsWith("ins-")) {
        await supabase
          .from("inscripciones")
          .update({ estado: "admitido", notas_internas: nextNotas })
          .eq("id", selectedItem.id);
      }

      setInscripciones((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id ? { ...i, estado: "admitido", notas_internas: nextNotas } : i,
        ),
      );

      setCredencialesPromovidas({
        documento: cleanDoc,
        usuario: data.usuario || cleanDoc,
        password: data.password_temporal || cleanDoc,
        reutilizado: Boolean(data.reutilizado),
        matriculado: Boolean(data.matriculado),
      });

      toast.success(
        data.reutilizado
          ? "El estudiante ya tenía cuenta activa y fue actualizado/matriculado."
          : "Cuenta de estudiante creada y admitida exitosamente.",
      );
    } catch (err: any) {
      toast.error(err.message || "Error al promover aspirante.");
    } finally {
      setPromoviendoEstudiante(false);
    }
  };

  const handleEliminarInscripcion = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la solicitud de inscripción de ${nombre}?`)) return;
    setInscripciones((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);

    if (isConfigured && !id.startsWith("ins-")) {
      const { error } = await supabase.from("inscripciones").delete().eq("id", id);
      if (error) {
        toast.error("No se pudo eliminar: " + error.message);
      } else {
        toast.success("Inscripción eliminada.");
      }
    }
  };

  const exportarCSV = () => {
    const encabezados = [
      "Fecha",
      "Nombre",
      "Documento",
      "Telefono",
      "Correo",
      "Ciudad",
      "Modalidad",
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
      `"${i.modalidad || ""}"`,
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
    link.setAttribute(
      "download",
      `inscripciones_funasf_${new Date().toISOString().slice(0, 10)}.csv`,
    );
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
      subtitle="Control de aspirantes a programas técnicos, convocatorias de becas y admisión directa al portal estudiantil."
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
            disabled={filtradas.length === 0}
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
                  No hay inscripciones registradas con los criterios seleccionados.
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
                    {item.modalidad && (
                      <span className="text-[11px] text-muted-foreground block pl-5">
                        Modalidad: {item.modalidad}
                      </span>
                    )}
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
                        href={`https://wa.me/${cleanPhoneDigits(item.telefono)}`}
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
                        <Eye className="size-3.5 mr-1" /> Gestionar
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarInscripcion(item.id, item.nombre_completo)}
                          className="size-8 text-muted-foreground hover:text-destructive"
                          title="Eliminar solicitud"
                        >
                          <Trash2 className="size-3.5" />
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

      {/* Diálogo de Detalle, Seguimiento y Admisión Académica */}
      <Dialog open={Boolean(selectedItem)} onOpenChange={() => setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

            <div className="my-3 grid gap-3 rounded-lg border border-border bg-muted/20 p-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Documento:</span>
                  <p className="font-semibold text-foreground">
                    {selectedItem.documento_tipo} {selectedItem.documento_numero}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciudad / Modalidad:</span>
                  <p className="font-semibold text-foreground">
                    {selectedItem.ciudad}
                    {selectedItem.modalidad ? ` · ${selectedItem.modalidad}` : ""}
                  </p>
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
              {selectedItem.mensaje && (
                <div className="pt-2 border-t border-border">
                  <span className="text-muted-foreground">Mensaje adicional del postulante:</span>
                  <p className="text-foreground mt-0.5">{selectedItem.mensaje}</p>
                </div>
              )}
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
                  rows={2}
                />
              </div>

              {/* Bloque de Admisión Directa: Crear Cuenta de Estudiante y Matricular */}
              {isAdmin && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <GraduationCap className="size-4 text-emerald-700" />
                      Admisión Académica Directa (Portal Estudiantil)
                    </span>
                  </div>

                  {credencialesPromovidas ? (
                    <div className="rounded-lg bg-white border border-emerald-200 p-3 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="size-4" />
                        {credencialesPromovidas.reutilizado
                          ? "Cuenta estudiantil existente vinculada"
                          : "Cuenta estudiantil creada exitosamente"}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Documento de acceso: <strong className="font-mono">{credencialesPromovidas.documento}</strong> · Contraseña inicial:{" "}
                        <strong className="font-mono">{credencialesPromovidas.password}</strong>
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Portal Estudiantil FUNASF: https://edufunasf.org/portal-estudiantil\nDocumento: ${credencialesPromovidas.documento}\nContraseña: ${credencialesPromovidas.password}`,
                            );
                            toast.success("Credenciales copiadas.");
                          }}
                          className="h-7 text-[11px]"
                        >
                          <Copy className="size-3 mr-1" /> Copiar
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <a
                            href={`https://wa.me/${cleanPhoneDigits(selectedItem.telefono)}?text=${encodeURIComponent(
                              `¡Felicitaciones ${selectedItem.nombre_completo}! Has sido admitido(a) en FUNASF para el programa ${selectedItem.programa_nombre}.\n\n🎓 Tu acceso al Portal Estudiantil ya está activo:\n🌐 https://edufunasf.org/portal-estudiantil\n🪪 Documento: ${credencialesPromovidas.documento}\n🔑 Contraseña inicial: ${credencialesPromovidas.password}`,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle className="size-3 mr-1" /> Enviar Bienvenida WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                        Crea en 1 clic la cuenta de <strong>{selectedItem.nombre_completo}</strong> con su documento (<strong>{selectedItem.documento_numero}</strong>) y matricúlalo opcionalmente en un curso activo:
                      </p>
                      <select
                        value={cursoDestinoId}
                        onChange={(e) => setCursoDestinoId(e.target.value)}
                        className="w-full text-xs rounded-lg border border-emerald-300 bg-white p-2 font-medium"
                      >
                        <option value="">-- Solo crear cuenta de estudiante (sin matricular aún) --</option>
                        {cursosActivos.map((c) => (
                          <option key={c.id} value={c.id}>
                            Matricular en: [{c.codigo}] {c.nombre} ({c.periodo})
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        disabled={promoviendoEstudiante}
                        onClick={handlePromoverAEstudiante}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
                      >
                        {promoviendoEstudiante ? (
                          <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        ) : (
                          <UserPlus className="size-3.5 mr-1.5" />
                        )}
                        Admitir, Crear Cuenta Estudiantil {cursoDestinoId ? "y Matricular" : ""}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2">
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a
                  href={`https://wa.me/${cleanPhoneDigits(selectedItem.telefono)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-3.5 mr-1 text-emerald-600" /> WhatsApp
                </a>
              </Button>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                  Cerrar
                </Button>
                <Button
                  size="sm"
                  onClick={guardarDetalle}
                  disabled={guardandoDetalle}
                  className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground"
                >
                  Guardar Seguimiento
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
