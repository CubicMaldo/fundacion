import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Briefcase, HeartPulse, ShieldCheck, Sparkles, Stethoscope, Users } from "lucide-react";
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

const areasDestacadas = [
  {
    titulo: "Área de la Salud",
    icono: HeartPulse,
    bg: "bg-brand-green/10 text-brand-green-deep",
    descripcion: "Auxiliar de Enfermería, Servicios Farmacéuticos y Administración en Salud con prácticas asistenciales.",
    ruta: "/programas/auxiliar-de-enfermeria",
  },
  {
    titulo: "Administración y Empresa",
    icono: Briefcase,
    bg: "bg-brand-gold/15 text-brand-brown",
    descripcion: "Auxiliar Administrativo y Contable, Mercadeo y Ventas, Logística y Secretariado Ejecutivo.",
    ruta: "/programas/auxiliar-administrativo-y-contable",
  },
  {
    titulo: "Seguridad y Salud en el Trabajo",
    icono: ShieldCheck,
    bg: "bg-brand-green/10 text-brand-green-deep",
    descripcion: "Prevención de riesgos laborales, protocolos SST y capacitación en seguridad y vigilancia.",
    ruta: "/programas/seguridad-y-salud-en-el-trabajo",
  },
  {
    titulo: "Educación y Comunidad",
    icono: Users,
    bg: "bg-brand-gold/15 text-brand-brown",
    descripcion: "Atención a la Primera Infancia, Belleza Integral, Mecánica de Motos y Validación de Bachillerato.",
    ruta: "/programas/primera-infancia",
  },
];

export function ProgramasSection({ categoriasProgramas, programas }: ProgramasSectionProps) {
  return (
    <Section id="programas">
      <SectionHeading
        title="Explora nuestras áreas de formación técnica"
        description="Programas técnico laborales desarrollados con instituciones educativas aliadas responsables de la formación, la certificación oficial y las prácticas empresariales."
      />

      {/* Tarjetas visuales de áreas formativas destacadas */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {areasDestacadas.map((area, i) => {
          const Icon = area.icono;
          return (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-brand-green/40 hover:shadow-md transition-[border-color,box-shadow] duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center justify-center size-11 rounded-xl ${area.bg} transition-colors group-hover:bg-brand-green group-hover:text-white`}>
                    <Icon className="size-5" />
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
                  {area.titulo}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {area.descripcion}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs font-semibold text-brand-green group-hover:text-brand-green-deep"
                >
                  <Link to={area.ruta}>
                    Ver programa destacado <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acordeón detallado por todas las categorías */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">
          Oferta completa por áreas de conocimiento
        </h3>
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
                              className="size-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-[opacity,transform] text-brand-green shrink-0"
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
          <Link to="/programas">
            Ver toda la oferta <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
