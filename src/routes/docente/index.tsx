import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { createSeoMeta } from "@/lib/seo";
import { useAuth } from "@/lib/auth-context";
import { getCursosDocente, type Curso } from "@/services/academico";
import { DocenteLayout } from "@/components/docente/DocenteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/docente/")({
  head: () =>
    createSeoMeta({
      title: "Portal Docente | Gestión de Cursos y Calificaciones - FUNASF",
      description: "Portal oficial para docentes de la Fundación Internacional Amigos Sin Fronteras.",
      noindex: true,
      canonicalPath: "/docente",
    }),
  component: DocenteCursosPage,
});

function DocenteCursosPage() {
  const { user, profile } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      setLoading(true);
      setError(null);
      const res = await getCursosDocente(user.id);
      if (!res.ok) {
        setError(res.error || "No se pudieron cargar tus cursos asignados.");
      } else {
        setCursos(res.data || []);
      }
      setLoading(false);
    }
    cargar();
  }, [user]);

  return (
    <DocenteLayout
      title={`Bienvenido, ${profile?.nombre_completo || "Docente"}`}
      subtitle="Gestiona tus mallas de evaluación, asigna porcentajes y asienta las calificaciones oficiales de tus estudiantes en tiempo real."
      breadcrumbs={[{ label: "Mis Asignaturas" }]}
    >
      {/* Banner de Bienvenida y Atajos */}
      <div className="mb-8 rounded-3xl border border-emerald-800/10 bg-linear-to-br from-emerald-900 via-emerald-850 to-emerald-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200 mb-3 backdrop-blur-xs">
            <Sparkles className="size-3.5 text-brand-gold" />
            <span>Periodo Académico Activo 2026-I</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Sistema de Planillas y Mallas Curriculares
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Como docente de FUNASF, puedes definir los componentes evaluativos de cada curso (deben sumar exactamente 100%), registrar notas parciales del 0.0 al 5.0 y cerrar periodos académicos con generación automática de nota definitiva.
          </p>
        </div>
      </div>

      {/* Listado de Cursos */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Loader2 className="size-8 animate-spin text-brand-green mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">
            Consultando tus cursos y grupos asignados...
          </p>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTriangle className="size-4" />
          <AlertTitle>Error al cargar cursos</AlertTitle>
          <AlertDescription className="text-xs mt-1">{error}</AlertDescription>
        </Alert>
      ) : cursos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-lg mx-auto">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mx-auto mb-4">
            <BookOpen className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No tienes asignaturas asignadas</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Tu cuenta docente está activa, pero aún no se te han vinculado cursos para este periodo. Comunícate con la Coordinación Académica para programar tu carga horaria.
          </p>
          <Button asChild variant="outline" className="mt-5 text-xs font-semibold">
            <a href="mailto:academico@edufunasf.org">Contactar a Coordinación Académica</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((c) => (
            <Card
              key={c.id}
              className="rounded-2xl border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] bg-slate-50 text-slate-700 border-slate-200"
                  >
                    {c.codigo}
                  </Badge>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-[10px] font-semibold">
                    Periodo {c.periodo}
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {c.nombre}
                </CardTitle>
                <CardDescription className="text-xs text-emerald-800/90 font-medium">
                  {c.programaNombre}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {c.descripcion && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {c.descripcion}
                  </p>
                )}

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  {c.horarioDescripcion && (
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.horarioDescripcion}</span>
                    </div>
                  )}
                  {c.aula && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.aula}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Nota mínima aprobatoria: <strong>{c.notaMinimaAprobacion.toFixed(1)}</strong></span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold text-xs shadow-xs group-hover:translate-x-0.5 transition-transform"
                  >
                    <Link to="/docente/$cursoId" params={{ cursoId: c.id }}>
                      <span>Abrir Planilla y Malla de Notas</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DocenteLayout>
  );
}
