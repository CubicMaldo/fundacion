import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { flyers } from "@/data/flyers";
import type { CategoriaProgramas } from "@/models/schema";

interface ProgramasSectionProps {
  categoriasProgramas: CategoriaProgramas[];
}

export function ProgramasSection({ categoriasProgramas }: ProgramasSectionProps) {
  return (
    <Section id="programas">
      <SectionHeading
        eyebrow="Estudia con FUNASF"
        title="Programas de formación por áreas"
        description="Programas desarrollados con instituciones educativas aliadas responsables de la formación, la certificación y la expedición de títulos."
      />
      <div className="mt-12 max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {categoriasProgramas.map((cat, i) => (
            <AccordionItem key={cat.id} value={`cat-home-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-lg font-medium text-brand-green-deep hover:text-brand-green hover:no-underline">
                {cat.categoria}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-muted-foreground mt-2 space-y-3 p-2 text-base">
                  {cat.programas.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="bg-brand-gold mt-2 size-2 shrink-0 rounded-full"
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/estudia" hash="programas">
            Ver toda la oferta académica <ArrowRight aria-hidden className="size-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Galería rápida de afiches de convocatoria */}
      <div className="mt-16 pt-10 border-t border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="eyebrow">Convocatorias vigentes</span>
            <h3 className="text-2xl font-bold font-display text-foreground mt-1">
              Afiches oficiales de programas con beca
            </h3>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/galeria">
              Ver todos en la galería <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {flyers.slice(0, 8).map((f) => (
            <Link
              key={f.src}
              to="/galeria"
              className="card-institucional overflow-hidden group shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

