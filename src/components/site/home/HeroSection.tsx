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
            <Button asChild size="lg" variant="gold" className="shadow-md">
              <Link to="/programas">
                Explorar programas <ArrowRight aria-hidden className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineInvert">
              <Link to="/estudia" hash="becas">
                Conocer las becas
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineInvert">
              <Link to="/inscripcion">Formulario de estudiante</Link>
            </Button>
          </div>
        </div>

        <div className="fade-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary-foreground/20 shadow-2xl bg-primary-foreground/5 group">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="Estudiantes y becarios de formación técnica de la Fundación Internacional Amigos Sin Fronteras"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            width={1200}
            height={900}
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
