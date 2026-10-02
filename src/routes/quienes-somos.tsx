import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
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

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string | undefined }) {
  if (!valor) return null;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{etiqueta}: </span>
      <span className="text-foreground font-medium">{valor}</span>
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
            <h2 className="text-foreground pt-4 text-2xl font-bold font-display">
              Nuestro compromiso
            </h2>
            <p>{quienesSomos.compromiso}</p>
            <p className="border-brand-green text-foreground mt-6 border-l-4 pl-5 text-lg font-medium italic">
              {quienesSomos.destacado}
            </p>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-md bg-muted">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Compromiso social y formación para el futuro FUNASF"
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
            />
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
          <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border shadow-md bg-muted">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
              alt="Historia y proyección internacional FUNASF Panamá y Colombia"
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              decoding="async"
              width={800}
              height={1067}
            />
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
          {proposito.ejes.map((e) => (
            <article key={e.nombre} className="card-institucional">
              <h3 className="text-brand-green-deep text-lg">{e.nombre}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{e.texto}</p>
            </article>
          ))}
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
          <div className="card-institucional">
            <h3 className="text-brand-green-deep text-base">Presencia actual</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              {alcance.presencia.map((m) => (
                <li key={m}>{m}</li>
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
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
                {"imagenUrl" in s && s.imagenUrl ? (
                  <img
                    src={s.imagenUrl as string}
                    alt={`Sede ${s.ciudad}, ${s.pais}`}
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    width={800}
                    height={600}
                  />
                ) : (
                  <MediaPlaceholder label={s.imagenPendiente} />
                )}
              </div>
              <h3 className="text-brand-green-deep mt-5 flex items-center gap-2 text-lg font-bold">
                <MapPin aria-hidden className="size-4 text-brand-green" /> {s.ciudad}, {s.pais}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.descripcion}</p>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <Dato etiqueta="Ubicación" valor={s.direccion} />
                <Dato etiqueta="Línea de contacto" valor={s.telefono} />
                <Dato etiqueta="Horario" valor={s.horario} />
                {"modalidad" in s && s.modalidad ? (
                  <Dato etiqueta="Modalidad" valor={s.modalidad as string} />
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 flex items-center gap-2 text-xs">
          <Phone aria-hidden className="size-4 text-brand-green shrink-0" />
          Para concertar citas institucionales o recibir asesoría presencial en sede, comunícate a
          nuestras líneas telefónicas oficiales.
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
