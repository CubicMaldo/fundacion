import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import type { QuienesSomos } from "@/models/schema";

interface QuienesSomosSectionProps {
  quienesSomos: QuienesSomos;
}

export function QuienesSomosSection({ quienesSomos }: QuienesSomosSectionProps) {
  return (
    <Section id="quienes-somos">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading eyebrow="Quiénes somos" title="Una oportunidad puede cambiar una vida" />
          <div className="text-muted-foreground mt-6 space-y-4 leading-relaxed">
            {quienesSomos.parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{quienesSomos.compromiso}</p>
          </div>
          <p className="border-brand-green text-foreground mt-8 border-l-4 pl-5 text-lg font-medium italic">
            {quienesSomos.destacado}
          </p>
          <Button asChild className="mt-8" variant="default">
            <Link to="/quienes-somos">
              Conocer la Fundación <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-md bg-muted">
          <img
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80"
            alt="Acción comunitaria y trabajo solidario en FUNASF"
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            decoding="async"
            width={800}
            height={1000}
          />
        </div>
      </div>
    </Section>
  );
}
