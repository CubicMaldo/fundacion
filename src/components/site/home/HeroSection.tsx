import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/data/funasf";

interface HeroSectionProps {
  org: {
    nombre: string;
    eslogan: string;
    frases: readonly string[];
  };
  quienesSomos: {
    intro?: string;
    resumen?: string;
  };
}

export function HeroSection({ org, quienesSomos }: HeroSectionProps) {
  const descripcionHero =
    quienesSomos.intro ||
    quienesSomos.resumen ||
    "La Fundación Internacional Amigos Sin Fronteras (FUNASF) es una organización sin ánimo de lucro comprometida con el desarrollo humano, social y educativo de niños, jóvenes, adultos y familias en situación de vulnerabilidad.";

  return (
    <section className="surface-hero relative overflow-hidden py-14 md:py-20">
      <div className="container-page relative grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-3.5 py-1 text-xs font-semibold text-brand-gold-on-dark">
            <GraduationCap className="size-3.5 text-brand-gold-on-dark" />
            <span>Convocatoria de Becas Solidarias 2026</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[2.75rem] leading-[1.15]">
              Estudia una carrera técnica con beca de hasta el 90%
            </h1>
            <p className="text-brand-gold-on-dark font-display text-lg sm:text-xl font-medium italic">
              {org.eslogan}
            </p>
          </div>

          <p className="text-primary-foreground/90 max-w-xl text-base sm:text-lg leading-relaxed">
            {descripcionHero}
          </p>

          {/* Jerarquía de llamadas a la acción pulida */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deep font-bold px-7 h-12 rounded-xl shadow-md transition-[background-color,box-shadow,transform] duration-150 hover:scale-[1.02]"
            >
              <Link to="/programas">
                Ver programas y becas
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>

            {/* En pantallas desktop: enlace directo a WhatsApp */}
            <Button
              asChild
              size="lg"
              variant="outlineInvert"
              className="h-12 rounded-xl px-6 border-white/30 text-white hover:bg-white/10 hidden sm:inline-flex"
            >
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4 text-emerald-400" />
                Hablar con admisiones
              </a>
            </Button>

            {/* En móviles: enlace institucional secundario sin duplicar el WhatsApp de la barra inferior */}
            <Button
              asChild
              size="lg"
              variant="outlineInvert"
              className="h-12 rounded-xl px-6 border-white/30 text-white hover:bg-white/10 sm:hidden"
            >
              <Link to="/quienes-somos">
                Conoce la Fundación
              </Link>
            </Button>
          </div>
        </div>

        <div className="fade-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary-foreground/20 shadow-2xl bg-primary-foreground/5 group">
          <img
            src="/images/sedes/sede-atlantico-colegio.jpg"
            alt="Jornada educativa y comunitaria de la Fundación Internacional Amigos Sin Fronteras (FUNASF)"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1200}
            height={900}
          />
        </div>
      </div>
    </section>
  );
}
