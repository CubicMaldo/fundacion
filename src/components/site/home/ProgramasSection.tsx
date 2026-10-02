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
import type { CategoriaProgramas } from "@/models/schema";

interface ProgramasSectionProps {
  categoriasProgramas: CategoriaProgramas[];
  programas: { nombre: string; slug: string }[];
}

export function ProgramasSection({ categoriasProgramas, programas }: ProgramasSectionProps) {
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
                  {cat.programas.map((p) => {
                    const lp = p.toLowerCase();
                    const matchProg = programas.find(
                      (pa) =>
                        pa.nombre.toLowerCase() === lp ||
                        lp.includes(pa.nombre.toLowerCase()) ||
                        (lp.includes("bachillerato") && pa.slug === "validacion-del-bachillerato"),
                    );
                    return (
                      <li key={p} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="bg-brand-gold mt-2 size-2 shrink-0 rounded-full"
                        />
                        {matchProg ? (
                          <Link
                            to="/programas/$slug"
                            params={{ slug: matchProg.slug }}
                            className="font-medium text-foreground hover:text-brand-green transition-colors inline-flex items-center gap-1.5 group"
                          >
                            <span>{p}</span>
                            <ArrowRight
                              aria-hidden
                              className="size-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-green shrink-0"
                            />
                          </Link>
                        ) : (
                          <span>{p}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/estudia" hash="programas">
            Ver toda la oferta <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
