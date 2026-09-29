import { Section, SectionHeading } from "@/components/site/Section";
import type { Alcance } from "@/models/schema";

interface AlcanceSectionProps {
  alcance: Alcance;
}

export function AlcanceSection({ alcance }: AlcanceSectionProps) {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Nuestro alcance"
            title="Presencia territorial"
            description={alcance.intro}
          />
          <p className="text-brand-brown mt-8 text-xl font-medium italic">{alcance.destacado}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Presencia actual</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.presencia.map((m: string) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Proyección</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.proyeccion.map((m: string) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
