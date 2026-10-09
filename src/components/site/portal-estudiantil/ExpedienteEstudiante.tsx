import { useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  FileUp,
  GraduationCap,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  UploadCloud,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import {
  subirEntregaTrabajo,
  type MatriculaEstudiante,
  type EvaluacionNota,
  type ObservacionAcademica,
} from "@/services/academico";

interface ExpedienteEstudianteProps {
  matriculas: MatriculaEstudiante[];
  onRefresh?: () => void;
}

export function ExpedienteEstudiante({ matriculas, onRefresh }: ExpedienteEstudianteProps) {
  const { user, profile, signOut } = useAuth();
  const [matriculaSeleccionadaId, setMatriculaSeleccionadaId] = useState<string>(
    matriculas[0]?.id || "",
  );

  const matriculaActiva =
    matriculas.find((m) => m.id === matriculaSeleccionadaId) || matriculas[0];

  // Cálculos estadísticos
  const totalCursos = matriculas.length;
  const cursosAprobados = matriculas.filter((m) => m.estado === "aprobado").length;
  const cursosEnCurso = matriculas.filter((m) => m.estado === "cursando").length;

  return (
    <div className="space-y-8">
      {/* Resumen Superior del Estudiante */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green border border-brand-green/20 shrink-0">
              <UserIcon className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-foreground">
                  {profile?.nombre_completo || "Estudiante FUNASF"}
                </h2>
                <Badge variant="outline" className="bg-brand-green/10 text-brand-green-deep border-brand-green/30 text-[11px]">
                  Activo
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.email || "estudiante@edufunasf.org"} &bull; Código ID: {profile?.id?.slice(0, 8) || "FUN-2026"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-xl bg-muted/50 px-4 py-2 text-center border border-border/60">
                <span className="block text-lg font-bold text-foreground">{cursosEnCurso}</span>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Cursando</span>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-2 text-center border border-border/60">
                <span className="block text-lg font-bold text-foreground">{cursosAprobados}</span>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Aprobados</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="size-3.5 mr-1.5" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      {matriculas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <GraduationCap className="size-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No tienes asignaturas registradas aún</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
            Si acabas de legalizar tu matrícula, la secretaría académica estará asignando tus módulos en las próximas 24 horas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selector de Asignaturas si hay varias */}
          {matriculas.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {matriculas.map((mat) => {
                const isSelected = mat.id === matriculaActiva?.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setMatriculaSeleccionadaId(mat.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border ${
                      isSelected
                        ? "bg-brand-green text-white border-brand-green"
                        : "bg-card text-muted-foreground hover:text-foreground border-border/70"
                    }`}
                  >
                    {mat.curso.nombre} ({mat.curso.codigo})
                  </button>
                );
              })}
            </div>
          )}

          {matriculaActiva && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Columna Izquierda: Detalle del Curso y Calificaciones */}
              <div className="lg:col-span-8 space-y-6">
                {/* Cabecera del Curso */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold-deep">
                        {matriculaActiva.curso.programaNombre}
                      </span>
                      <h3 className="text-xl font-bold font-display text-foreground mt-1">
                        {matriculaActiva.curso.nombre}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3.5 text-brand-green" />
                          Código: {matriculaActiva.curso.codigo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-brand-green" />
                          Periodo: {matriculaActiva.curso.periodo}
                        </span>
                        {matriculaActiva.curso.aula && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-brand-green" />
                            {matriculaActiva.curso.aula}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-muted/40 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Nota Definitiva
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          (matriculaActiva.notaDefinitiva ?? 0) >= 3.0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {matriculaActiva.notaDefinitiva != null
                          ? matriculaActiva.notaDefinitiva.toFixed(1)
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabla de Evaluaciones Parciales */}
                <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
                  <div className="border-b border-border/80 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Calificaciones y Parciales</h4>
                      <p className="text-[11px] text-muted-foreground">Registro de valoraciones oficiales</p>
                    </div>
                  </div>

                  {matriculaActiva.notas.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      Aún no se han registrado notas evaluativas para este módulo.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Actividad / Evaluación</TableHead>
                          <TableHead className="text-xs text-center w-24">Peso (%)</TableHead>
                          <TableHead className="text-xs text-center w-24">Calificación</TableHead>
                          <TableHead className="text-xs">Retroalimentación docente</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matriculaActiva.notas.map((nota) => (
                          <TableRow key={nota.id}>
                            <TableCell className="text-xs font-medium text-foreground">
                              {nota.titulo}
                            </TableCell>
                            <TableCell className="text-xs text-center text-muted-foreground">
                              {nota.porcentaje}%
                            </TableCell>
                            <TableCell className="text-xs text-center font-bold">
                              <span
                                className={`inline-block rounded-md px-2 py-0.5 ${
                                  nota.nota >= 3.0
                                    ? "bg-emerald-500/10 text-emerald-600 font-semibold"
                                    : "bg-destructive/10 text-destructive font-semibold"
                                }`}
                              >
                                {nota.nota.toFixed(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {nota.retroalimentacion || "Sin comentarios adicionales"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                {/* Sección de Entregas de Trabajos y Evidencias */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <FileCheck className="size-4 text-brand-green" />
                        Evidencias y Trabajos Prácticos
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Sube tus archivos de tareas y consulta el estado de revisión.
                      </p>
                    </div>

                    <SubirEvidenciaDialog
                      matriculaId={matriculaActiva.id}
                      onSuccess={() => onRefresh?.()}
                    />
                  </div>

                  {matriculaActiva.entregas.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                      No has subido evidencias o entregas para esta asignatura.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matriculaActiva.entregas.map((entrega) => (
                        <div
                          key={entrega.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3.5 text-xs"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-foreground block">
                              {entrega.titulo}
                            </span>
                            {entrega.descripcion && (
                              <p className="text-muted-foreground text-[11px]">
                                {entrega.descripcion}
                              </p>
                            )}
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />
                              Entregado el: {new Date(entrega.fechaEntrega).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-semibold ${
                                entrega.estado === "calificado"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              }`}
                            >
                              {entrega.estado}
                            </Badge>
                            {entrega.nota != null && (
                              <span className="font-bold text-foreground">
                                Nota: {entrega.nota.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Observaciones y Asistencia */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-brand-green font-semibold text-sm">
                    <MessageSquare className="size-4" />
                    <span>Observaciones y Novedades</span>
                  </div>

                  {matriculaActiva.observaciones.length === 0 ? (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No hay alertas ni novedades reportadas por tu docente o coordinación.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {matriculaActiva.observaciones.map((obs) => (
                        <div
                          key={obs.id}
                          className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">{obs.titulo}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(obs.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-[11px]">
                            {obs.detalle}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-brand-cream/50 border border-brand-gold/30 p-6 space-y-2">
                  <div className="flex items-center gap-2 text-brand-gold-deep font-semibold text-sm">
                    <Award className="size-4" />
                    <span>Progreso del Módulo</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Recuerda que para aprobar debes cumplir con un mínimo del 80% de asistencia y una calificación definitiva igual o superior a 3.0.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubirEvidenciaDialog({
  matriculaId,
  onSuccess,
}: {
  matriculaId: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      setErrorMsg("Debes seleccionar un archivo para adjuntar.");
      return;
    }

    setSubiendo(true);
    setErrorMsg(null);

    const res = await subirEntregaTrabajo({
      matriculaId,
      titulo,
      descripcion: descripcion || undefined,
      archivo,
    });

    setSubiendo(false);
    if (res.ok) {
      setOpen(false);
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      onSuccess?.();
    } else {
      setErrorMsg(res.error || "No se pudo subir la evidencia.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-brand-green hover:bg-brand-green-deep text-white text-xs">
          <UploadCloud className="size-3.5 mr-1.5" />
          Subir Evidencia
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
            <FileUp className="size-4 text-brand-green" />
            Cargar Trabajo o Evidencia
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Adjunta tu archivo en formato PDF, Word o imagen (máximo 15MB).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="evi-titulo" className="text-xs font-semibold">
              Título de la tarea o práctica *
            </Label>
            <Input
              id="evi-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Taller Práctico de Signos Vitales"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="evi-desc" className="text-xs font-semibold">
              Descripción o comentarios (opcional)
            </Label>
            <Textarea
              id="evi-desc"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Anotaciones para el docente..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="evi-file" className="text-xs font-semibold">
              Archivo adjunto *
            </Label>
            <Input
              id="evi-file"
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              required
              className="h-9 text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={subiendo}
            className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold h-10 text-xs shadow-xs"
          >
            {subiendo ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Subiendo archivo...
              </>
            ) : (
              "Confirmar entrega de evidencia"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
