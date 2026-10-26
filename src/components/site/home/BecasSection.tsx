import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import type { Beca } from "@/models/schema";

interface BecasSectionProps {
  becas: Beca;
}

export function BecasSection({ becas }: BecasSectionProps) {
  return (
    <Section tone="deep">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading invert eyebrow="Becas" title={becas.titulo} description={becas.intro} />
          <p className="text-primary-foreground/85 mt-5 leading-relaxed">{becas.proposito}</p>
          <p className="font-display italic text-brand-gold-on-dark mt-8 text-xl sm:text-2xl font-bold tracking-tight">
            {becas.destacado}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="gold">
              <Link to="/inscripcion">
                Postularme a una beca <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outlineInvert">
              <Link to="/estudia" hash="becas">
                Ver requisitos de beca
              </Link>
            </Button>
          </div>
        </div>
        <ul className="divide-y divide-primary-foreground/15 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 p-6">
          {becas.beneficios.map((b) => (
            <li
              key={b}
              className="text-primary-foreground/90 flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 text-sm leading-relaxed"
            >
              <span
                aria-hidden
                className="bg-brand-gold-on-dark mt-2 size-2 shrink-0 rounded-full"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-primary-foreground/80 mt-10 text-xs">{becas.aclaracion}</p>
    </Section>
  );
}
