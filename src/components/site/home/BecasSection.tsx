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
          <p className="text-primary-foreground/80 mt-5 leading-relaxed">{becas.proposito}</p>
          <p className="text-brand-gold mt-8 text-2xl font-semibold">{becas.destacado}</p>
          <Button asChild className="mt-8" variant="gold">
            <Link to="/estudia" hash="becas">
              Conocer las convocatorias <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {becas.beneficios.map((b) => (
            <li
              key={b}
              className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/90 rounded-xl border p-4 text-sm transition-all hover:bg-primary-foreground/10 hover:-translate-y-0.5"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-primary-foreground/60 mt-10 text-xs">{becas.aclaracion}</p>
    </Section>
  );
}
