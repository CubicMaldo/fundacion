import { Section, SectionHeading } from "@/components/site/Section";
import { GraduationCap, type LucideIcon } from "lucide-react";
import type { Proposito } from "@/models/schema";

interface PropositoSectionProps {
  proposito: Proposito;
  iconos: Record<string, LucideIcon>;
}

export function PropositoSection({ proposito, iconos }: PropositoSectionProps) {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Nuestro propósito"
        title={proposito.titulo}
        description={proposito.intro}
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {proposito.ejes.map((eje) => {
          const Icono = iconos[eje.icono] ?? GraduationCap;
          return (
            <article key={eje.nombre} className="card-institucional">
              <span className="bg-brand-green-soft text-brand-green-deep flex size-11 items-center justify-center rounded-lg">
                <Icono aria-hidden className="size-5" />
              </span>
              <h3 className="text-foreground mt-5 text-xl">{eje.nombre}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{eje.texto}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
