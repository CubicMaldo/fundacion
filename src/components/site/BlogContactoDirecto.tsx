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
import type { InfoContactoPost } from "@/services/api";

interface BlogContactoDirectoProps {
  contacto?: InfoContactoPost | null;
  postTitulo: string;
  categoria?: string;
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

  const rawWhatsapp = contacto?.whatsapp?.trim() || telefonoPrincipal;
  const waDigits = cleanPhoneForWa(rawWhatsapp);
  const waMensaje =
    contacto?.mensajeWhatsapp?.trim() ||
    `Hola FUNASF, deseo recibir más información sobre la publicación: "${postTitulo}".`;
  const waUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(waMensaje)}`;

  const rawTelefono = contacto?.telefono?.trim() || telefonoPrincipal;
  const telDigits = rawTelefono.replace(/[^\d+]/g, "");

  const email = contacto?.correo?.trim() || org.correo;
  const emailSubject = `Consulta sobre: ${postTitulo}`;
  const emailBody = `Hola equipo FUNASF,\n\nEscribo con relación al artículo "${postTitulo}" publicado en su portal.\n\nNombre:\nCiudad:\nTeléfono de contacto:\n\nConsulta:\n`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const formUrl = contacto?.enlacePostulacion?.trim() || org.formularioInscripcion;

  const titulo =
    contacto?.titulo?.trim() ||
    (categoria === "Convocatorias" || categoria === "Educación"
      ? "¿Deseas postularte o tienes dudas sobre este programa?"
      : "¿Tienes dudas o deseas atención personalizada?");

  const descripcion =
    contacto?.descripcion?.trim() ||
    "Comunícate directamente con nuestro equipo de orientadores y admisiones de FUNASF. Te brindamos asesoría inmediata y sin costo.";

  return (
    <>
      {/* Tarjeta Principal de Contacto Directo en el Artículo */}
      <section
        aria-label="Contacto directo con la Fundación"
        className="my-10 overflow-hidden rounded-2xl border-2 border-brand-green/25 bg-gradient-to-br from-brand-cream/80 via-white to-brand-green/5 dark:from-card dark:to-card/60 p-6 sm:p-8 shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-brand-green" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              Atención y Contacto Directo
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-green" />
            <span>Canal institucional verificado</span>
          </div>
        </div>

        <div className="mt-4 max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {titulo}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {descripcion}
          </p>
        </div>

        {/* Canales de Contacto Directo */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Botón Principal WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-emerald-500/30 bg-[#25D366]/10 hover:bg-[#25D366]/15 dark:bg-[#25D366]/15 dark:hover:bg-[#25D366]/20 p-4 transition-all duration-200 hover:shadow-md hover:border-emerald-500/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#25D366] text-white shadow-xs">
                  <MessageCircle className="size-5 fill-current" />
                </div>
                <span className="rounded-full bg-[#25D366]/20 px-2 py-0.5 text-[11px] font-semibold text-[#128C7E] dark:text-emerald-300">
                  Respuesta rápida
                </span>
              </div>
              <p className="mt-3 font-semibold text-foreground text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Escribir a WhatsApp
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{rawWhatsapp}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#128C7E] dark:text-emerald-400">
              <span>Abrir chat directo</span>
              <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>

          {/* Botón Línea Telefónica */}
          <a
            href={`tel:${telDigits}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/60 hover:bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-brand-green/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green shadow-xs">
                  <Phone className="size-5" />
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Llamada
                </span>
              </div>
              <p className="mt-3 font-semibold text-foreground text-sm group-hover:text-brand-green">
                Línea Telefónica Directa
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{rawTelefono}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-green">
              <span>Llamar ahora</span>
              <Phone className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>

          {/* Botón Correo Electrónico */}
          <a
            href={mailtoUrl}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/60 hover:bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-brand-green/50 sm:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-brown/10 text-brand-brown shadow-xs">
                  <Mail className="size-5" />
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Correo
                </span>
              </div>
              <p className="mt-3 font-semibold text-foreground text-sm group-hover:text-brand-brown">
                Atención por Correo
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{email}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-brown">
              <span>Redactar correo</span>
              <Mail className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        </div>

        {/* Enlace opcional a Formulario de Inscripción / Postulación */}
        {formUrl && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 dark:bg-brand-green/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  ¿Listo para postularte? Completa tu registro en línea
                </p>
                <p className="text-xs text-muted-foreground">
                  Diligencia tus datos básicos y un asesor validará tu postulación a beca.
                </p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground shrink-0"
            >
              <a href={formUrl} target="_blank" rel="noopener noreferrer">
                Formulario de Inscripción <ExternalLink className="size-3 ml-1.5" />
              </a>
            </Button>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-brand-green shrink-0" />
          <span>
            Horario de atención oficial: Lunes a Viernes de 8:00 a. m. a 6:00 p. m. y Sábados de
            8:00 a. m. a 1:00 p. m.
          </span>
        </div>
      </section>

      {/* Barra Flotante Fija en Móvil */}
      {!mobileBarDismissed && (
        <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden">
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/30 bg-background/95 p-2.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                <MessageCircle className="size-5 fill-current" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-foreground truncate">
                  ¿Preguntas sobre este post?
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  Atención directa WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                asChild
                size="sm"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold h-8 px-3 text-xs"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="icon"
                className="size-8 rounded-lg"
                aria-label="Llamar directamente"
              >
                <a href={`tel:${telDigits}`}>
                  <Phone className="size-3.5 text-brand-green" />
                </a>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileBarDismissed(true)}
                className="size-7 text-muted-foreground hover:text-foreground"
                aria-label="Cerrar barra flotante"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
