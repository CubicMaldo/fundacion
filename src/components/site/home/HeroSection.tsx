import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/data/funasf";

interface HeroSectionProps {
  org: {
    nombre: string;
    eslogan: string;
    frases: readonly string[];
  };
  quienesSomos: {
    resumen: string;
  };
}

export function HeroSection({ org, quienesSomos }: HeroSectionProps) {
  return (
    <section className="surface-hero relative overflow-hidden py-14 md:py-20">
      <div className="container-page relative grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold text-brand-gold-deep backdrop-blur-xs">
            <Sparkles className="size-3.5 text-brand-gold" />
            <span>Convocatoria de Becas Solidarias 2026</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[2.75rem] leading-[1.15]">
              Formación técnica que transforma tu futuro
            </h1>
            <p className="text-brand-gold font-display text-lg sm:text-xl font-medium italic">
              {org.eslogan}
            </p>
          </div>

          <p className="text-primary-foreground/90 max-w-xl text-base sm:text-lg leading-relaxed">
            {quienesSomos.resumen}
          </p>

          {/* Jerarquía de llamadas a la acción pulida: Acción principal + Canal directo WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deep font-bold px-7 h-12 rounded-full shadow-md transition-all hover:scale-[1.02]"
            >
              <Link to="/programas">
                Ver programas y becas
                <ArrowRight aria-hidden className="size-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outlineInvert"
              className="h-12 rounded-full px-6 border-white/30 text-white hover:bg-white/10"
            >
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4 mr-2 text-emerald-400" />
                Consultar por WhatsApp
              </a>
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

      <div className="border-primary-foreground/15 border-t mt-12">
        <div className="container-page text-primary-foreground/85 grid gap-6 py-7 sm:grid-cols-3">
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl font-bold font-display">Hasta 90 %</strong>
            de cobertura en becas según convocatoria
          </p>
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl font-bold font-display">Presencial y virtual</strong>
            horarios flexibles para jóvenes y trabajadores
          </p>
          <p className="text-sm">
            <strong className="text-brand-gold block text-2xl font-bold font-display">Panamá y Colombia</strong>
            origen y vocación social de nuestra labor
          </p>
        </div>
      </div>
    </section>
  );
}
