import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import type { Organization, QuienesSomos } from "@/models/schema";

interface HeroSectionProps {
  org: Organization;
  quienesSomos: QuienesSomos;
}

export function HeroSection({ org, quienesSomos }: HeroSectionProps) {
  return (
    <section className="surface-hero relative overflow-hidden">
      <div
        aria-hidden
        className="bg-brand-gold/15 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
      />
      <div className="container-page relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="fade-up">
          <span className="text-brand-gold text-xs font-bold tracking-[0.18em] uppercase">
            Fundación Internacional Amigos Sin Fronteras
          </span>
          <h1 className="text-primary-foreground mt-5 text-4xl leading-[1.08] md:text-6xl">
            Porque la educación
            <br />
            no tiene fronteras.
          </h1>
          <p className="text-primary-foreground/85 text-balance-pretty mt-6 max-w-xl text-lg leading-relaxed">
            {quienesSomos.intro}
          </p>
          <p className="text-primary-foreground/70 mt-4 text-sm italic">{org.frases[0]}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gold">
              <Link to="/estudia" hash="programas">
                Quiero estudiar <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineInvert">
              <Link to="/estudia" hash="becas">
                Conocer las becas
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghostInvert">
              <Link to="/portal-informativo" hash="voluntariado">
                Ser voluntario
              </Link>
            </Button>
          </div>
        </div>

        <div className="fade-up aspect-[4/3] w-full">
          <MediaPlaceholder tone="dark" label="[FOTOGRAFÍA PRINCIPAL PENDIENTE]" />
        </div>
      </div>

      <div className="border-primary-foreground/15 border-t">
        <div className="container-page text-primary-foreground/85 grid gap-6 py-8 sm:grid-cols-3">
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
