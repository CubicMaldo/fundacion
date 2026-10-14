import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Briefcase, HeartPulse, Laptop, Sparkles, Stethoscope, Users } from "lucide-react";
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
    color: "emerald",
    bg: "bg-emerald-500/10 text-emerald-700",
    badge: "Alta demanda",
    descripcion: "Auxiliar en Enfermería, Salud Pública, Farmacia y cuidado integral con prácticas clínicas hospitalarias.",
    ruta: "/programas/auxiliar-en-enfermeria",
  },
  {
    titulo: "Tecnología e Informática",
    icono: Laptop,
    color: "blue",
    bg: "bg-blue-500/10 text-blue-700",
    badge: "Modalidad flexible",
    descripcion: "Sistemas, Redes, Soporte Técnico, herramientas digitales y competencias laborales modernas.",
    ruta: "/programas/sistemas-e-informatica",
  },
  {
    titulo: "Administración y Empresa",
    icono: Briefcase,
    color: "amber",
    bg: "bg-amber-500/10 text-amber-700",
    badge: "Rápida inserción",
    descripcion: "Gestión Administrativa, Asistencia Contable, Mercadeo, Ventas y creación de emprendimientos.",
    ruta: "/programas/asistente-administrativo",
  },
  {
    titulo: "Educación y Comunidad",
    icono: Users,
    color: "purple",
    bg: "bg-purple-500/10 text-purple-700",
    badge: "Labor social",
    descripcion: "Atención Integral a la Primera Infancia, formación comunitaria y desarrollo social.",
    ruta: "/programas/atencion-integral-a-la-primera-infancia",
  },
];

export function ProgramasSection({ categoriasProgramas, programas }: ProgramasSectionProps) {
  return (
    <Section id="programas">
      <SectionHeading
        eyebrow="Estudia con FUNASF"
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
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-green/40 hover:shadow-md transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`p-3 rounded-xl ${area.bg} transition-colors group-hover:bg-brand-green group-hover:text-white`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold-deep border border-brand-gold/30">
                    {area.badge}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
                  {area.titulo}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {area.descripcion}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border">
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs font-semibold text-brand-green group-hover:text-brand-green-deep"
                >
                  <Link to={area.ruta}>
                    Ver programa destacado <ArrowRight className="size-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acordeón detallado por todas las categorías */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">
          Oferta completa por áreas de conocimiento
        </h4>
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
          <Link to="/programas">
            Ver toda la oferta <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
