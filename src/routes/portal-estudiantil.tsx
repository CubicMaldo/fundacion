import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Laptop,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/portal-estudiantil")({
  head: () =>
    createSeoMeta({
      title: "Portal Estudiantil | FUNASF — Recursos y Aulas Virtuales",
      description:
        "Espacio de acceso académico para estudiantes de FUNASF e instituciones aliadas: plataformas virtuales, trámites de certificados, calendario y orientación estudiantil.",
      canonicalPath: "/portal-estudiantil",
      keywords:
        "portal estudiantil FUNASF, campus virtual FUNASF, certificados FUNASF, atencion estudiantes",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Portal Estudiantil", path: "/portal-estudiantil" },
      ]),
    }),
  component: PortalEstudiantilComponent,
});

function PortalEstudiantilComponent() {
  const { settings } = useSiteSettings();
  const org = settings.org;
  const telefonoPrincipal = settings.contacto.telefonoPrincipal;

  return (
    <div className="flex flex-col">
      {/* Hero del Portal */}
      <header className="surface-hero relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden
          className="bg-brand-gold/15 pointer-events-none absolute -top-24 -right-24 size-80 rounded-full blur-3xl"
        />
        <div className="container-page relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
              <GraduationCap className="size-4" />
              Comunidad Académica FUNASF
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight">
              Portal Estudiantil
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
              Bienvenido al espacio centralizado para estudiantes. Aquí encuentras acceso a tus
              plataformas formativas, solicitudes académicas, cronograma de convocatorias y canales
              de acompañamiento estudiantil.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <a href="#plataformas">
                  Ingreso a plataformas <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outlineInvert">
                <a href="#tramites">Trámites y certificados</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Servicios principales para estudiantes */}
      <main className="container-page py-14 md:py-20 space-y-16">
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
                  <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                    Ingresar con credenciales
                  </a>
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
                <Button asChild className="w-full" variant="outline">
                  <Link to="/contacto">Solicitar estado académico</Link>
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Validación directa a través de la secretaría académica aliada.
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
            <p className="text-sm text-muted-foreground mt-2">
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
                  href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}
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
