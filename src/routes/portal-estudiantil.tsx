import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Laptop,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSiteSettings } from "@/lib/site-settings-context";
import { useAuth } from "@/lib/auth-context";
import {
  getMisMatriculasYNotas,
  type MatriculaEstudiante,
} from "@/services/academico";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/portal-estudiantil")({
  head: () =>
    createSeoMeta({
      title: "Portal Estudiantil | FUNASF — Recursos, Notas y Aulas Virtuales",
      description:
        "Espacio de acceso académico para estudiantes de FUNASF: consulta de notas, asignaturas matriculadas, plataformas virtuales y trámites de certificados.",
      canonicalPath: "/portal-estudiantil",
      keywords:
        "portal estudiantil FUNASF, notas FUNASF, campus virtual FUNASF, certificados FUNASF, atencion estudiantes",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Portal Estudiantil", path: "/portal-estudiantil" },
      ]),
    }),
  component: PortalEstudiantilComponent,
});

function PortalEstudiantilComponent() {
  const { settings } = useSiteSettings();
  const { user, profile, signOut } = useAuth();
  const org = settings.org;
  const telefonoPrincipal = settings.contacto.telefonoPrincipal;
  const phoneDigits = (telefonoPrincipal || "").replace(/\D/g, "");
  const phoneHref = `tel:+${phoneDigits.startsWith("57") ? phoneDigits : `57${phoneDigits}`}`;

  // Estado del expediente académico del estudiante
  const [matriculas, setMatriculas] = useState<MatriculaEstudiante[]>([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);
  const [errorAcademico, setErrorAcademico] = useState<string | null>(null);

  useEffect(() => {
    async function cargarExpediente() {
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
    }

    cargarExpediente();
  }, [user]);

  return (
    <div className="flex flex-col">
      {/* Hero del Portal */}
      <header className="surface-hero relative overflow-hidden py-14 md:py-20">
        <div className="container-page relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
              <GraduationCap className="size-4" />
              Comunidad Académica FUNASF
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight">
              Portal Estudiantil
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
              Bienvenido al espacio centralizado para estudiantes. Aquí encuentras acceso a tus
              plataformas formativas, consulta de notas en tiempo real, solicitudes académicas y
              canales de acompañamiento estudiantil.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Button asChild size="lg" variant="gold">
                  <a href="#expediente-academico">
                    Ver mi expediente de notas <ArrowRight className="size-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg" variant="gold">
                  <Link to="/admin/login">
                    Ingresar con mi cuenta institucional <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outlineInvert">
                <a href="#plataformas">Plataformas virtuales</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container-page py-14 md:py-20 space-y-16">
        {/* SECCIÓN ACADÉMICA DINÁMICA: AUTENTICADO VS NO AUTENTICADO */}
        {user ? (
          <section id="expediente-academico" className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                    Sesión activa
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {profile?.rol === "estudiante" ? "Estudiante Oficial" : profile?.rol?.toUpperCase()}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mt-1">
                  Expediente y Calificaciones de {profile?.nombre_completo || user.email}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Correo institucional: <span className="font-mono">{user.email}</span>
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="self-start sm:self-auto gap-2 text-xs"
              >
                <LogOut className="size-3.5" />
                Cerrar sesión
              </Button>
            </div>

            {/* Error estricto: sin inventar datos locales */}
            {errorAcademico && (
              <div className="mt-6">
                <Alert variant="destructive">
                  <AlertTriangle className="size-5" />
                  <AlertTitle className="text-sm font-bold">Aviso del Sistema Académico</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    {errorAcademico}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Estado de carga */}
            {cargandoNotas && (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                <Loader2 className="size-6 animate-spin text-primary" />
                <span>Consultando asignaturas y calificaciones en el registro institucional...</span>
              </div>
            )}

            {/* Listado de asignaturas y notas */}
            {!cargandoNotas && !errorAcademico && (
              <div className="mt-8 space-y-8">
                {matriculas.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center">
                    <BookOpen className="size-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-foreground">
                      No tienes asignaturas registradas para este periodo
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                      Si realizaste tu matrícula recientemente, tu horario y notas aparecerán aquí
                      tan pronto como la secretaría académica asigne tus módulos.
                    </p>
                  </div>
                ) : (
                  matriculas.map((mat) => (
                    <div
                      key={mat.id}
                      className="rounded-xl border border-border/80 bg-surface/50 overflow-hidden"
                    >
                      <div className="p-5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-gold-deep bg-brand-gold/15 px-2 py-0.5 rounded">
                              {mat.curso.codigo}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Periodo: {mat.curso.periodo}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground mt-1">
                            {mat.curso.nombre}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {mat.curso.programaNombre} • Estado:{" "}
                            <span className="font-semibold text-foreground capitalize">
                              {mat.estado}
                            </span>
                          </p>
                        </div>

                        {mat.notaDefinitiva != null && (
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">
                              Nota Definitiva
                            </span>
                            <span
                              className={`text-2xl font-black ${
                                mat.notaDefinitiva >= 3.0 ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {mat.notaDefinitiva.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Calificaciones Parciales */}
                      <div className="p-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                          Evaluaciones y Trabajos Parciales
                        </h4>

                        {mat.notas.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">
                            Aún no se han registrado notas evaluativas para este módulo.
                          </p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Evaluación</TableHead>
                                <TableHead className="text-xs text-center">Porcentaje</TableHead>
                                <TableHead className="text-xs text-center">Calificación</TableHead>
                                <TableHead className="text-xs">Observaciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mat.notas.map((n) => (
                                <TableRow key={n.id}>
                                  <TableCell className="text-xs font-medium">
                                    {n.titulo}
                                  </TableCell>
                                  <TableCell className="text-xs text-center">
                                    {n.porcentaje}%
                                  </TableCell>
                                  <TableCell className="text-xs text-center">
                                    <Badge
                                      variant={n.nota >= 3.0 ? "default" : "destructive"}
                                      className="text-xs font-bold"
                                    >
                                      {n.nota.toFixed(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {n.retroalimentacion || "Sin comentarios adicionales"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {/* Observaciones pedagógicas */}
                        {mat.observaciones.length > 0 && (
                          <div className="mt-5 border-t border-border pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                              Anotaciones del Docente
                            </h4>
                            <div className="space-y-2">
                              {mat.observaciones.map((obs) => (
                                <div
                                  key={obs.id}
                                  className="text-xs p-3 rounded-lg bg-card border border-border/60"
                                >
                                  <span className="font-semibold text-foreground block">
                                    {obs.titulo}
                                  </span>
                                  <p className="text-muted-foreground mt-0.5">{obs.detalle}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold-deep">
                <Award className="size-4" />
                Consulta de Calificaciones en Línea
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                ¿Eres estudiante activo de FUNASF?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Inicia sesión con tu correo y contraseña institucional para consultar tus módulos
                matriculados, evaluaciones parciales y certificados de forma segura.
              </p>
            </div>

            <Button asChild size="lg" variant="gold" className="shrink-0 w-full sm:w-auto">
              <Link to="/admin/login">
                Ingresar al Portal Académico <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </section>
        )}

        {/* Plataformas de formación */}
        <section id="plataformas">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-brown">
              Entornos de aprendizaje
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Plataformas académicas y aulas virtuales
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Selecciona el entorno de formación correspondiente a tu programa matriculado con
              nuestras instituciones aliadas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Tarjeta 1: Campus Virtual */}
            <article className="card-institucional flex flex-col justify-between">
              <div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green-deep">
                  <Laptop className="size-6" />
                </span>
                <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-green">
                  Modalidad Virtual y Distancia
                </span>
                <h3 className="text-xl font-bold text-foreground mt-1">Campus Virtual</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Ingreso a tus módulos, foros de discusión, material de estudio y entrega de
                  evidencias académicas.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button asChild className="w-full" variant="default">
                  <Link to="/contacto">Solicitar acceso al campus</Link>
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Usuario y contraseña asignados tras la matrícula oficial.
                </p>
              </div>
            </article>

            {/* Tarjeta 2: Registro Académico y Notas */}
            <article className="card-institucional flex flex-col justify-between">
              <div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-brown-soft text-brand-brown">
                  <FileCheck2 className="size-6" />
                </span>
                <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-brown">
                  Seguimiento del estudiante
                </span>
                <h3 className="text-xl font-bold text-foreground mt-1">Notas y Calificaciones</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Consulta de rendimiento académico, estado de materias aprobadas y avance hacia la
                  certificación técnica.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                {user ? (
                  <Button asChild className="w-full" variant="outline">
                    <a href="#expediente-academico">Ver mis notas arriba</a>
                  </Button>
                ) : (
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/admin/login">Ingresar para ver mis notas</Link>
                  </Button>
                )}
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Validación directa en la base de datos institucional.
                </p>
              </div>
            </article>

            {/* Tarjeta 3: Biblioteca y Recursos Digitales */}
            <article className="card-institucional flex flex-col justify-between">
              <div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green-deep">
                  <BookOpen className="size-6" />
                </span>
                <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-green">
                  Apoyo pedagógico
                </span>
                <h3 className="text-xl font-bold text-foreground mt-1">Recursos de Apoyo</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Guías de estudio, normatividad técnica, reglamentos institucionales y tutoriales
                  de orientación vocacional.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/estudia" hash="programas">
                    Ver guías y programas
                  </Link>
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Material abierto para la comunidad estudiantil FUNASF.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Trámites y solicitudes */}
        <section
          id="tramites"
          className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-xs"
        >
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-brown">
              Gestiones administrativas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Trámites, certificados y solicitudes
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Conoce los conductos regulares para tramitar documentos oficiales de tu proceso
              formativo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-surface/60 p-5">
              <UserCheck className="size-6 text-brand-green" />
              <h3 className="text-base font-bold text-foreground mt-3">Constancia de Estudio</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Documento que acredita la calidad de estudiante activo ante entidades laborales o de
                seguridad social.
              </p>
              <Link
                to="/contacto"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-brand-green-deep"
              >
                Solicitar constancia <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/60 p-5">
              <Calendar className="size-6 text-brand-brown" />
              <h3 className="text-base font-bold text-foreground mt-3">Renovación de Beca</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Requisitos y fechas para mantener el beneficio solidario de hasta el 90 % durante el
                siguiente ciclo.
              </p>
              <Link
                to="/estudia"
                hash="becas"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-brand-green-deep"
              >
                Ver condiciones de beca <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/60 p-5">
              <ShieldCheck className="size-6 text-brand-green" />
              <h3 className="text-base font-bold text-foreground mt-3">Peticiones y Consultas</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Atención directa a solicitudes particulares, cambios de jornada o inquietudes sobre
                la institución aliada.
              </p>
              <Link
                to="/contacto"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-brand-green-deep"
              >
                Escribir al área estudiantil <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Mesa de ayuda y atención al estudiante */}
        <section className="rounded-2xl bg-brand-green-deep p-8 md:p-12 text-primary-foreground">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Soporte y Orientación
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                ¿Necesitas ayuda con tu plataforma o matrícula?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
                El equipo de orientación estudiantil de FUNASF está disponible para acompañarte en
                tus dudas académicas, administrativas o de acceso al aula virtual.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm">
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-primary-foreground hover:bg-white/20 transition-colors"
                >
                  <Phone className="size-4 text-brand-gold" />
                  <span>{telefonoPrincipal}</span>
                </a>
                <a
                  href={`mailto:${org.correo}`}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-primary-foreground hover:bg-white/20 transition-colors"
                >
                  <Mail className="size-4 text-brand-gold" />
                  <span>{org.correo}</span>
                </a>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-xs text-center sm:text-left">
              <HelpCircle className="size-8 text-brand-gold mx-auto sm:mx-0" />
              <h3 className="text-lg font-bold mt-3">Línea de acompañamiento</h3>
              <p className="mt-2 text-xs text-primary-foreground/80 leading-relaxed">
                Horario de atención: Lunes a viernes en jornada diurna. También puedes escribirnos
                dejando tus datos y número de documento.
              </p>
              <Button asChild className="mt-5 w-full" variant="gold">
                <Link to="/contacto">
                  <MessageSquare className="size-4 mr-2" />
                  Enviar mensaje de soporte
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
