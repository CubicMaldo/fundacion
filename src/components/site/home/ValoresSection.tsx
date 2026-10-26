import { Section, SectionHeading } from "@/components/site/Section";
import type { Valor } from "@/models/schema";

interface ValoresSectionProps {
  valores: Valor[];
}

export function ValoresSection({ valores }: ValoresSectionProps) {
  return (
    <Section tone="surface" id="valores">
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
        <SectionHeading
          title="Principios que nos sostienen"
          description="Valores éticos que orientan cada acción pedagógica, comunitaria y solidaria de FUNASF."
          align="center"
        />
      </div>

      {/* Franja compacta y refinada de principios éticos (elimina el card-spam de 7 tarjetas pesadas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {valores.map((v) => (
          <div
            key={v.nombre}
            className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl border border-border/60 bg-background/80 shadow-2xs hover:border-brand-green/30 hover:bg-background transition-[border-color,background-color] duration-150"
          >
            <span className="font-display text-sm font-bold text-brand-green-deep tracking-tight">
              {v.nombre}
            </span>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">{v.texto}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
