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
            Ver toda la oferta <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
