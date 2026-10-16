import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Trash2,
  Edit,
  Sparkles,
  Users,
  Award,
  MessageSquare,
  Lock,
  AlertCircle,
  Download,
  FileCheck,
  FileText,
  ExternalLink,
  Settings,
} from "lucide-react";
import { createSeoMeta } from "@/lib/seo";
import { DocenteLayout } from "@/components/docente/DocenteLayout";
import {
  getCursoDetalleDocente,
  crearComponenteEvaluacion,
  actualizarComponenteEvaluacion,
  eliminarComponenteEvaluacion,
  guardarCalificacion,
  calificarEntrega,
  obtenerUrlDescargaEvidencia,
  crearObservacionAcademica,
  actualizarObservacionAcademica,
  eliminarObservacionAcademica,
  actualizarDetallesCursoDocente,
  cerrarCursoDocente,
  type CursoDetalleDocente,
  type ComponenteEvaluacion,
  type EstudianteMatriculado,
  type ObservacionAcademica,
} from "@/services/academico";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/docente/$cursoId")({
  head: () =>
    createSeoMeta({
      title: "Planilla y Malla de Calificaciones | Docente FUNASF",
      description: "Panel de control y registro evaluativo para docentes de la Fundación Internacional Amigos Sin Fronteras.",
      noindex: true,
      canonicalPath: "/docente",
    }),
  component: DocenteCursoDetallePage,
});

function DocenteCursoDetallePage() {
  const { cursoId } = Route.useParams();
  const [data, setData] = useState<CursoDetalleDocente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogo de componente evaluativo
  const [modalCompOpen, setModalCompOpen] = useState(false);
  const [compEditando, setCompEditando] = useState<ComponenteEvaluacion | null>(null);
  const [compNombre, setCompNombre] = useState("");
  const [compPorcentaje, setCompPorcentaje] = useState<number>(20);
  const [compDesc, setCompDesc] = useState("");
  const [guardandoComp, setGuardandoComp] = useState(false);

  // Estados para calificación rápida por celda
  const [calificandoEstudiante, setCalificandoEstudiante] = useState<{
    matriculaId: string;
    nombreEstudiante: string;
    componente: ComponenteEvaluacion;
    notaActual: number | "";
    retro: string;
  } | null>(null);
  const [guardandoNota, setGuardandoNota] = useState(false);

  // Estados para observación académica (crear / editar)
  const [modalObsEst, setModalObsEst] = useState<EstudianteMatriculado | null>(null);
  const [obsEditando, setObsEditando] = useState<ObservacionAcademica | null>(null);
  const [obsTipo, setObsTipo] = useState<"felicitacion" | "alerta_academica" | "asistencia" | "seguimiento">("seguimiento");
  const [obsTitulo, setObsTitulo] = useState("");
  const [obsDetalle, setObsDetalle] = useState("");
  const [guardandoObs, setGuardandoObs] = useState(false);

  // Estados para configuración operativa del curso (horario, aula, descripción)
  const [modalInfoCursoOpen, setModalInfoCursoOpen] = useState(false);
  const [infoHorario, setInfoHorario] = useState("");
  const [infoAula, setInfoAula] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [guardandoInfoCurso, setGuardandoInfoCurso] = useState(false);

  // Estado para cierre de curso
  const [cerrandoCurso, setCerrandoCurso] = useState(false);

  // Estados para calificar entrega de trabajo
  const [modalCalificarEntrega, setModalCalificarEntrega] = useState<{
    entregaId: string;
    matriculaId: string;
    estudianteNombre: string;
    titulo: string;
    notaActual: number | "";
    retro: string;
    componenteId: string;
  } | null>(null);
  const [guardandoNotaEntrega, setGuardandoNotaEntrega] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getCursoDetalleDocente(cursoId);
    if (!res.ok || !res.data) {
      setError(res.error || "No fue posible cargar los detalles del curso.");
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [cursoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Manejo de guardado de componente evaluativo (Malla)
  const handleGuardarComponente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compNombre.trim()) {
      toast.error("El nombre del componente es obligatorio.");
      return;
    }
    if (compPorcentaje <= 0 || compPorcentaje > 100) {
      toast.error("El porcentaje debe ser mayor a 0 y hasta 100%.");
      return;
    }

    setGuardandoComp(true);
    if (compEditando) {
      const res = await actualizarComponenteEvaluacion({
        id: compEditando.id,
        nombre: compNombre,
        porcentaje: compPorcentaje,
        descripcion: compDesc,
      });
      if (res.ok) {
        toast.success("Componente evaluativo actualizado.");
        setModalCompOpen(false);
        setCompEditando(null);
        await cargar();
      } else {
        toast.error(res.error || "Error al actualizar componente.");
      }
    } else {
      const res = await crearComponenteEvaluacion({
        cursoId,
        nombre: compNombre,
        porcentaje: compPorcentaje,
        descripcion: compDesc,
        orden: (data?.componentes.length || 0) + 1,
      });
      if (res.ok) {
        toast.success("Componente evaluativo agregado a la malla.");
        setModalCompOpen(false);
        setCompNombre("");
        setCompPorcentaje(20);
        setCompDesc("");
        await cargar();
      } else {
        toast.error(res.error || "Error al crear componente.");
      }
    }
    setGuardandoComp(false);
  };

  const handleEliminarComponente = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el componente "${nombre}"? Las notas asociadas se removerán.`)) return;
    const res = await eliminarComponenteEvaluacion(id);
    if (res.ok) {
      toast.success("Componente eliminado.");
      await cargar();
    } else {
      toast.error(res.error || "Error al eliminar componente.");
    }
  };

  // Guardar calificación de un estudiante
  const handleGuardarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calificandoEstudiante) return;
    const rawNota = String(calificandoEstudiante.notaActual ?? "").trim();
    const notaNum = Number(rawNota);
    if (rawNota === "" || isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
      toast.error("Ingresa una calificación válida entre 0.0 y 5.0");
      return;
    }

    setGuardandoNota(true);
    const res = await guardarCalificacion({
      componenteId: calificandoEstudiante.componente.id,
      matriculaId: calificandoEstudiante.matriculaId,
      nota: notaNum,
      retroalimentacion: calificandoEstudiante.retro,
    });
    setGuardandoNota(false);

    if (res.ok) {
      toast.success(`Nota de ${notaNum.toFixed(1)} registrada con éxito.`);
      setCalificandoEstudiante(null);
      await cargar();
    } else {
      toast.error(res.error || "No se pudo registrar la calificación.");
    }
  };

  // Guardar o actualizar observación pedagógica
  const handleGuardarObservacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalObsEst || !obsTitulo.trim() || !obsDetalle.trim()) {
      toast.error("El título y el detalle de la observación son obligatorios.");
      return;
    }

    setGuardandoObs(true);
    if (obsEditando) {
      const res = await actualizarObservacionAcademica({
        id: obsEditando.id,
        tipo: obsTipo,
        titulo: obsTitulo,
        detalle: obsDetalle,
      });
      setGuardandoObs(false);
      if (res.ok) {
        toast.success("Observación pedagógica actualizada.");
        setModalObsEst(null);
        setObsEditando(null);
        setObsTitulo("");
        setObsDetalle("");
        await cargar();
      } else {
        toast.error(res.error || "No se pudo actualizar la observación.");
      }
    } else {
      const res = await crearObservacionAcademica({
        matriculaId: modalObsEst.matriculaId,
        tipo: obsTipo,
        titulo: obsTitulo,
        detalle: obsDetalle,
      });
      setGuardandoObs(false);

      if (res.ok) {
        toast.success("Observación pedagógica registrada.");
        setModalObsEst(null);
        setObsTitulo("");
        setObsDetalle("");
        await cargar();
      } else {
        toast.error(res.error || "No se pudo registrar la observación.");
      }
    }
  };

  const handleEliminarObservacion = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar la observación "${titulo}"?`)) return;
    const res = await eliminarObservacionAcademica(id);
    if (res.ok) {
      toast.success("Observación eliminada.");
      await cargar();
    } else {
      toast.error(res.error || "No se pudo eliminar la observación.");
    }
  };

  const handleGuardarInfoCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoInfoCurso(true);
    const res = await actualizarDetallesCursoDocente({
      cursoId,
      horarioDescripcion: infoHorario,
      aula: infoAula,
      descripcion: infoDesc,
    });
    setGuardandoInfoCurso(false);
    if (res.ok) {
      toast.success("Información operativa del curso actualizada.");
      setModalInfoCursoOpen(false);
      await cargar();
    } else {
      toast.error(res.error || "No se pudo actualizar la información del curso.");
    }
  };

  // Cierre de periodo
  const handleCerrarPeriodo = async () => {
    setCerrandoCurso(true);
    const res = await cerrarCursoDocente(cursoId);
    setCerrandoCurso(false);

    if (res.ok) {
      toast.success(`Curso cerrado exitosamente. Se actualizaron ${res.filasAfectadas || 0} actas.`);
      await cargar();
    } else {
      toast.error(res.error || "No se pudo cerrar el curso. Verifica que la malla sume 100%.");
    }
  };

  const handleAbrirEvidencia = async (url: string) => {
    try {
      const signed = await obtenerUrlDescargaEvidencia(url);
      window.open(signed, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("No fue posible abrir el archivo de la evidencia.");
    }
  };

  const handleGuardarNotaEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCalificarEntrega) return;
    const notaNum = Number(modalCalificarEntrega.notaActual);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
      toast.error("La calificación debe estar entre 0.0 y 5.0");
      return;
    }

    setGuardandoNotaEntrega(true);
    const res = await calificarEntrega({
      entregaId: modalCalificarEntrega.entregaId,
      nota: notaNum,
      retroalimentacion: modalCalificarEntrega.retro,
      componenteId: modalCalificarEntrega.componenteId || undefined,
      matriculaId: modalCalificarEntrega.matriculaId || undefined,
    });
    setGuardandoNotaEntrega(false);

    if (res.ok) {
      toast.success(
        modalCalificarEntrega.componenteId
          ? "Entrega calificada y sincronizada con la planilla."
          : "Entrega calificada exitosamente.",
      );
      setModalCalificarEntrega(null);
      await cargar();
    } else {
      toast.error(res.error || "No se pudo asentar la nota de la entrega.");
    }
  };

  const exportarPlanillaCSV = () => {
    if (!data) return;
    const { curso, componentes, estudiantes } = data;

    const headers = [
      "ID Matricula",
      "Estudiante",
      "Documento",
      "Correo",
      "Estado",
      ...componentes.map((c) => `"${c.nombre.replace(/"/g, '""')} (${c.porcentaje}%)"`),
      "Definitiva",
    ];

    const rows = estudiantes.map((e) => {
      const rowNotas = componentes.map((c) => {
        const cal = e.calificaciones[c.id];
        return cal?.nota !== undefined && cal.nota !== null ? cal.nota.toFixed(1) : "";
      });

      return [
        `"${e.matriculaId}"`,
        `"${e.nombreCompleto.replace(/"/g, '""')}"`,
        `"${(e.documento || "").replace(/"/g, '""')}"`,
        `"${(e.email || "").replace(/"/g, '""')}"`,
        `"${e.estado}"`,
        ...rowNotas,
        `"${e.notaDefinitiva !== null && e.notaDefinitiva !== undefined ? e.notaDefinitiva.toFixed(1) : ""}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeCode = (curso.codigo || "curso").replace(/[^a-z0-9_-]/gi, "_");
    link.download = `Planilla_${safeCode}_${curso.periodo || "2026"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Planilla de calificaciones descargada en formato CSV.");
  };

  if (loading) {
    return (
      <DocenteLayout title="Cargando Curso...">
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Loader2 className="size-8 animate-spin text-brand-green mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">Cargando malla y planilla de estudiantes...</p>
        </div>
      </DocenteLayout>
    );
  }

  if (error || !data) {
    return (
      <DocenteLayout title="Error">
        <Alert variant="destructive" className="rounded-2xl max-w-2xl mx-auto">
          <AlertTriangle className="size-5" />
          <AlertTitle>No fue posible abrir el curso</AlertTitle>
          <AlertDescription className="text-xs mt-1">{error || "Curso no encontrado."}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/docente">
              <ArrowLeft className="size-4 mr-2" />
              Volver a Mis Cursos
            </Link>
          </Button>
        </div>
      </DocenteLayout>
    );
  }

  const { curso, componentes, sumaPorcentajes, estudiantes } = data;
  const mallaCompleta = sumaPorcentajes === 100;
  const todasLasEntregas = estudiantes.flatMap((est) =>
    (est.entregas || []).map((ent) => ({
      ...ent,
      estudianteNombre: est.nombreCompleto,
      estudianteEmail: est.email,
      documento: est.documento,
    })),
  );

  return (
    <DocenteLayout
      title={curso.nombre}
      subtitle={`${curso.programaNombre} · Código: ${curso.codigo} · Periodo: ${curso.periodo}`}
      breadcrumbs={[
        { label: "Mis Asignaturas", to: "/docente" },
        { label: curso.codigo },
      ]}
    >
      {/* Barra de Estado de la Malla y Cierre */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 max-w-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand-gold" />
                Malla de Evaluación Ponderada
              </span>
              <span className={`font-mono font-bold ${mallaCompleta ? "text-emerald-700" : "text-amber-700"}`}>
                {sumaPorcentajes}% / 100%
              </span>
            </div>
            <Progress
              value={Math.min(100, sumaPorcentajes)}
              className={`h-2.5 ${mallaCompleta ? "[&>div]:bg-emerald-600" : "[&>div]:bg-amber-500"}`}
            />
            <p className="text-[11px] text-slate-500">
              {mallaCompleta ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Malla completa al 100%. Calificaciones y definitivas listas para asentar.
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {sumaPorcentajes < 100
                    ? `Faltan ${(100 - sumaPorcentajes).toFixed(0)}% por definir para completar el 100% requerido.`
                    : `La malla supera el 100% por ${(sumaPorcentajes - 100).toFixed(0)}%. Ajusta los porcentajes.`}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setInfoHorario(curso.horarioDescripcion || "");
                setInfoAula(curso.aula || "");
                setInfoDesc(curso.descripcion || "");
                setModalInfoCursoOpen(true);
              }}
              className="text-xs font-semibold border-slate-200 hover:bg-slate-50"
            >
              <Settings className="size-3.5 mr-1 text-slate-600" />
              Horario / Aula
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={estudiantes.length === 0}
              onClick={exportarPlanillaCSV}
              className="text-xs font-semibold border-slate-200 hover:bg-slate-50"
            >
              <Download className="size-3.5 mr-1 text-slate-600" />
              Exportar Planilla CSV
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCompEditando(null);
                setCompNombre("");
                setCompPorcentaje(20);
                setCompDesc("");
                setModalCompOpen(true);
              }}
              className="text-xs font-semibold border-slate-200 hover:bg-slate-50"
            >
              <Plus className="size-3.5 mr-1 text-emerald-600" />
              Añadir Componente a la Malla
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={!mallaCompleta || estudiantes.length === 0 || cerrandoCurso}
                  className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold text-xs shadow-xs"
                >
                  {cerrandoCurso ? (
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Lock className="size-3.5 mr-1.5" />
                  )}
                  Cerrar Periodo Académico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-bold text-slate-900">
                    ¿Confirmas el cierre del curso {curso.codigo}?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                    Esta acción evaluará la nota definitiva de cada estudiante frente a la nota mínima ({curso.notaMinimaAprobacion.toFixed(1)}) y asignará automáticamente el estado <strong>Aprobado</strong> o <strong>Reprobado</strong> en las actas de secretaría académica.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-xs">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCerrarPeriodo}
                    className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
                  >
                    Confirmar Cierre de Actas
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Pestañas Principales */}
      <Tabs defaultValue="planilla" className="space-y-6">
        <TabsList className="bg-slate-200/70 p-1 rounded-xl">
          <TabsTrigger value="planilla" className="text-xs font-semibold rounded-lg">
            <Users className="size-3.5 mr-1.5" />
            Planilla de Calificaciones ({estudiantes.length})
          </TabsTrigger>
          <TabsTrigger value="malla" className="text-xs font-semibold rounded-lg">
            <Sparkles className="size-3.5 mr-1.5" />
            Malla y Porcentajes ({componentes.length})
          </TabsTrigger>
          <TabsTrigger value="entregas" className="text-xs font-semibold rounded-lg">
            <FileCheck className="size-3.5 mr-1.5" />
            Entregas y Trabajos ({todasLasEntregas.length})
          </TabsTrigger>
          <TabsTrigger value="observaciones" className="text-xs font-semibold rounded-lg">
            <MessageSquare className="size-3.5 mr-1.5" />
            Seguimiento Pedagógico
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PLANILLA DE CALIFICACIONES INTERACTIVA */}
        <TabsContent value="planilla" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {estudiantes.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No hay estudiantes matriculados en este curso todavía.
              </div>
            ) : componentes.length === 0 ? (
              <div className="p-12 text-center text-slate-600 text-xs space-y-2">
                <AlertCircle className="size-8 mx-auto text-amber-500 mb-2" />
                <p className="font-bold text-sm text-slate-800">Malla sin componentes evaluativos</p>
                <p className="max-w-md mx-auto text-slate-500">
                  Para comenzar a calificar, define primero los componentes evaluativos en la pestaña <strong>"Malla y Porcentajes"</strong> (ej. Parciales, Talleres, Prácticas).
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="text-xs font-bold text-slate-800 min-w-[200px]">
                        Estudiante
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center w-24">
                        Documento
                      </TableHead>
                      {componentes.map((comp) => (
                        <TableHead
                          key={comp.id}
                          className="text-xs font-bold text-slate-800 text-center min-w-[130px]"
                        >
                          <div>{comp.nombre}</div>
                          <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                            {comp.porcentaje}%
                          </span>
                        </TableHead>
                      ))}
                      <TableHead className="text-xs font-bold text-slate-900 text-center bg-slate-100/80 min-w-[110px]">
                        Definitiva Acumulada
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center w-28">
                        Estado
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-right w-24">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estudiantes.map((est) => {
                      const tieneDef = est.notaDefinitiva != null;
                      const aprueba = tieneDef && est.notaDefinitiva! >= curso.notaMinimaAprobacion;

                      return (
                        <TableRow key={est.matriculaId} className="hover:bg-slate-50/60 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-7 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-bold text-[11px] shrink-0">
                                {(est.nombreCompleto?.[0] || "E").toUpperCase()}
                              </div>
                              <div className="truncate">
                                <p className="font-semibold text-xs text-slate-900 truncate">
                                  {est.nombreCompleto}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">{est.email}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs font-mono text-center text-slate-600">
                            {est.documento || "—"}
                          </TableCell>

                          {/* Celdas de Calificaciones */}
                          {componentes.map((comp) => {
                            const cal = est.calificaciones[comp.id];
                            const notaValor = cal ? cal.nota : null;

                            return (
                              <TableCell key={comp.id} className="text-center p-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCalificandoEstudiante({
                                      matriculaId: est.matriculaId,
                                      nombreEstudiante: est.nombreCompleto,
                                      componente: comp,
                                      notaActual: notaValor != null ? notaValor : "",
                                      retro: cal?.retroalimentacion || "",
                                    })
                                  }
                                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                                    notaValor != null
                                      ? notaValor >= curso.notaMinimaAprobacion
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400"
                                        : "bg-red-50 text-red-800 border-red-200 hover:border-red-400"
                                      : "bg-slate-50 text-slate-400 border-dashed border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                                  }`}
                                  title="Haz clic para asentar o modificar calificación"
                                  aria-label={`Calificar ${comp.nombre} (${comp.porcentaje}%) para ${est.nombreCompleto}. Nota actual: ${
                                    notaValor != null ? notaValor.toFixed(1) : "sin calificar"
                                  }`}
                                >
                                  {notaValor != null ? notaValor.toFixed(1) : "+ Asignar"}
                                </button>
                              </TableCell>
                            );
                          })}

                          {/* Nota Definitiva Calculada Automáticamente */}
                          <TableCell className="text-center font-bold bg-slate-100/50">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                                tieneDef
                                  ? aprueba
                                    ? "bg-emerald-600 text-white"
                                    : "bg-destructive text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {tieneDef ? est.notaDefinitiva!.toFixed(2) : "Pendiente"}
                            </span>
                          </TableCell>

                          {/* Estado */}
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`capitalize text-[10px] font-semibold ${
                                est.estado === "aprobado"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : est.estado === "reprobado"
                                    ? "bg-red-50 text-red-800 border-red-300"
                                    : "bg-blue-50 text-blue-800 border-blue-200"
                              }`}
                            >
                              {est.estado}
                            </Badge>
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setModalObsEst(est);
                                setObsEditando(null);
                                setObsTipo("seguimiento");
                                setObsTitulo("");
                                setObsDetalle("");
                              }}
                              className="size-8 p-0 text-slate-500 hover:text-brand-green"
                              title="Registrar observación académica"
                            >
                              <MessageSquare className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: MALLA DE EVALUACIÓN Y PORCENTAJES */}
        <TabsContent value="malla" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Esquema Curricular de Evaluación (Malla)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los componentes determinan la ponderación de las notas de los estudiantes. Deben sumar exactamente el 100%.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setCompEditando(null);
                  setCompNombre("");
                  setCompPorcentaje(20);
                  setCompDesc("");
                  setModalCompOpen(true);
                }}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                <Plus className="size-3.5 mr-1" />
                Nuevo Componente
              </Button>
            </div>

            {componentes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Aún no has configurado la malla evaluativa de este curso.
              </div>
            ) : (
              <div className="space-y-3">
                {componentes.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors bg-slate-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{comp.nombre}</h4>
                          <Badge className="bg-emerald-600 text-white text-[11px] font-mono font-bold">
                            {comp.porcentaje}%
                          </Badge>
                        </div>
                        {comp.descripcion && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {comp.descripcion}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCompEditando(comp);
                          setCompNombre(comp.nombre);
                          setCompPorcentaje(comp.porcentaje);
                          setCompDesc(comp.descripcion || "");
                          setModalCompOpen(true);
                        }}
                        className="size-8 p-0 text-slate-500 hover:text-slate-900"
                        title="Editar componente"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarComponente(comp.id, comp.nombre)}
                        className="size-8 p-0 text-slate-500 hover:text-destructive"
                        title="Eliminar componente"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 3: SEGUIMIENTO PEDAGÓGICO Y OBSERVACIONES */}
        <TabsContent value="observaciones" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Bitácora de Observaciones y Acompañamiento
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Registro histórico de felicitaciones, alertas académicas y notas de asistencia visibles para los estudiantes en su expediente.
            </p>

            {estudiantes.every((e) => e.observaciones.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No hay observaciones registradas en este curso todavía. Usa el botón de mensaje en la planilla para añadir una.
              </div>
            ) : (
              <div className="space-y-4">
                {estudiantes.map((est) =>
                  est.observaciones.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {est.nombreCompleto}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold capitalize ${
                              obs.tipo === "felicitacion"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : obs.tipo === "alerta_academica"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {obs.tipo.replace("_", " ")}
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            {new Date(obs.createdAt).toLocaleDateString("es-CO")}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-slate-800">{obs.titulo}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{obs.detalle}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setModalObsEst(est);
                            setObsEditando(obs);
                            setObsTipo(obs.tipo);
                            setObsTitulo(obs.titulo);
                            setObsDetalle(obs.detalle);
                          }}
                          className="size-8 p-0 text-slate-500 hover:text-slate-900"
                          title="Editar observación"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarObservacion(obs.id, obs.titulo)}
                          className="size-8 p-0 text-slate-500 hover:text-destructive"
                          title="Eliminar observación"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )),
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 4: ENTREGAS Y TRABAJOS DE ESTUDIANTES */}
        <TabsContent value="entregas" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Evidencias y Trabajos Entregados por Estudiantes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Revisa los archivos adjuntos en el repositorio seguro, califica y envía retroalimentación al estudiante.
                </p>
              </div>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono text-xs w-fit">
                {todasLasEntregas.length} entrega{todasLasEntregas.length === 1 ? "" : "s"}
              </Badge>
            </div>

            {todasLasEntregas.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <FileText className="size-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Sin evidencias entregadas</p>
                <p className="text-slate-400 mt-1">Los estudiantes matriculados aún no han cargado tareas o talleres en este módulo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="text-xs font-bold text-slate-800">Estudiante</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800">Trabajo / Evidencia</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center">Fecha Entrega</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center">Archivo Adjunto</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center">Estado</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-center">Nota</TableHead>
                      <TableHead className="text-xs font-bold text-slate-800 text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todasLasEntregas.map((entrega) => (
                      <TableRow key={entrega.id} className="hover:bg-slate-50/70 text-xs">
                        <TableCell>
                          <div className="font-semibold text-slate-900">{entrega.estudianteNombre}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {entrega.documento || entrega.estudianteEmail}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{entrega.titulo}</div>
                          {entrega.descripcion && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 max-w-sm">
                              {entrega.descripcion}
                            </p>
                          )}
                          {entrega.retroalimentacion && (
                            <p className="text-[10px] text-emerald-800 bg-emerald-50 rounded px-1.5 py-0.5 mt-1 border border-emerald-200 w-fit">
                              Retro: {entrega.retroalimentacion}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono text-[11px] text-slate-500">
                          {new Date(entrega.fechaEntrega).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAbrirEvidencia(entrega.archivoUrl)}
                            className="text-xs text-brand-green hover:text-brand-green-deep hover:bg-emerald-50 h-8 px-2"
                          >
                            <ExternalLink className="size-3.5 mr-1" />
                            Ver Archivo
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-semibold ${
                              entrega.estado === "calificado"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {entrega.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-slate-900">
                          {entrega.nota !== null && entrega.nota !== undefined
                            ? entrega.nota.toFixed(1)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setModalCalificarEntrega({
                                entregaId: entrega.id,
                                matriculaId: entrega.matriculaId,
                                estudianteNombre: entrega.estudianteNombre,
                                titulo: entrega.titulo,
                                notaActual: entrega.nota !== null && entrega.nota !== undefined ? entrega.nota : "",
                                retro: entrega.retroalimentacion || "",
                                componenteId: "",
                              })
                            }
                            className="text-xs font-semibold h-8"
                          >
                            {entrega.estado === "calificado" ? "Modificar Nota" : "Calificar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIÁLOGO: CREAR / EDITAR COMPONENTE DE LA MALLA */}
      <Dialog open={modalCompOpen} onOpenChange={setModalCompOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {compEditando ? "Editar Componente Evaluativo" : "Nuevo Componente en la Malla"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Define el nombre de la evaluación (parcial, taller, quiz) y su porcentaje sobre la nota final.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGuardarComponente} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nombre de la Evaluación</Label>
              <Input
                placeholder="Ej. Primer Parcial Teórico"
                value={compNombre}
                onChange={(e) => setCompNombre(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Porcentaje (%)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                step="1"
                value={compPorcentaje}
                onChange={(e) => setCompPorcentaje(Number(e.target.value))}
                required
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-slate-500">
                La suma actual es {sumaPorcentajes}%.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descripción o Criterios (Opcional)</Label>
              <Textarea
                placeholder="Indica temas a evaluar o guías requeridas..."
                value={compDesc}
                onChange={(e) => setCompDesc(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalCompOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={guardandoComp}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                {guardandoComp ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <Save className="size-3.5 mr-1" />}
                Guardar Componente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: ASENTAR CALIFICACIÓN */}
      <Dialog
        open={Boolean(calificandoEstudiante)}
        onOpenChange={(open) => !open && setCalificandoEstudiante(null)}
      >
        <DialogContent className="rounded-2xl max-w-md">
          {calificandoEstudiante && (
            <form onSubmit={handleGuardarNota} className="space-y-4">
              <DialogHeader>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 w-fit mb-1 border border-emerald-200">
                  <Award className="size-3 text-emerald-600" />
                  <span>{calificandoEstudiante.componente.nombre} ({calificandoEstudiante.componente.porcentaje}%)</span>
                </div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Calificar a {calificandoEstudiante.nombreEstudiante}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Ingresa la valoración del 0.0 al 5.0. La nota definitiva del curso se recalculará automáticamente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Calificación Obtenida (0.0 - 5.0)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  autoFocus
                  value={calificandoEstudiante.notaActual}
                  onChange={(e) =>
                    setCalificandoEstudiante({
                      ...calificandoEstudiante,
                      notaActual: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                  placeholder="Ej. 4.5"
                  className="text-lg font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Retroalimentación / Comentarios para el Estudiante</Label>
                <Textarea
                  placeholder="Comentarios pedagógicos sobre el desempeño..."
                  value={calificandoEstudiante.retro}
                  onChange={(e) =>
                    setCalificandoEstudiante({
                      ...calificandoEstudiante,
                      retro: e.target.value,
                    })
                  }
                  rows={3}
                  className="text-xs"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCalificandoEstudiante(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={guardandoNota}
                  className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
                >
                  {guardandoNota ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <Save className="size-3.5 mr-1" />}
                  Asentar Calificación
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: NUEVA / EDITAR OBSERVACIÓN PEDAGÓGICA */}
      <Dialog
        open={Boolean(modalObsEst)}
        onOpenChange={(open) => {
          if (!open) {
            setModalObsEst(null);
            setObsEditando(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl max-w-md">
          {modalObsEst && (
            <form onSubmit={handleGuardarObservacion} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900">
                  {obsEditando ? "Editar Observación Pedagógica" : "Nueva Observación Pedagógica"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Estudiante: <strong>{modalObsEst.nombreCompleto}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tipo de Registro</Label>
                <select
                  value={obsTipo}
                  onChange={(e) => setObsTipo(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="seguimiento">Seguimiento Pedagógico</option>
                  <option value="felicitacion">Felicitación / Reconocimiento</option>
                  <option value="alerta_academica">Alerta Académica / Riesgo</option>
                  <option value="asistencia">Novedad de Asistencia</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Título del Registro</Label>
                <Input
                  placeholder="Ej. Destacada participación en simulación"
                  value={obsTitulo}
                  onChange={(e) => setObsTitulo(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Detalle y Recomendaciones</Label>
                <Textarea
                  placeholder="Escribe el seguimiento correspondiente..."
                  value={obsDetalle}
                  onChange={(e) => setObsDetalle(e.target.value)}
                  rows={4}
                  required
                  className="text-xs"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setModalObsEst(null);
                    setObsEditando(null);
                  }}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={guardandoObs}
                  className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
                >
                  {guardandoObs ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <Save className="size-3.5 mr-1" />}
                  {obsEditando ? "Actualizar Observación" : "Guardar Observación"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: CALIFICAR ENTREGA DE TRABAJO */}
      <Dialog
        open={Boolean(modalCalificarEntrega)}
        onOpenChange={(open) => !open && setModalCalificarEntrega(null)}
      >
        <DialogContent className="rounded-2xl max-w-md">
          {modalCalificarEntrega && (
            <form onSubmit={handleGuardarNotaEntrega} className="space-y-4">
              <DialogHeader>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 w-fit mb-1 border border-emerald-200">
                  <FileCheck className="size-3 text-emerald-600" />
                  <span>Calificación de Entrega</span>
                </div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  {modalCalificarEntrega.estudianteNombre}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Trabajo: <strong>{modalCalificarEntrega.titulo}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Calificación Obtenida (0.0 - 5.0) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  autoFocus
                  value={modalCalificarEntrega.notaActual}
                  onChange={(e) =>
                    setModalCalificarEntrega({
                      ...modalCalificarEntrega,
                      notaActual: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                  placeholder="Ej. 4.5"
                  className="text-lg font-mono font-bold"
                />
              </div>

              {componentes.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Vincular a Componente de la Planilla (Opcional)
                  </Label>
                  <select
                    value={modalCalificarEntrega.componenteId}
                    onChange={(e) =>
                      setModalCalificarEntrega({
                        ...modalCalificarEntrega,
                        componenteId: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    <option value="">-- Solo calificar la evidencia (No sincronizar a planilla) --</option>
                    {componentes.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.nombre} ({comp.porcentaje}%)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500">
                    Si seleccionas un componente, esta nota se asentará también en la columna correspondiente del estudiante.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Retroalimentación / Comentarios para el Estudiante</Label>
                <Textarea
                  placeholder="Comentarios pedagógicos sobre el trabajo presentado..."
                  value={modalCalificarEntrega.retro}
                  onChange={(e) =>
                    setModalCalificarEntrega({
                      ...modalCalificarEntrega,
                      retro: e.target.value,
                    })
                  }
                  rows={3}
                  className="text-xs"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalCalificarEntrega(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={guardandoNotaEntrega}
                  className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
                >
                  {guardandoNotaEntrega ? (
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                  ) : (
                    <Save className="size-3.5 mr-1" />
                  )}
                  Guardar Calificación
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: CONFIGURACIÓN OPERATIVA DEL CURSO */}
      <Dialog open={modalInfoCursoOpen} onOpenChange={setModalInfoCursoOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <form onSubmit={handleGuardarInfoCurso} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                Información Operativa del Curso
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Actualiza el horario, salón o indicaciones generales visibles para los estudiantes matriculados.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Horario de Clases</Label>
              <Input
                placeholder="Ej. Sábados 8:00 AM - 12:00 PM"
                value={infoHorario}
                onChange={(e) => setInfoHorario(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Aula / Enlace Virtual</Label>
              <Input
                placeholder="Ej. Laboratorio 204 / Campus Virtual"
                value={infoAula}
                onChange={(e) => setInfoAula(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descripción / Indicaciones del Módulo</Label>
              <Textarea
                placeholder="Objetivos, metodología o materiales requeridos para las sesiones..."
                value={infoDesc}
                onChange={(e) => setInfoDesc(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalInfoCursoOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={guardandoInfoCurso}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                {guardandoInfoCurso ? (
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                ) : (
                  <Save className="size-3.5 mr-1" />
                )}
                Guardar Información
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DocenteLayout>
  );
}
