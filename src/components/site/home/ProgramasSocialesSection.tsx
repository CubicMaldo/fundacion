import { Section, SectionHeading } from "@/components/site/Section";
import { HandHeart, type LucideIcon } from "lucide-react";
import type { ProgramaSocial } from "@/models/schema";

interface ProgramasSocialesSectionProps {
  programasSociales: ProgramaSocial[];
  iconos: Record<string, LucideIcon>;
}

export function ProgramasSocialesSection({
  programasSociales,
  iconos,
}: ProgramasSocialesSectionProps) {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Programas sociales"
        title="Líneas de acción de la Fundación"
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programasSociales.map((p) => {
          const Icono = iconos[p.icono] ?? HandHeart;
          return (
            <article key={p.nombre} className="card-institucional">
              <span className="bg-brand-brown-soft text-brand-brown flex size-11 items-center justify-center rounded-lg">
                <Icono aria-hidden className="size-5" />
              </span>
              <h3 className="text-foreground mt-5 text-lg">{p.nombre}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.texto}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
