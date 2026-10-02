import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { org } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/trabaja-con-nosotros")({
  head: () =>
    createSeoMeta({
      title: "Trabaja con Nosotros | FUNASF — Vinculación y Voluntariado",
      description:
        "Oportunidades de vinculación institucional, docencia técnica y voluntariado profesional en la Fundación Internacional Amigos Sin Fronteras en Colombia y Panamá.",
      canonicalPath: "/trabaja-con-nosotros",
      keywords:
        "trabajar en FUNASF, empleo fundacion Colombia, docentes tecnicos, voluntariado profesional",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Trabaja con nosotros", path: "/trabaja-con-nosotros" },
      ]),
    }),
  component: TrabajaConNosotrosPage,
});

const PERFILES = [
  {
    titulo: "Docentes e Instructores Técnicos",
    area: "Área Académica",
    descripcion:
      "Profesionales y técnicos con experiencia pedagógica en salud (enfermería, farmacia), administración, seguridad ocupacional o primera infancia.",
    icono: GraduationCap,
  },
  {
    titulo: "Coordinadores Comunitarios",
    area: "Acción Territorial",
    descripcion:
      "Líderes sociales con conocimiento de los territorios en Cali, Soledad, Santo Tomás, Ponedera o Sabanalarga para articulación comunitaria.",
    icono: MapPin,
  },
  {
    titulo: "Orientadores Psicosociales",
    area: "Bienestar Estudiantil",
    descripcion:
      "Psicólogos, trabajadores sociales o pedagogos dedicados al acompañamiento y permanencia de jóvenes y adultos en programas de becas.",
    icono: Users,
  },
  {
    titulo: "Voluntariado Profesional",
    area: "Solidaridad Internacional",
    descripcion:
      "Profesionales de diversas áreas (diseño, sistemas, comunicaciones, idiomas) dispuestos a donar horas de mentoría y capacitación.",
    icono: HeartHandshake,
  },
];

function TrabajaConNosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Talento y Comunidad"
        title="Construye futuro con FUNASF"
        description="Buscamos personas comprometidas con la educación, la solidaridad y la transformación social en Colombia y la región."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          <div>
            <SectionHeading
              eyebrow="Oportunidades abiertas"
              title="Perfiles y convocatorias permanentes"
              description="La Fundación mantiene abierto su banco de talento para suplir necesidades en proyectos formativos y de desarrollo comunitario."
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {PERFILES.map((perfil) => {
                const Icon = perfil.icono;
                return (
                  <article key={perfil.titulo} className="card-institucional">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green-deep">
                      <Icon className="size-5" />
                    </span>
                    <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-brown">
                      {perfil.area}
                    </span>
                    <h3 className="text-foreground mt-1 text-lg font-bold">{perfil.titulo}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {perfil.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-surface p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-foreground">
                ¿Cómo funciona el proceso de selección?
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                    1
                  </span>
                  <span>
                    Envío de hoja de vida en formato PDF indicando el área o municipio de interés.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                    2
                  </span>
                  <span>
                    Revisión de perfil por la coordinación de talento y banco de hojas de vida.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                    3
                  </span>
                  <span>
                    Contacto para entrevista o vinculación en convocatorias específicas y proyectos
                    activos.
                  </span>
                </li>
              </ol>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 text-brand-green font-bold text-sm uppercase tracking-wider">
                <Briefcase className="size-5" />
                <span>Envía tu Hoja de Vida</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si deseas postularte a nuestro banco de talento o participar en iniciativas de
                voluntariado, remite tu hoja de vida indicando tu ciudad de residencia y
                especialidad.
              </p>

              <div className="space-y-3 border-t border-border pt-4 text-xs">
                <div className="flex items-center gap-2.5 text-foreground font-medium">
                  <Mail className="size-4 text-brand-green shrink-0" />
                  <a
                    href={`mailto:${org.correo}?subject=Postulacion%20Talento%20FUNASF`}
                    className="hover:underline"
                  >
                    {org.correo}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-foreground font-medium">
                  <MapPin className="size-4 text-brand-green shrink-0" />
                  <span>Sede Cali & Región Caribe</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold"
              >
                <a href={`mailto:${org.correo}?subject=Postulacion%20Talento%20FUNASF`}>
                  <Send className="size-4 mr-2" /> Enviar por correo
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/contacto">Líneas de atención</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
