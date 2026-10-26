import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, HandHeart, HeartPulse, Sprout } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import type { Proposito } from "@/models/schema";

interface PropositoSectionProps {
  proposito: Proposito;
}

export function PropositoSection({ proposito }: PropositoSectionProps) {
  // 4 pilares estructurales que unifican propósito institucional y programas sociales
  const pilares = [
    {
      titulo: "Educación y Formación Técnica",
      programa: "Programa Educación Sin Fronteras",
      icono: GraduationCap,
      texto:
        "Facilitamos el acceso a programas técnicos laborales con becas solidarias de hasta el 90%, convenios institucionales y acompañamiento para construir proyectos de vida sostenibles.",
    },
    {
      titulo: "Salud, Prevención y Bienestar",
      programa: "Salud para Todos & Amigos por la Vida",
      icono: HeartPulse,
      texto:
        "Apoyamos iniciativas de promoción de la salud comunitaria, prevención, bienestar integral y atención a necesidades prioritarias de familias en los territorios.",
    },
    {
      titulo: "Emprendimiento y Trabajo Digno",
      programa: "Casa de Emprendimiento & Trabajo Empresarial",
      icono: Sprout,
      texto:
        "Impulsamos la formación práctica y el acompañamiento a emprendedores locales para transformar conocimientos en oportunidades de ingreso autónomo y formal.",
    },
    {
      titulo: "Solidaridad y Sostenibilidad Ambiental",
      programa: "Eco Amigos & Voluntariado Social",
      icono: HandHeart,
      texto:
        "Fomentamos la educación ambiental, el cuidado de los recursos naturales y la movilización de voluntarios y aliados para convertir la empatía en obras colectivas.",
    },
  ];

  return (
    <Section tone="soft" id="proposito-accion-social">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <SectionHeading
          title={proposito.titulo}
          description={proposito.intro}
          align="center"
        />
      </div>

      {/* Grid estructurado de 4 pilares esenciales (eliminando el card-spam de 11 cajas) */}
      <div className="grid gap-6 md:grid-cols-2">
        {pilares.map((pilar) => {
          const Icono = pilar.icono;
          return (
            <article
              key={pilar.titulo}
              className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-brand-green/30 hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-deep transition-colors group-hover:bg-brand-green group-hover:text-white">
                  <Icono aria-hidden="true" className="size-6" />
                </span>

                <div className="flex-1">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-gold-deep mb-1">
                    {pilar.programa}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">{pilar.titulo}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pilar.texto}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="sm">
          <Link to="/portal-informativo" hash="voluntariado">
            Conoce cómo vincularte al voluntariado{" "}
            <ArrowRight className="size-3.5 ml-1.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
