import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import type { LlamadoAccion, Organization } from "@/models/schema";

interface CtaSectionProps {
  llamadoAccion: LlamadoAccion;
  org: Organization;
}

export function CtaSection({ llamadoAccion, org }: CtaSectionProps) {
  return (
    <Section tone="deep">
      <SectionHeading
        invert
        align="center"
        eyebrow="Da el primer paso"
        title={llamadoAccion.titulo}
        description={llamadoAccion.subtitulo}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {llamadoAccion.bloques.map((b) => (
          <div
            key={b.titulo}
            className="border-primary-foreground/20 bg-primary-foreground/5 rounded-xl border p-5 transition-all hover:bg-primary-foreground/10 hover:border-brand-gold/30 hover:-translate-y-1 shadow-sm"
          >
            <h3 className="text-brand-gold text-base font-medium">{b.titulo}</h3>
            <p className="text-primary-foreground/80 mt-3 text-sm leading-relaxed">{b.texto}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" variant="gold">
          <Link to="/contacto">Contáctanos</Link>
        </Button>
        <Button asChild size="lg" variant="outlineInvert">
          <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
            Formulario de inscripción
          </a>
        </Button>
      </div>
    </Section>
  );
}
