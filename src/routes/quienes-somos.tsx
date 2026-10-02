import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  HandHeart,
  HeartPulse,
  MapPin,
  Phone,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";

const iconos: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  HandHeart,
  BookOpen,
};
import {
  quienesSomos,
  mision,
  vision,
  resenaHistorica,
  proposito,
  valores,
  alcance,
  sedes,
  transparencia,
  PENDIENTE,
} from "@/data/funasf";
import { createSeoMeta, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/quienes-somos")({
  head: () =>
    createSeoMeta({
      title: "Quiénes Somos | FUNASF Colombia — Fundación Internacional Amigos Sin Fronteras",
      description:
        "Reseña histórica de FUNASF nacida en Panamá y desarrollada en Colombia: misión, visión, sede en Cali, labor comunitaria y proyección en el departamento del Atlántico y Valledupar.",
      canonicalPath: "/quienes-somos",
      keywords:
        "Quiénes somos FUNASF, FUNASF Colombia, historia FUNASF Panamá Colombia, misión visión FUNASF, sede FUNASF Cali, presencia Atlántico Soledad, EduFUNASF",
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Quiénes somos", path: "/quienes-somos" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Quiénes somos — FUNASF",
          url: `${SITE_URL}/quienes-somos`,
          description:
            "Misión, visión, valores y reseña histórica de la Fundación Internacional Amigos Sin Fronteras.",
        },
      ],
    }),
  component: QuienesSomos,
});

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const pendiente = valor === PENDIENTE;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{etiqueta}: </span>
      <span className={pendiente ? "text-brand-brown font-semibold" : "text-foreground"}>
        {pendiente ? "[DATO PENDIENTE]" : valor}
      </span>
    </p>
  );
}

function QuienesSomos() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Somos los pies, las manos y la voz de los más necesitados"
        description={quienesSomos.intro}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            {quienesSomos.parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h2 className="text-foreground pt-4 text-2xl">Nuestro compromiso</h2>
            <p>{quienesSomos.compromiso}</p>
            <p className="border-brand-green text-foreground mt-6 border-l-4 pl-5 text-lg font-medium italic">
              {quienesSomos.destacado}
            </p>
          </div>
          <div className="aspect-[4/3] w-full">
            <MediaPlaceholder label="[FOTOGRAFÍA INSTITUCIONAL PENDIENTE]" />
          </div>
        </div>
      </Section>

      <Section id="mision" tone="soft">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Misión" title="Nuestra razón de ser" />
            <div className="text-muted-foreground mt-6 space-y-4 leading-relaxed">
              {mision.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div id="vision" className="scroll-mt-28">
            <SectionHeading eyebrow="Visión" title="Hacia dónde vamos" />
            <div className="text-muted-foreground mt-6 space-y-4 leading-relaxed">
              {vision.parrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <h3 className="text-foreground mt-8 text-xl">Para el futuro queremos</h3>
            <ul className="text-muted-foreground mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {vision.futuro.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="bg-brand-gold mt-2 size-1.5 shrink-0 rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="resena-historica">
        <SectionHeading eyebrow="Reseña histórica" title={resenaHistorica.titulo} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            {resenaHistorica.parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="space-y-4 pt-4">
              {resenaHistorica.destacados.map((d) => (
                <p
                  key={d}
                  className="border-brand-brown text-foreground border-l-4 pl-5 font-medium italic"
                >
                  {d}
                </p>
              ))}
            </div>
          </div>
          <div className="aspect-[3/4] w-full">
            <MediaPlaceholder label="[FOTOGRAFÍA HISTÓRICA PENDIENTE]" />
          </div>
        </div>
      </Section>

      <Section id="proposito" tone="surface">
        <SectionHeading
          eyebrow="Nuestro propósito"
          title={proposito.titulo}
          description={proposito.intro}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proposito.ejes.map((e) => {
            const Icono = iconos[e.icono] ?? GraduationCap;
            return (
              <article key={e.nombre} className="card-institucional p-6">
                <Icono aria-hidden className="text-primary size-7" />
                <h3 className="text-brand-green-deep mt-3 text-lg font-semibold">{e.nombre}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{e.texto}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="valores">
        <SectionHeading eyebrow="Nuestros valores" title="Principios que guían nuestro trabajo" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v) => (
            <div key={v.nombre} className="border-border bg-card rounded-xl border p-5">
              <h3 className="text-brand-green-deep text-base">{v.nombre}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="alcance" tone="soft">
        <SectionHeading
          eyebrow="Nuestro alcance"
          title="Dónde estamos"
          description={alcance.intro}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="card-institucional p-6">
            <h3 className="text-brand-green-deep text-base font-semibold">Presencia actual</h3>
            <ul className="text-muted-foreground mt-3 space-y-2.5 text-sm">
              {alcance.presencia.map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <MapPin aria-hidden className="text-primary size-4 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Proyección</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.proyeccion.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-brand-brown mt-8 text-xl font-medium italic">{alcance.destacado}</p>
      </Section>

      <Section id="sedes">
        <SectionHeading eyebrow="Sedes" title="Nuestros territorios" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {sedes.map((s) => (
            <article key={s.ciudad} className="card-institucional">
              <div className="aspect-[4/3] w-full">
                <MediaPlaceholder label={s.imagenPendiente} />
              </div>
              <h3 className="text-brand-green-deep mt-5 flex items-center gap-2 text-lg">
                <MapPin aria-hidden className="size-4" /> {s.ciudad}, {s.pais}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.descripcion}</p>
              <div className="mt-4 space-y-1.5">
                <Dato etiqueta="Dirección" valor={s.direccion} />
                <Dato etiqueta="Teléfono" valor={s.telefono ?? PENDIENTE} />
                <Dato etiqueta="WhatsApp" valor={s.whatsapp ?? PENDIENTE} />
                <Dato etiqueta="Horario" valor={s.horario} />
                <Dato etiqueta="Mapa" valor={s.mapa} />
              </div>
            </article>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
          <Phone aria-hidden className="size-4" />
          Los datos marcados como pendientes serán publicados cuando FUNASF los suministre.
        </p>
      </Section>

      <Section tone="deep">
        <SectionHeading invert eyebrow="Transparencia" title="Nuestro compromiso institucional" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {transparencia.map((t) => (
            <div
              key={t.nombre}
              className="border-primary-foreground/20 bg-primary-foreground/5 rounded-xl border p-5"
            >
              <h3 className="text-brand-gold text-base">{t.nombre}</h3>
              <p className="text-primary-foreground/80 mt-2 text-sm leading-relaxed">{t.texto}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
