import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Instagram, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { org, telefonoPrincipal, whatsappLink } from "@/data/funasf";
import { enviarMensajeContacto } from "@/services/api";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | FUNASF" },
      {
        name: "description",
        content:
          "Canales oficiales de contacto de la Fundación Internacional Amigos Sin Fronteras.",
      },
      { property: "og:title", content: "Contacto | FUNASF" },
      {
        property: "og:description",
        content: "Habla con FUNASF sobre programas, becas, voluntariado y alianzas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoExito, setEnviadoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErrorMsg(null);

    const res = await enviarMensajeContacto({
      nombre,
      correo,
      telefono: telefono || undefined,
      asunto,
      mensaje,
    });

    setEnviando(false);
    if (res.ok) {
      setEnviadoExito(true);
      setNombre("");
      setCorreo("");
      setTelefono("");
      setAsunto("");
      setMensaje("");
    } else {
      setErrorMsg(res.error || "No se pudo enviar el mensaje. Por favor intenta por WhatsApp.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Una oportunidad puede comenzar con una conversación"
        description="Estamos para orientarte sobre nuestros programas, becas, voluntariado y alianzas."
      />

      {/* Canales Oficiales Directos */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Canales oficiales"
            title="Hablemos"
            description="Elige el canal que te resulte más cómodo para comunicarte con la Fundación."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="card-institucional group"
            >
              <MessageCircle aria-hidden className="text-primary size-5" />
              <h2 className="text-foreground mt-4 text-xl">WhatsApp</h2>
              <p className="text-muted-foreground mt-2 text-sm">{telefonoPrincipal}</p>
            </a>
            <a href={`mailto:${org.correo}`} className="card-institucional group">
              <Mail aria-hidden className="text-brand-brown size-5" />
              <h2 className="text-foreground mt-4 text-xl">Correo</h2>
              <p className="text-muted-foreground mt-2 text-sm">{org.correo}</p>
            </a>
            <a
              href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}
              className="card-institucional group"
            >
              <Phone aria-hidden className="text-primary size-5" />
              <h2 className="text-foreground mt-4 text-xl">Líneas de atención</h2>
              <ul className="text-muted-foreground mt-2 text-sm space-y-1">
                {org.telefonos.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </a>
            <a
              href={org.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="card-institucional group"
            >
              <Instagram aria-hidden className="text-brand-brown size-5" />
              <h2 className="text-foreground mt-4 text-xl">Instagram</h2>
              <p className="text-muted-foreground mt-2 text-sm">{org.instagram}</p>
            </a>
          </div>
        </div>
      </Section>

      {/* Formulario de Mensaje Directo al Buzón */}
      <Section tone="soft">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow">Buzón directo</span>
            <h2 className="text-foreground mt-3 text-3xl font-display font-semibold">
              Envíanos un mensaje
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Déjanos tu consulta y nuestro equipo de atención se pondrá en contacto contigo.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            {enviadoExito ? (
              <div className="py-10 text-center space-y-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">¡Mensaje enviado con éxito!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Gracias por escribirnos. Tu mensaje ha sido recibido en nuestro buzón administrativo y te responderemos a la mayor brevedad.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setEnviadoExito(false)}
                  className="mt-4"
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                    {errorMsg}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-nombre">Nombre completo *</Label>
                    <Input
                      id="form-nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre y apellidos"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-correo">Correo electrónico *</Label>
                    <Input
                      id="form-correo"
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-telefono">Teléfono / WhatsApp (opcional)</Label>
                    <Input
                      id="form-telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. 315 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-asunto">Asunto de tu consulta *</Label>
                    <Input
                      id="form-asunto"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      placeholder="Ej. Consulta sobre becas o programas"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-mensaje">Mensaje *</Label>
                  <Textarea
                    id="form-mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Cuéntanos en qué podemos orientarte..."
                    rows={4}
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={enviando}
                    className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold min-w-[160px]"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" /> Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" /> Enviar mensaje
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* Sede Principal y Enlace a Formulario */}
      <Section tone="surface">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Sede principal</span>
            <h2 className="text-foreground mt-3 text-3xl">Cali, Valle del Cauca</h2>
            <p className="text-muted-foreground mt-3 flex items-center gap-2">
              <MapPin aria-hidden className="size-4" /> {org.direccionPrincipal}
            </p>
          </div>
          <Button asChild size="lg">
            <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
              Formulario de inscripción
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
