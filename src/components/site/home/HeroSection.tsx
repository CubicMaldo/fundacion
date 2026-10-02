import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Organization, QuienesSomos } from "@/models/schema";

interface HeroSectionProps {
  org: Organization;
  quienesSomos: QuienesSomos;
}

export function HeroSection({ org, quienesSomos }: HeroSectionProps) {
  return (
    <section className="surface-hero relative overflow-hidden">
      <div className="container-page relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="fade-up">
          <span className="text-brand-gold text-xs font-bold tracking-[0.18em] uppercase">
            Fundación Internacional Amigos Sin Fronteras
          </span>
          <h1 className="text-primary-foreground mt-4 text-4xl leading-[1.08] md:text-5xl lg:text-6xl text-balance">
            Porque la educación no tiene fronteras.
          </h1>
          <p className="text-primary-foreground/85 text-balance-pretty mt-5 max-w-xl text-base sm:text-lg leading-relaxed">
            {quienesSomos.intro}
          </p>
          <p className="text-primary-foreground/75 mt-3 text-sm italic">{org.frases[0]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="gold">
              <Link to="/estudia" hash="becas">
                Conocer las becas <ArrowRight aria-hidden className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineInvert">
              <Link to="/programas">Explorar programas</Link>
            </Button>
          </div>
        </div>

        <div className="fade-up aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary-foreground/20 shadow-xl bg-primary-foreground/5">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80"
            alt="Estudiantes en aula de formación técnica y académica FUNASF"
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1000}
            height={750}
          />
        </div>
      </div>

      <div className="border-primary-foreground/15 border-t">
        <div className="container-page text-primary-foreground/85 grid gap-6 py-7 sm:grid-cols-3">
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl">Hasta 90 %</strong>
            en becas, según convocatoria
          </p>
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl">Presencial y virtual</strong>
            según disponibilidad de cada programa
          </p>
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl">Panamá y Colombia</strong>
            origen y territorio de nuestra labor
          </p>
        </div>
      </div>
    </section>
  );
}
