import { Section, SectionHeading } from "@/components/site/Section";
import type { Valor } from "@/models/schema";

interface ValoresSectionProps {
  valores: Valor[];
}

export function ValoresSection({ valores }: ValoresSectionProps) {
  return (
    <Section tone="surface">
      <SectionHeading eyebrow="Nuestros valores" title="Lo que nos sostiene" align="center" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {valores.map((v) => (
          <div key={v.nombre} className="card-institucional">
            <h3 className="text-brand-green-deep text-base font-semibold">{v.nombre}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.texto}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
