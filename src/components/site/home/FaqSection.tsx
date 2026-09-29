import { Section, SectionHeading } from "@/components/site/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/models/schema";

interface FaqSectionProps {
  faq: FAQ[];
}

export function FaqSection({ faq }: FaqSectionProps) {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Resuelve tus dudas" />
        <Accordion type="single" collapsible className="w-full">
          {faq.map((f, i) => (
            <AccordionItem key={f.pregunta} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.pregunta}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
