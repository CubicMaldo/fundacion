import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import type { LlamadoAccion, Organization } from "@/models/schema";
import { ModalDonacion } from "@/components/site/ModalDonacion";

interface CtaSectionProps {
  llamadoAccion: LlamadoAccion;
  org: Organization;
}

export function CtaSection({ llamadoAccion }: CtaSectionProps) {
  return (
    <Section id="contacto-cta" tone="deep">
      <SectionHeading
        invert
        align="center"
        title={llamadoAccion.titulo}
        description={llamadoAccion.subtitulo}
      />

      <div className="mt-12 grid gap-6 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-primary-foreground/15 lg:gap-0 lg:p-8">
        {llamadoAccion.bloques.map((b, idx) => (
          <div key={b.titulo} className={idx > 0 ? "lg:pl-6 lg:pr-4 first:lg:pl-0" : "lg:pr-6"}>
            <h3 className="text-brand-gold-on-dark text-base font-semibold">{b.titulo}</h3>
            <p className="text-primary-foreground/85 mt-2.5 text-xs sm:text-sm leading-relaxed">
              {b.texto}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
        <Button
          asChild
          size="lg"
          variant="gold"
          className="font-bold shadow-md hover:scale-[1.02] transition-transform"
        >
          <Link to="/inscripcion">
            Postularme a una beca
            <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
          </Link>
        </Button>

        <Button asChild size="lg" variant="outlineInvert">
          <Link to="/contacto">
            <MessageCircle className="size-4 mr-1.5 text-emerald-400" aria-hidden="true" />
            Hablar con nosotros
          </Link>
        </Button>

        <ModalDonacion
          triggerButton={
            <Button size="lg" variant="outlineInvert">
              Patrocinar un estudiante
            </Button>
          }
        />
      </div>
    </Section>
  );
}
