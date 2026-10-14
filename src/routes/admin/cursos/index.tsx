import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { createSeoMeta } from "@/lib/seo";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cursos/")({
  head: () =>
    createSeoMeta({
      title: "Gestión de Cursos y Matrículas | FUNASF Admin",
      description: "Panel de administración académica para gestión de cursos, docentes y matrículas de estudiantes.",
      noindex: true,
      canonicalPath: "/admin/cursos",
    }),
  component: AdminCursosPage,
});

interface CursoAdmin {
  id: string;
  nombre: string;
  codigo: string;
  periodo: string;
  horario_descripcion: string | null;
  aula: string | null;
  activo: boolean;
  nota_minima_aprobacion: number;
  programa_id: string;
  programa_nombre?: string;
  docente_id: string | null;
  docente_nombre?: string;
  matriculas_count?: number;
}

interface DocenteOption {
  id: string;
  nombre_completo: string | null;
}

interface EstudianteOption {
  id: string;
  nombre_completo: string | null;
  email: string;
  usuario: string | null;
  documento: string | null;
}

function AdminCursosPage() {
  const { isConfigured } = useAuth();
  const [cursos, setCursos] = useState<CursoAdmin[]>([]);
  const [docentes, setDocentes] = useState<DocenteOption[]>([]);
  const [programas, setProgramas] = useState<Array<{ id: string; nombre: string }>>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Crear Curso
  const [modalCursoOpen, setModalCursoOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [nuevoPeriodo, setNuevoPeriodo] = useState("2026-1");
  const [nuevoProgramaId, setNuevoProgramaId] = useState("");
  const [nuevoDocenteId, setNuevoDocenteId] = useState("");
  const [nuevoHorario, setNuevoHorario] = useState("");
  const [nuevoAula, setNuevoAula] = useState("");
  const [guardandoCurso, setGuardandoCurso] = useState(false);

  // Modal Matricular Estudiante
  const [modalMatriculaOpen, setModalMatriculaOpen] = useState(false);
  const [cursoParaMatricula, setCursoParaMatricula] = useState<CursoAdmin | null>(null);
  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState("");
  const [matriculando, setMatriculando] = useState(false);

  // Modal Ver Estudiantes Matriculados
  const [modalVerEstudiantesOpen, setModalVerEstudiantesOpen] = useState(false);
  const [cursoViendo, setCursoViendo] = useState<CursoAdmin | null>(null);
  const [estudiantesCurso, setEstudiantesCurso] = useState<any[]>([]);
  const [cargandoEstudiantesCurso, setCargandoEstudiantesCurso] = useState(false);

  const cargarDatos = async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      // 1. Cargar programas y docentes
      const [progRes, docRes, estRes, curRes] = await Promise.all([
        supabase.from("programas").select("id, nombre").order("nombre"),
        supabase.from("perfiles").select("id, nombre_completo").eq("rol", "docente").order("nombre_completo"),
        supabase.from("perfiles").select("id, nombre_completo, email, usuario, documento").eq("rol", "estudiante").order("nombre_completo"),
        supabase.from("cursos").select("*, programas(nombre), perfiles(nombre_completo), matriculas(count)").order("created_at", { ascending: false }),
      ]);

      setProgramas(progRes.data || []);
      setDocentes(docRes.data || []);
      setEstudiantes(estRes.data || []);

      const list: CursoAdmin[] = (curRes.data || []).map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        codigo: c.codigo,
        periodo: c.periodo,
        horario_descripcion: c.horario_descripcion,
        aula: c.aula,
        activo: c.activo,
        nota_minima_aprobacion: Number(c.nota_minima_aprobacion ?? 3.0),
        programa_id: c.programa_id,
        programa_nombre: c.programas?.nombre,
        docente_id: c.docente_id,
        docente_nombre: c.perfiles?.nombre_completo,
        matriculas_count: c.matriculas?.[0]?.count ?? 0,
      }));

      setCursos(list);
      if (progRes.data?.[0] && !nuevoProgramaId) {
        setNuevoProgramaId(progRes.data[0].id);
      }
    } catch (err) {
      console.error("Error cargando cursos:", err);
      toast.error("No se pudieron cargar los datos de cursos y matrículas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [isConfigured]);

  const handleCrearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoCodigo.trim() || !nuevoProgramaId) {
      toast.error("Por favor completa los campos requeridos.");
      return;
    }

    setGuardandoCurso(true);
    try {
      const { error } = await supabase.from("cursos").insert({
        nombre: nuevoNombre.trim(),
        codigo: nuevoCodigo.trim().toUpperCase(),
        periodo: nuevoPeriodo.trim(),
        programa_id: nuevoProgramaId,
        docente_id: nuevoDocenteId || null,
        horario_descripcion: nuevoHorario.trim() || null,
        aula: nuevoAula.trim() || null,
        activo: true,
      });

      if (error) {
        toast.error("Error al crear curso: " + error.message);
      } else {
        toast.success("Curso creado exitosamente.");
        setModalCursoOpen(false);
        setNuevoNombre("");
        setNuevoCodigo("");
        setNuevoHorario("");
        setNuevoAula("");
        await cargarDatos();
      }
    } catch (err: any) {
      toast.error(err.message || "Error inesperado.");
    } finally {
      setGuardandoCurso(false);
    }
  };

  const handleMatricularEstudiante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoParaMatricula || !estudianteSeleccionadoId) {
      toast.error("Selecciona un estudiante.");
      return;
    }

    setMatriculando(true);
    try {
      const { error } = await supabase.from("matriculas").insert({
        curso_id: cursoParaMatricula.id,
        estudiante_id: estudianteSeleccionadoId,
        estado: "cursando",
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Este estudiante ya se encuentra matriculado en este curso.");
        } else {
          toast.error("Error al matricular: " + error.message);
        }
      } else {
        toast.success("Estudiante matriculado exitosamente en " + cursoParaMatricula.codigo);
        setModalMatriculaOpen(false);
        setEstudianteSeleccionadoId("");
        await cargarDatos();
      }
    } catch (err: any) {
      toast.error(err.message || "Error al matricular.");
    } finally {
      setMatriculando(false);
    }
  };

  const abrirVerEstudiantes = async (c: CursoAdmin) => {
    setCursoViendo(c);
    setModalVerEstudiantesOpen(true);
    setCargandoEstudiantesCurso(true);
    try {
      const { data, error } = await supabase
        .from("matriculas")
        .select("id, estado, nota_definitiva, perfiles:estudiante_id(id, nombre_completo, email, documento, usuario)")
        .eq("curso_id", c.id);

      if (error) {
        toast.error("Error al cargar lista de estudiantes: " + error.message);
      } else if (data) {
        setEstudiantesCurso(data);
      }
    } finally {
      setCargandoEstudiantesCurso(false);
    }
  };

  const handleDesmatricular = async (matriculaId: string, nombre: string) => {
    if (!confirm(`¿Desmatricular a ${nombre} de este curso?`)) return;
    try {
      const { error } = await supabase.from("matriculas").delete().eq("id", matriculaId);
      if (error) {
        toast.error("Error al retirar: " + error.message);
      } else {
        toast.success("Estudiante desmatriculado.");
        setEstudiantesCurso((prev) => prev.filter((m) => m.id !== matriculaId));
        await cargarDatos();
      }
    } catch (err: any) {
      toast.error(err.message || "Error al retirar.");
    }
  };

  return (
    <AdminLayout
      title="Gestión de Cursos y Matrículas Académicas"
      subtitle="Crea asignaturas, vincula a los docentes a cargo y gestiona las listas de estudiantes matriculados."
    >
      {/* Botón de Creación */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Asignaturas y Cursos Abiertos</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Los cursos creados aquí estarán inmediatamente disponibles en el portal del docente asignado y en el expediente del estudiante matriculado.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setModalCursoOpen(true)}
          className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold shrink-0 shadow-xs"
        >
          <Plus className="size-3.5 mr-1.5" />
          Nuevo Curso
        </Button>
      </div>

      {/* Tabla de Cursos */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70">
              <TableHead className="text-xs font-bold text-slate-800">Código / Asignatura</TableHead>
              <TableHead className="text-xs font-bold text-slate-800">Programa Académico</TableHead>
              <TableHead className="text-xs font-bold text-slate-800">Docente a Cargo</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-center">Periodo / Horario</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-center">Matriculados</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                  <Loader2 className="size-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  Cargando catálogo de cursos...
                </TableCell>
              </TableRow>
            ) : cursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                  Aún no se han registrado cursos. Haz clic en "Nuevo Curso" para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              cursos.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {c.codigo}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{c.nombre}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600">
                    {c.programa_nombre || "Programa General"}
                  </TableCell>

                  <TableCell className="text-xs">
                    {c.docente_nombre ? (
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="size-3.5 text-blue-600" />
                        {c.docente_nombre}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Sin docente asignado</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center text-xs text-slate-600">
                    <Badge variant="outline" className="text-[10px] bg-slate-50">
                      {c.periodo}
                    </Badge>
                    {c.horario_descripcion && (
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                        {c.horario_descripcion}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => abrirVerEstudiantes(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Ver estudiantes matriculados"
                      aria-label={`Ver ${c.matriculas_count || 0} estudiantes matriculados en ${c.codigo}`}
                    >
                      <Users className="size-3 text-emerald-600" />
                      <span>{c.matriculas_count || 0}</span>
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCursoParaMatricula(c);
                          setModalMatriculaOpen(true);
                        }}
                        className="text-xs h-7 px-2 font-semibold border-slate-200 hover:bg-emerald-50 hover:text-emerald-800"
                        title="Matricular un estudiante en este curso"
                      >
                        <UserPlus className="size-3 mr-1" />
                        Matricular
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIÁLOGO: CREAR CURSO */}
      <Dialog open={modalCursoOpen} onOpenChange={setModalCursoOpen}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Crear Nueva Asignatura / Curso
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Define la asignatura, su código institucional y el docente titular responsable.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCrearCurso} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Programa Académico</Label>
              <select
                value={nuevoProgramaId}
                onChange={(e) => setNuevoProgramaId(e.target.value)}
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {programas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold">Nombre de la Asignatura</Label>
                <Input
                  placeholder="Ej. Farmacología Básica"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Código</Label>
                <Input
                  placeholder="ENF-201"
                  value={nuevoCodigo}
                  onChange={(e) => setNuevoCodigo(e.target.value)}
                  required
                  className="text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Docente Titular</Label>
                <select
                  value={nuevoDocenteId}
                  onChange={(e) => setNuevoDocenteId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="">-- Sin docente asignado --</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Periodo Académico</Label>
                <Input
                  value={nuevoPeriodo}
                  onChange={(e) => setNuevoPeriodo(e.target.value)}
                  placeholder="2026-1"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Horario</Label>
                <Input
                  placeholder="Sábados 8:00 AM - 1:00 PM"
                  value={nuevoHorario}
                  onChange={(e) => setNuevoHorario(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Aula / Sede</Label>
                <Input
                  placeholder="Sede Cali - Aula 102"
                  value={nuevoAula}
                  onChange={(e) => setNuevoAula(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalCursoOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={guardandoCurso}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                {guardandoCurso ? (
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                ) : (
                  <Plus className="size-3.5 mr-1" />
                )}
                Crear Curso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: MATRICULAR ESTUDIANTE */}
      <Dialog open={modalMatriculaOpen} onOpenChange={setModalMatriculaOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          {cursoParaMatricula && (
            <form onSubmit={handleMatricularEstudiante} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Matricular Estudiante en {cursoParaMatricula.codigo}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {cursoParaMatricula.nombre} ({cursoParaMatricula.periodo})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Seleccionar Estudiante</Label>
                <select
                  value={estudianteSeleccionadoId}
                  onChange={(e) => setEstudianteSeleccionadoId(e.target.value)}
                  required
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="">-- Selecciona un estudiante registrado --</option>
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre_completo} {est.documento ? `(CC ${est.documento})` : ""} - @{est.usuario || est.email}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  ¿No encuentras al estudiante? Primero regístralo en la sección de <strong>Usuarios</strong>.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMatriculaOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={matriculando}
                  className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
                >
                  {matriculando ? (
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                  ) : (
                    <UserPlus className="size-3.5 mr-1" />
                  )}
                  Confirmar Matrícula
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: VER ESTUDIANTES MATRICULADOS */}
      <Dialog open={modalVerEstudiantesOpen} onOpenChange={setModalVerEstudiantesOpen}>
        <DialogContent className="rounded-2xl max-w-xl">
          {cursoViendo && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Estudiantes Matriculados en {cursoViendo.codigo}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {cursoViendo.nombre} · Total: {estudiantesCurso.length} inscritos
                </DialogDescription>
              </DialogHeader>

              {cargandoEstudiantesCurso ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <Loader2 className="size-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  Consultando actas...
                </div>
              ) : estudiantesCurso.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No hay estudiantes matriculados en este curso todavía.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 text-xs">
                        <TableHead>Estudiante</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center">Definitiva</TableHead>
                        <TableHead className="text-right">Retirar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estudiantesCurso.map((m: any) => {
                        const p = m.perfiles || {};
                        return (
                          <TableRow key={m.id} className="text-xs">
                            <TableCell>
                              <div className="font-semibold text-slate-900">{p.nombre_completo || "Estudiante"}</div>
                              <div className="text-[10px] text-slate-500">
                                {p.documento ? `CC ${p.documento} · ` : ""}
                                @{p.usuario || p.email}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {m.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold">
                              {m.nota_definitiva != null ? Number(m.nota_definitiva).toFixed(2) : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDesmatricular(m.id, p.nombre_completo)}
                                className="size-7 p-0 text-slate-400 hover:text-destructive"
                                title="Desmatricular estudiante"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalVerEstudiantesOpen(false)}
                  className="text-xs"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
