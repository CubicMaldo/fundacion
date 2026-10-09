import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  HelpCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { programasAcademicos } from "@/data/programas";
import { getProgramaBySlug } from "@/services/api";
import { createSeoMeta, getBreadcrumbSchema, getCourseSchema } from "@/lib/seo";

export const Route = createFileRoute("/programas/$slug")({
  loader: async ({ params }) => {
    return await getProgramaBySlug(params.slug);
  },
  head: ({ loaderData, params }) => {
    const programa = loaderData ?? programasAcademicos.find((p) => p.slug === params.slug);
    if (!programa) {
      return createSeoMeta({
        title: "Programa no encontrado | FUNASF",
        description: "El programa de formación solicitado no se encuentra en el catálogo vigente.",
        canonicalPath: `/programas/${params.slug}`,
        noindex: true,
      });
    }

    const title = `${programa.nombre} | Becas hasta 90 % — FUNASF Colombia`;
    const description = `${programa.descripcion} Modalidad: ${programa.modalidades.join(" / ")}. Formación técnica en convenio con instituciones aliadas y becas solidarias de FUNASF Colombia (EduFUNASF).`;

    return createSeoMeta({
      title,
      description,
      canonicalPath: `/programas/${programa.slug}`,
      keywords: `${programa.nombre}, estudiar ${programa.nombre} Colombia, beca ${programa.nombre}, carrera técnica ${programa.nombre}, FUNASF Colombia, EduFUNASF, ${programa.categoria}`,
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Programas", path: "/programas" },
          { name: programa.nombre, path: `/programas/${programa.slug}` },
        ]),
        getCourseSchema(programa),
      ],
    });
  },
  component: DetallePrograma,
});

function DetallePrograma() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { settings } = useSiteSettings();
  const programa = loaderData || programasAcademicos.find((p) => p.slug === slug);

  if (!programa) {
    return (
      <div className="container-page py-20 text-center">
        <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-8">
          <BookOpen className="size-12 text-muted-foreground mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Programa no encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            El programa solicitado no existe en nuestro catálogo o fue actualizado.
          </p>
          <Button asChild className="mt-6">
            <Link to="/programas">
              <ArrowLeft className="size-4 mr-2" />
              Volver al catálogo de programas
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Programas relacionados de la misma categoría o complementarios
  const relacionados = programasAcademicos
    .filter((p) => p.slug !== programa.slug && p.categoriaId === programa.categoriaId)
    .slice(0, 3);

  const fallbackProg = programasAcademicos.find(
    (p) =>
      p.slug === programa.slug ||
      p.nombre.toLowerCase().trim() === programa.nombre.toLowerCase().trim(),
  );
  const imagenUrl = programa.imagenUrl || fallbackProg?.imagenUrl;

  const telefonoPrincipal = settings.contacto.telefonoPrincipal;
  const phoneDigits = (telefonoPrincipal || "").replace(/\D/g, "");
  const phoneHref = `tel:+${phoneDigits.startsWith("57") ? phoneDigits : `57${phoneDigits}`}`;

  return (
    <div className="flex flex-col">
      {/* Encabezado del programa */}
      <header className="surface-hero relative overflow-hidden py-12 md:py-16">
        <div className="container-page relative">
          {/* Miga de pan */}
          <nav
            aria-label="Ruta de navegación"
            className="mb-6 flex items-center gap-2 text-xs text-primary-foreground/75"
          >
            <Link to="/" className="hover:text-brand-gold transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/programas" className="hover:text-brand-gold transition-colors">
              Programas
            </Link>
            <span>/</span>
            <span className="text-primary-foreground font-semibold truncate max-w-xs sm:max-w-none">
              {programa.nombre}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
              <GraduationCap className="size-3.5" />
              <span>{programa.categoria}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
              {programa.nombre}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
              {programa.descripcion}
            </p>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] items-start">
          {/* Columna principal */}
          <div className="space-y-10">
            {/* Foto institucional del programa */}
            {imagenUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                <img
                  src={imagenUrl}
                  alt={`Estudiantes del programa ${programa.nombre} en FUNASF`}
                  className="size-full object-cover"
                  loading="eager"
                  decoding="async"
                  width={1000}
                  height={562}
                />
              </div>
            )}

            {/* Objetivo del programa */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green-deep">
                  <BookOpen className="size-5" />
                </span>
                <h2 className="text-xl font-bold text-foreground">Objetivo formativo</h2>
              </div>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {programa.objetivo}
              </p>
            </section>

            {/* Perfil ocupacional */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-brown-soft text-brand-brown">
                  <Briefcase className="size-5" />
                </span>
                <h2 className="text-xl font-bold text-foreground">Perfil y campos de desempeño</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Al culminar satisfactoriamente el plan formativo, el egresado podrá desempeñarse en:
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {programa.perfilOcupacional.map((campo, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/80 p-3.5 text-sm text-foreground/90"
                  >
                    <CheckCircle2 className="size-4 text-brand-green mt-0.5 shrink-0" />
                    <span>{campo}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requisitos de admisión */}
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green-deep">
                  <GraduationCap className="size-5" />
                </span>
                <h2 className="text-xl font-bold text-foreground">Requisitos de inscripción</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {programa.requisitos.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-bold text-brand-brown">
                      {index + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Transparencia y certificación por institución aliada */}
            <section className="rounded-2xl border border-brand-green/20 bg-brand-green-soft/30 p-6 md:p-8">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="size-6 text-brand-green shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-brand-green-deep">
                    Certificación y titulación oficial
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    La formación académica, la certificación de competencias y la expedición del
                    título o diploma correspondiente son otorgadas directamente por la institución
                    educativa aliada responsable del programa, debidamente autorizada por las
                    autoridades de educación competentes.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    FUNASF facilita y promueve el acceso a través de convocatorias de becas de hasta
                    el 90 %, acompañamiento psicosocial y orientación vocacional.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Columna lateral / Sidebar de postulación */}
          <aside className="space-y-6">
            {/* Tarjeta de postulación a beca */}
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 shadow-md">
              <div className="rounded-xl bg-brand-green-deep p-4 text-primary-foreground text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                  Oportunidad de estudio
                </span>
                <p className="text-2xl font-bold mt-1">Beca hasta 90 %</p>
                <p className="text-xs text-primary-foreground/80 mt-1">
                  Sujeta a convocatoria y requisitos de la Fundación
                </p>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="size-4" /> Modalidad
                  </span>
                  <span className="font-semibold text-foreground">
                    {programa.modalidades.join(" / ")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award className="size-4" /> Tipo de formación
                  </span>
                  <span className="font-semibold text-foreground">{programa.categoria}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="size-4" /> Sede
                  </span>
                  <span className="font-semibold text-foreground">Cali / Costa Atlántica</span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold shadow-xs"
                >
                  <Link to="/inscripcion" search={{ programa: programa.slug }}>
                    <span>Postularme a esta beca</span>
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link to="/contacto">Consultar por este programa</Link>
                </Button>

                <a
                  href={phoneHref}
                  className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground hover:text-brand-green-deep transition-colors"
                >
                  <Phone className="size-3.5 text-brand-green" />
                  Línea de orientación: {telefonoPrincipal}
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Programas relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-brown">
                  {programa.categoria}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Otros programas en esta área
                </h3>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/programas">Ver todos los programas</Link>
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relacionados.map((rel) => {
                const relImg =
                  rel.imagenUrl ||
                  programasAcademicos.find(
                    (p) =>
                      p.slug === rel.slug ||
                      p.nombre.toLowerCase().trim() === rel.nombre.toLowerCase().trim(),
                  )?.imagenUrl;
                return (
                  <article
                    key={rel.slug}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-colors hover:border-brand-green/45"
                  >
                    {relImg && (
                      <div className="aspect-[16/10] w-full overflow-hidden border-b border-border bg-brand-sand/40">
                        <img
                          src={relImg}
                          alt={rel.nombre}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={250}
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-bold text-brand-brown uppercase">
                        {rel.categoria}
                      </span>
                      <h4 className="text-lg font-bold text-foreground mt-1.5">{rel.nombre}</h4>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rel.descripcion}
                      </p>
                      <Link
                        to="/programas/$slug"
                        params={{ slug: rel.slug }}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-brand-green-deep"
                      >
                        Ver programa <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
