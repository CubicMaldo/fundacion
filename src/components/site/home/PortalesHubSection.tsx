import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, Laptop, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";

export function PortalesHubSection() {
  return (
    <Section id="campus-portales" className="bg-muted/30 border-y border-border/60">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
        <SectionHeading
          title="Tu camino formativo en un solo lugar"
          description="Elige tu vía de acceso: postúlate a una beca técnica si buscas iniciar estudios o ingresa al campus virtual si ya eres estudiante de la Fundación."
        />
      </div>

      {/* Grid dual enfocado para los dos perfiles principales: Aspirantes y Estudiantes */}
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Tarjeta 1: Nuevos Aspirantes y Becas 2026 (Máxima prioridad de conversión) */}
        <article className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs hover:border-brand-green/60 hover:shadow-md transition-[border-color,box-shadow] duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-12 rounded-xl bg-brand-green/10 text-brand-green-deep group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                <Laptop className="size-6" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold text-brand-green-deep">
                <Sparkles className="size-3 text-brand-gold-deep" aria-hidden="true" />
                Convocatoria 2026
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
              Admisiones y Becas
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Postúlate al subsidio solidario de hasta el 90% para carreras técnicas laborales en
              alianza institucional. Acompañamiento ágil desde el primer día.
            </p>

            <ul className="space-y-2.5 text-xs text-foreground/85 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Subsidio educativo aplicable a todos los programas técnicos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Formulario 100% en línea con orientación directa por WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Programas con prácticas asistenciales y validez nacional</span>
              </li>
            </ul>
          </div>

          <Button
            asChild
            className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold rounded-xl h-12 shadow-xs group-hover:shadow-md transition-all text-sm"
          >
            <Link to="/inscripcion">
              Postularme a una Beca 2026
              <ArrowRight
                className="size-4 ml-1.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </article>

        {/* Tarjeta 2: Estudiantes Matriculados */}
        <article className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs hover:border-brand-green/60 hover:shadow-md transition-[border-color,box-shadow] duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-12 rounded-xl bg-brand-green/10 text-brand-green-deep group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Comunidad Activa
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-brand-green-deep transition-colors">
              Portal Estudiantil
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Espacio exclusivo para alumnos matriculados. Consulta tus asignaturas, calificaciones
              parciales por componentes, promedio acumulado y certificados.
            </p>

            <ul className="space-y-2.5 text-xs text-foreground/85 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Historial de notas por corte y definitiva ponderada</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Descarga y radicación de certificados oficiales de estudio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Ingreso seguro con número de cédula o tarjeta de identidad</span>
              </li>
            </ul>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full border-border hover:border-brand-green hover:bg-brand-green/5 text-foreground font-semibold rounded-xl h-12 text-sm"
          >
            <Link to="/portal-estudiantil">
              Ingresar al Campus Estudiantil
              <ArrowRight
                className="size-4 ml-1.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </article>
      </div>

      {/* Acceso discreto para docentes y directivos (evita ruido al aspirante) */}
      <div className="mt-8 pt-6 border-t border-border/60 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-brand-gold-deep" aria-hidden="true" />
          <span>¿Haces parte de nuestro equipo docente o administrativo?</span>
        </div>
        <Link
          to="/docente"
          className="inline-flex items-center gap-1 font-semibold text-brand-green-deep hover:text-brand-green transition-colors"
        >
          <span>Acceder al Portal Docente</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
