import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { org, telefonoPrincipal, whatsappLink } from "@/data/funasf";
import { ModalInscripcion } from "@/components/site/ModalInscripcion";
import type { InfoContactoPost } from "@/services/api";

export interface BlogContactoDirectoProps {
  contacto?: InfoContactoPost | null | undefined;
  postTitulo: string;
  categoria?: string | undefined;
}

function cleanPhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "573135779384";
  return digits.startsWith("57") ? digits : `57${digits}`;
}

export function BlogContactoDirecto({ contacto, postTitulo, categoria }: BlogContactoDirectoProps) {
  const [mobileBarDismissed, setMobileBarDismissed] = useState(false);

  // Si expresamente está desactivado en la configuración del post
  if (contacto && contacto.activo === false) {
    return null;
  }

  // Valores dinámicos con respaldo institucional
  const tituloBloque = contacto?.titulo || "Orientación y Admisiones FUNASF";
  const descBloque =
    contacto?.descripcion ||
    "¿Te interesa este programa o deseas postularte a beneficios de beca? Nuestro equipo te acompaña en cada paso.";
  const waNumero = contacto?.whatsapp ? cleanPhoneForWa(contacto.whatsapp) : "573135779384";
  const waMensaje = encodeURIComponent(
    contacto?.mensajeWhatsapp ||
      `Hola FUNASF, estuve leyendo el artículo "${postTitulo}" y me gustaría recibir más información.`,
  );
  const waHref = `https://wa.me/${waNumero}?text=${waMensaje}`;
  const telBloque = contacto?.telefono || telefonoPrincipal;
  const telHref = `tel:+${telBloque.replace(/\D/g, "")}`;
  const correoBloque = contacto?.correo || org.correo;
  const enlaceExterno = contacto?.enlacePostulacion;

  return (
    <>
      {/* 1. Bloque incrustado al final del artículo */}
      <section className="my-10 rounded-2xl border border-brand-green/20 bg-gradient-to-br from-emerald-500/5 via-brand-green/5 to-amber-500/5 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
              <Sparkles className="size-3.5" />
              <span>Canal Directo de Orientación</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              {tituloBloque}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {descBloque}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Button
              asChild
              className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold shadow-xs"
            >
              <a href={waHref} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4 mr-2" />
                WhatsApp Directo
              </a>
            </Button>

            {enlaceExterno ? (
              <Button asChild variant="outline" className="border-border">
                <a href={enlaceExterno} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4 mr-2" />
                  Formulario Oficial
                </a>
              </Button>
            ) : (
              <ModalInscripcion
                programaNombre={categoria ? `${categoria} — Consulta` : undefined}
                triggerButton={
                  <Button variant="outline" className="border-brand-green/30 text-brand-green-deep hover:bg-brand-green/10">
                    <GraduationCap className="size-4 mr-2" />
                    Postularme a Beca
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Canales secundarios */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
          <a href={telHref} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Phone className="size-3.5 text-brand-green" />
            <span>{telBloque}</span>
          </a>
          <a href={`mailto:${correoBloque}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Mail className="size-3.5 text-brand-green" />
            <span>{correoBloque}</span>
          </a>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>Atención Institucional FUNASF</span>
          </span>
        </div>
      </section>

      {/* 2. Barra flotante en móviles para no perder la conversión */}
      {!mobileBarDismissed && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 shadow-lg lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {tituloBloque}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                Respuesta inmediata por WhatsApp
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild size="sm" className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold">
                <a href={waHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-3.5 mr-1" />
                  Escribir
                </a>
              </Button>
              <button
                type="button"
                onClick={() => setMobileBarDismissed(true)}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Cerrar barra"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
