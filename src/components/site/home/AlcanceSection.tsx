import { Section, SectionHeading } from "@/components/site/Section";
import { sedesActivas } from "@/data/funasf";
import { MapPin } from "lucide-react";
import type { Alcance } from "@/models/schema";

interface AlcanceSectionProps {
  alcance: Alcance;
}

export function AlcanceSection({ alcance }: AlcanceSectionProps) {
  return (
    <Section id="sedes" tone="surface">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <SectionHeading
            eyebrow="Nuestro alcance"
            title="Estamos cerca de ti"
            description={alcance.intro}
          />
          <p className="text-brand-brown mt-6 text-lg font-medium italic">{alcance.destacado}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card-institucional p-6">
            <h3 className="text-brand-green-deep text-base font-semibold">Presencia actual</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.presencia.map((m: string) => (
                <li key={m} className="flex items-center gap-2">
                  <MapPin aria-hidden className="text-primary size-4 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-institucional p-6">
            <h3 className="text-brand-green-deep text-base font-semibold">Proyección</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.proyeccion.map((m: string) => (
                <li key={m}>· {m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sedes activas en municipios */}
      <div className="mt-14 pt-10 border-t border-border/80">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="eyebrow">Cobertura regional</span>
          <h3 className="text-2xl font-bold font-display text-foreground mt-1">
            Nuestras sedes y municipios
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Formación técnica de calidad, con horarios flexibles y becas del 90 % cerca de tu comunidad.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {sedesActivas.map((s) => (
            <div
              key={s.nombre}
              className="card-institucional p-5 text-center flex flex-col items-center justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="size-10 rounded-full bg-brand-green/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <MapPin aria-hidden className="size-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">{s.nombre}</h4>
                <p className="text-muted-foreground text-xs mt-0.5">{s.departamento}</p>
              </div>
              <span
                className={
                  s.estado === "Activa"
                    ? "mt-4 inline-block rounded-full bg-brand-green/10 text-brand-green px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                    : "mt-4 inline-block rounded-full bg-brand-brown/10 text-brand-brown px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                }
              >
                {s.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

