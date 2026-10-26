import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Award,
  UserCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSiteSettings } from "@/lib/site-settings-context";
import { useAuth } from "@/lib/auth-context";
import { getMisMatriculasYNotas, type MatriculaEstudiante } from "@/services/academico";
import { isStudentSubdomain, getStudentPortalUrl } from "@/lib/subdomain";
import { ExpedienteEstudiante } from "@/components/site/portal-estudiantil/ExpedienteEstudiante";
import { PlataformasEstudio } from "@/components/site/portal-estudiantil/PlataformasEstudio";
import { TramitesEstudianteDialog } from "@/components/site/portal-estudiantil/TramitesEstudianteDialog";

export function PortalEstudiantilView() {
  const { settings } = useSiteSettings();
  const { user, profile } = useAuth();
  const contacto = settings.contacto;

  const [onSubdomain, setOnSubdomain] = useState(false);
  const [subdomainUrl, setSubdomainUrl] = useState("");

  // Estado del expediente académico del estudiante
  const [matriculas, setMatriculas] = useState<MatriculaEstudiante[]>([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);
  const [errorAcademico, setErrorAcademico] = useState<string | null>(null);

  useEffect(() => {
    setOnSubdomain(isStudentSubdomain());
    setSubdomainUrl(getStudentPortalUrl());
  }, []);

  const cargarExpediente = useCallback(async () => {
    if (!user) return;
    setCargandoNotas(true);
    setErrorAcademico(null);

    const res = await getMisMatriculasYNotas(user.id);
    if (!res.ok) {
      setErrorAcademico(res.error || "El sistema académico no está disponible.");
    } else {
      setMatriculas(res.data || []);
    }
    setCargandoNotas(false);
  }, [user]);

  useEffect(() => {
    cargarExpediente();
  }, [cargarExpediente]);

  return (
    <>
      {/* Sugerencia informativa de subdominio si se entra desde el dominio principal */}
      {!onSubdomain && (
        <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 py-2.5 text-center text-xs text-emerald-900 transition-colors">
          <div className="container-page flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="font-medium">
              Ahora el portal cuenta con su propio subdominio dedicado:
            </span>
            <a
              href={subdomainUrl}
              className="inline-flex items-center gap-1 font-bold text-brand-green hover:text-brand-green-deep underline underline-offset-2"
            >
              <span>Ingresar vía estudiantes.edufunasf.org</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}

      <PageHero
        badge="Campus & Servicios Académicos"
        badgeIcon={<GraduationCap className="size-4" />}
        title="Portal Estudiantil"
        lead="Bienvenido a tu intranet académica institucional. Consulta tus valoraciones y notas en tiempo real, ingresa a las aulas virtuales, solicita constancias y mantente al día con tu calendario académico."
      />

      {/* SECCIÓN 1: EXPEDIENTE DE NOTAS O ACCESO AL PORTAL */}
      <Section id="expediente" className="py-12 md:py-16 bg-white border-b border-slate-200/80">
        {user ? (
          <div>
            <SectionHeading
              title={`Bienvenido, ${profile?.nombre_completo || "Estudiante"}`}
              description="A continuación encuentras tus asignaturas activas, calificaciones parciales y el estado de tus entregas prácticas."
            />

            {cargandoNotas ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <Loader2 className="size-8 animate-spin text-brand-green mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  Consultando tu expediente y valoraciones docentes...
                </p>
              </div>
            ) : errorAcademico ? (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertTriangle className="size-4" />
                <AlertTitle>No fue posible cargar tus calificaciones</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  {errorAcademico}
                </AlertDescription>
              </Alert>
            ) : (
              <ExpedienteEstudiante matriculas={matriculas} onRefresh={cargarExpediente} />
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-slate-200/90 bg-linear-to-br from-emerald-50/70 via-white to-slate-50 p-8 md:p-12 shadow-xs text-center">
              <h2 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold font-display text-slate-900">
                <UserCheck aria-hidden className="size-7 shrink-0 text-brand-green" />
                Ingreso al Expediente de Notas y Cursos
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
                Inicia sesión con tu correo registrado para consultar tu registro de calificaciones, retroalimentación docente y estado de tus módulos formativos.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold shadow-xs">
                  <Link
                    to="/admin/login"
                    search={{ portal: "estudiante", redirect: "/portal-estudiantil" }}
                  >
                    Ingresar con mi cuenta de estudiante
                    <ArrowRight className="size-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  <Link to="/inscripcion">
                    ¿Aún no estás matriculado? Inscríbete aquí
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* SECCIÓN 2: PLATAFORMAS DE FORMACIÓN */}
      <Section id="plataformas" className="py-12 md:py-16 bg-slate-50 border-b border-slate-200/80">
        <SectionHeading
          title="Plataformas y Aulas Virtuales"
          description="Espacios virtuales integrados para potenciar tus clases sincrónicas y asincrónicas en FUNASF."
        />
        <PlataformasEstudio />
      </Section>

      {/* SECCIÓN 3: TRÁMITES Y SOLICITUDES ACADÉMICAS */}
      <Section id="tramites" className="py-12 md:py-16 bg-white border-b border-slate-200/80">
        <SectionHeading
          title="Trámites y Solicitudes en Línea"
          description="Radica tus solicitudes institucionales directamente sin filas ni intermediarios."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <FileText className="size-5" />
              </div><h3 className="font-bold text-base text-slate-900">Constancia de Estudio</h3></div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Documento oficial que certifica tu condición de estudiante activo para cajas de compensación, subsidios o empleadores.
              </p>
            </div>
            <div className="pt-5">
              <TramitesEstudianteDialog
                tipoInicial="Constancia de Estudio"
                trigger={
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-slate-200 hover:bg-slate-50">
                    Solicitar Constancia
                  </Button>
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div>
              <div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                <Award className="size-5" />
              </div><h3 className="font-bold text-base text-slate-900">Renovación de Beca</h3></div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Postulación para mantener tu beneficio institucional de hasta el 90 % en el siguiente periodo académico.
              </p>
            </div>
            <div className="pt-5">
              <TramitesEstudianteDialog
                tipoInicial="Renovación de Beca"
                trigger={
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-slate-200 hover:bg-slate-50">
                    Renovar Cobertura
                  </Button>
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <FileCheck2 className="size-5" />
              </div><h3 className="font-bold text-base text-slate-900">Certificado de Notas</h3></div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Sábana valorativa con el consolidado de asignaturas aprobadas, créditos y ponderados acumulados.
              </p>
            </div>
            <div className="pt-5">
              <TramitesEstudianteDialog
                tipoInicial="Certificado de Notas"
                trigger={
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-slate-200 hover:bg-slate-50">
                    Solicitar Certificado
                  </Button>
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
            <div>
              <div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <HelpCircle className="size-5" />
              </div><h3 className="font-bold text-base text-slate-900">Peticiones y Asesoría</h3></div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Comunícate con la coordinación pedagógica ante dudas con tus horarios, docentes o procesos formativos.
              </p>
            </div>
            <div className="pt-5">
              <TramitesEstudianteDialog
                tipoInicial="Peticiones y Consultas"
                trigger={
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-slate-200 hover:bg-slate-50">
                    Radicar Consulta
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </Section>

      {/* SECCIÓN 4: CALENDARIO ACADÉMICO */}
      <Section id="calendario" className="py-12 md:py-16 bg-muted/40 border-b border-border/80">
        <SectionHeading
          title="Etapas del Ciclo Académico"
          description="El seguimiento académico se desarrolla de acuerdo con la programación de cada programa técnico laboral y la institución educativa aliada."
        />

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="size-4" />
                <span>Fase 1</span>
              </div>
              <p className="text-base font-bold text-foreground">Matrícula e Inducción</p>
              <p className="text-xs text-muted-foreground mt-1">Según convocatoria vigente</p>
              <p className="text-xs text-emerald-700 font-medium mt-2 bg-emerald-50 rounded-md px-2 py-1">
                Orientación e ingreso al campus
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="size-4" />
                <span>Fase 2</span>
              </div>
              <p className="text-base font-bold text-foreground">Cortes Evaluativos</p>
              <p className="text-xs text-muted-foreground mt-1">Evaluación por competencias</p>
              <p className="text-xs text-amber-800 font-medium mt-2 bg-amber-50 rounded-md px-2 py-1">
                Según malla definida por el docente
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="size-4" />
                <span>Fase 3</span>
              </div>
              <p className="text-base font-bold text-foreground">Componente Práctico</p>
              <p className="text-xs text-muted-foreground mt-1">Talleres y prácticas</p>
              <p className="text-xs text-blue-800 font-medium mt-2 bg-blue-50 rounded-md px-2 py-1">
                En articulación con el instituto aliado
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="size-4" />
                <span>Fase 4</span>
              </div>
              <p className="text-base font-bold text-foreground">Cierre de Periodo</p>
              <p className="text-xs text-muted-foreground mt-1">Consolidación de actas</p>
              <p className="text-xs text-foreground/80 font-medium mt-2 bg-muted rounded-md px-2 py-1">
                Publicación de nota definitiva
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* SECCIÓN 5: MESA DE AYUDA Y ATENCIÓN DIRECTA */}
      <Section id="soporte" className="py-12 md:py-16 bg-background">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/90 bg-linear-to-br from-muted/50 via-card to-emerald-50/40 p-8 md:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
                <ShieldCheck className="size-4" />
                Bienestar y Permanencia Estudiantil
              </span>
              <h3 className="text-2xl font-bold font-display text-foreground">
                ¿Requieres orientación o soporte con tu portal?
              </h3>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                El equipo de coordinación y orientación estudiantil de FUNASF está disponible a través de nuestros canales oficiales para acompañarte en tu proceso formativo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold text-xs shadow-xs">
                <a
                  href={`https://wa.me/${contacto.whatsappLlamadas || "573135779384"}?text=Hola%20FUNASF,%20necesito%20asistencia%20con%20mi%20portal%20estudiantil`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4 mr-1.5" />
                  WhatsApp Estudiantil
                </a>
              </Button>
              <Button asChild variant="outline" className="text-xs border-border text-foreground hover:bg-muted">
                <a href={`mailto:${contacto.correo || "info@edufunasf.org"}`}>
                  <Mail className="size-4 mr-1.5" />
                  Escribir a Coordinación
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
