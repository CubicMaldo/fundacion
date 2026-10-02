import { createFileRoute, Link } from "@tanstack/react-router";
import { HandHeart, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { org, voluntariado, whatsappLink } from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/trabaja-con-nosotros")({
  head: () =>
    createSeoMeta({
      title: "Trabaja con Nosotros y Voluntariado | FUNASF",
      description:
        "Únete como docente, profesional o voluntario a la Fundación Internacional Amigos Sin Fronteras. Tu talento puede transformar vidas.",
      canonicalPath: "/trabaja-con-nosotros",
      keywords:
        "trabajar en FUNASF, empleo fundacion, docentes FUNASF, voluntariado, participar FUNASF",
      jsonLd: getBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Trabaja con nosotros", path: "/trabaja-con-nosotros" },
      ]),
    }),
  component: TrabajaConNosotros,
});

function TrabajaConNosotros() {
  const telefonoPrincipal = org.telefonos[0] ?? "+57 313 577 9384";

  return (
    <>
      <PageHero
        eyebrow="Talento y Compromiso"
        title="Tu talento puede transformar vidas"
        description="Buscamos docentes, profesionales, líderes y voluntarios comprometidos con la educación y la transformación social en nuestras comunidades."
      />

      <Section>
        <SectionHeading
          eyebrow="Voluntariado y Colaboración"
          title={voluntariado.titulo}
          description={voluntariado.intro}
        />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="card-institucional p-6">
            <h3 className="text-lg font-semibold text-foreground">¿Qué puedes aportar?</h3>
            <ul className="text-muted-foreground mt-4 grid grid-cols-2 gap-2.5 text-sm">
              {voluntariado.aportes.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="bg-brand-gold size-1.5 shrink-0 rounded-full" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-institucional p-6">
            <h3 className="text-lg font-semibold text-foreground">Áreas donde puedes participar</h3>
            <ul className="text-muted-foreground mt-4 grid grid-cols-2 gap-2.5 text-sm">
              {voluntariado.areas.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="bg-brand-green size-1.5 shrink-0 rounded-full" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-brand-brown mt-6 text-base font-medium italic">{voluntariado.destacado}</p>
      </Section>

      <Section tone="deep">
        <div className="mx-auto max-w-2xl text-center">
          <HandHeart aria-hidden className="text-brand-gold mx-auto size-12" />
          <h2 className="text-primary-foreground mt-4 text-3xl font-display font-semibold">
            ¿Quieres ser parte del equipo?
          </h2>
          <p className="text-primary-foreground/85 mt-3 text-base leading-relaxed">
            Escríbenos a <span className="font-semibold text-white">{org.correo}</span> o comunícate a nuestra línea de atención <span className="font-semibold text-white">{telefonoPrincipal}</span> y cuéntanos sobre tu perfil y cómo te gustaría aportar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden className="size-4" /> Hablar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outlineInvert" size="lg">
              <a href={`mailto:${org.correo}`}>
                <Mail aria-hidden className="size-4" /> Enviar correo
              </a>
            </Button>
            <Button asChild variant="ghostInvert" size="lg">
              <Link to="/contacto">Ir a contacto</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

