import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, Laptop, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";

export function PortalesHubSection() {
  return (
    <Section id="campus-portales" className="bg-muted/30 border-y border-border/60">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <SectionHeading
          eyebrow="Accesos Académicos"
          title="Entra a tus clases, notas e inscripciones en un solo lugar"
          description="Consulta tu expediente estudiantil, registra calificaciones como docente o postúlate en línea a una beca de estudio."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Tarjeta 1: Portal Estudiantil */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs hover:border-brand-green/50 hover:shadow-md transition-[border-color,box-shadow] duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-12 rounded-xl bg-brand-green/10 text-brand-green-deep group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                <GraduationCap className="size-6" />
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
              Portal Estudiantil
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Consulta en tiempo real tus asignaturas matriculadas, el desglose de notas por componentes con porcentajes, tu definitiva acumulada y solicita certificados oficiales.
            </p>

            <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Expediente de calificaciones y malla evaluativa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Radicación de trámites y certificados de estudio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Ingreso con usuario o correo institucional</span>
              </li>
            </ul>
          </div>

          <Button
            asChild
            className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold rounded-xl h-11 shadow-xs group-hover:shadow-md"
          >
            <Link to="/portal-estudiantil">
              Ingresar al Portal Estudiantil
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Tarjeta 2: Portal Docente */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs hover:border-brand-gold/60 hover:shadow-md transition-[border-color,box-shadow] duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-12 rounded-xl bg-brand-gold/15 text-brand-gold-deep group-hover:bg-brand-gold group-hover:text-brand-green-deep transition-colors duration-300">
                <UserCheck className="size-6 text-brand-gold-deep" />
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
              Portal Docente
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Gestión académica integral: configura la malla de evaluación del curso (100%), asienta notas parciales (0.0 - 5.0), registra observaciones pedagógicas y cierra periodos.
            </p>

            <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-brown shrink-0" />
                <span>Planilla interactiva de evaluación por corte</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-brown shrink-0" />
                <span>Cálculo automático de notas definitivas ponderadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-brown shrink-0" />
                <span>Observaciones académicas y actas de notas</span>
              </li>
            </ul>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full border-border hover:border-brand-gold hover:bg-brand-gold/10 text-foreground font-semibold rounded-xl h-11"
          >
            <Link to="/docente">
              Ingresar al Portal Docente
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Tarjeta 3: Admisiones y Becas 2026 */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs hover:border-brand-green/50 hover:shadow-md transition-[border-color,box-shadow] duration-200 group md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-12 rounded-xl bg-brand-green/10 text-brand-green-deep group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                <Laptop className="size-6" />
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
              Admisiones y Becas
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Postúlate en línea al subsidio solidario de hasta el 90% en tu programa técnico laboral. Registro ágil y acompañamiento personalizado con la coordinación de admisiones.
            </p>

            <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Formulario en línea con respuesta y asesoría directa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Subsidio educativo en convenio institucional</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" />
                <span>Acompañamiento pedagógico y tutoría continua</span>
              </li>
            </ul>
          </div>

          <Button
            asChild
            variant="secondary"
            className="w-full bg-muted hover:bg-brand-green-soft text-brand-green-deep font-semibold rounded-xl h-11"
          >
            <Link to="/inscripcion">
              Postularme a Beca 2026
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
