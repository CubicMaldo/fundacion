import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, MapPin, Navigation, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { sedes, modeloAlianzas, alcance } from "@/data/funasf";

export function TestimoniosVideoSection() {
  return (
    <Section id="sedes-alianzas" tone="soft">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <SectionHeading
          title="Presencia real en los territorios y respaldo institucional"
          description={modeloAlianzas.intro}
        />
      </div>

      {/* Tarjetas de sedes oficiales con fotografías reales */}
      <div className="grid gap-6 md:grid-cols-3">
        {sedes.map((sede) => (
          <article
            key={sede.ciudad}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:border-brand-green/40 hover:shadow-md transition-[border-color,box-shadow] duration-200 group"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src={sede.imagenUrl}
                alt={`Sede ${sede.ciudad} — FUNASF`}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-brand-green-deep shadow-xs">
                <MapPin className="size-3" aria-hidden="true" />
                {sede.pais}
              </span>

              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <h3 className="font-display text-base font-bold leading-snug text-white">
                  Sede {sede.ciudad}
                </h3>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">{sede.descripcion}</p>

              <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-start gap-1.5 text-foreground/85 font-medium">
                  <Building2
                    className="size-3.5 text-brand-green shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{sede.direccion}</span>
                </p>
                {sede.telefono && (
                  <p className="flex items-center gap-1.5 tabular-nums">
                    <Phone className="size-3.5 text-brand-gold-deep shrink-0" aria-hidden="true" />
                    <span>{sede.telefono}</span>
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Franja integrada de alcance municipal y proyección territorial */}
      <div className="mt-8 rounded-2xl border border-border/80 bg-background/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-brand-green-deep text-xs font-bold uppercase tracking-wider">
              <Navigation className="size-3.5 text-brand-green" aria-hidden="true" />
              <span>Cobertura y Proyección Territorial</span>
            </div>
            <p className="text-sm font-medium text-foreground mt-1">{alcance.destacado}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{alcance.intro}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border text-xs">
            <span className="font-medium text-muted-foreground">Presencia activa:</span>
            {alcance.presencia.map((m: string) => (
              <span
                key={m}
                className="inline-flex items-center rounded-md bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 text-xs font-semibold text-brand-green-deep"
              >
                {m}
              </span>
            ))}
            <span className="font-medium text-muted-foreground ml-1">Proyección:</span>
            {alcance.proyeccion.map((p: string) => (
              <span
                key={p}
                className="inline-flex items-center rounded-md bg-brand-gold/15 border border-brand-gold/25 px-2.5 py-1 text-xs font-semibold text-brand-gold-deep"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Claridad sobre el modelo de alianzas institucionales */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-brand-green-deep mb-3">
            Responsabilidades de las instituciones aliadas
          </h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed max-w-[65ch]">
            {modeloAlianzas.responsabilidades.intro}
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            {modeloAlianzas.responsabilidades.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="size-4 text-brand-green shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-green-deep mb-3">
              Compromiso de FUNASF
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
              {modeloAlianzas.destacado}
            </p>
            <div className="border-l-2 border-brand-green pl-4 text-xs sm:text-sm font-medium text-brand-green-deep">
              {modeloAlianzas.responsabilidades.destacado}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Conoce más sobre nuestro modelo educativo
            </span>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link to="/estudia">
                Cómo funciona <ArrowRight className="size-3.5 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
