import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { org, telefonoPrincipal, whatsappLink } from "@/data/funasf";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | FUNASF" },
      { name: "description", content: "Canales oficiales de contacto de la Fundación Internacional Amigos Sin Fronteras." },
      { property: "og:title", content: "Contacto | FUNASF" },
      { property: "og:description", content: "Habla con FUNASF sobre programas, becas, voluntariado y alianzas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <>
      <PageHero eyebrow="Contacto" title="Una oportunidad puede comenzar con una conversación" description="Estamos para orientarte sobre nuestros programas, becas, voluntariado y alianzas." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Canales oficiales" title="Hablemos" description="Elige el canal que te resulte más cómodo para comunicarte con la Fundación." />
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="card-institucional group">
              <MessageCircle aria-hidden className="text-primary size-5" />
              <h2 className="text-foreground mt-4 text-xl">WhatsApp</h2>
              <p className="text-muted-foreground mt-2 text-sm">{telefonoPrincipal}</p>
            </a>
            <a href={`mailto:${org.correo}`} className="card-institucional group">
              <Mail aria-hidden className="text-brand-brown size-5" />
              <h2 className="text-foreground mt-4 text-xl">Correo</h2>
              <p className="text-muted-foreground mt-2 text-sm">{org.correo}</p>
            </a>
            <a href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`} className="card-institucional group">
              <Phone aria-hidden className="text-primary size-5" />
              <h2 className="text-foreground mt-4 text-xl">Teléfono</h2>
              <p className="text-muted-foreground mt-2 text-sm">{telefonoPrincipal}</p>
            </a>
            <a href={org.instagramUrl} target="_blank" rel="noreferrer" className="card-institucional group">
              <Instagram aria-hidden className="text-brand-brown size-5" />
              <h2 className="text-foreground mt-4 text-xl">Instagram</h2>
              <p className="text-muted-foreground mt-2 text-sm">{org.instagram}</p>
            </a>
          </div>
        </div>
      </Section>
      <Section tone="surface">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Sede principal</span>
            <h2 className="text-foreground mt-3 text-3xl">Cali, Valle del Cauca</h2>
            <p className="text-muted-foreground mt-3 flex items-center gap-2"><MapPin aria-hidden className="size-4" /> {org.direccionPrincipal}</p>
          </div>
          <Button asChild size="lg"><a href={org.formularioInscripcion} target="_blank" rel="noreferrer">Formulario de inscripción</a></Button>
        </div>
      </Section>
    </>
  );
}