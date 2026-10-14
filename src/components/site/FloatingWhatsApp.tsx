import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/data/funasf";

export function FloatingWhatsApp() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [closed, setClosed] = useState(false);

  // No mostrar en áreas privadas ni donde ya hay formulario activo
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/docente") ||
    pathname.startsWith("/portal-estudiantil") ||
    pathname === "/inscripcion"
  ) {
    return null;
  }

  const defaultWaUrl = `${whatsappLink}?text=${encodeURIComponent(
    "Hola FUNASF, deseo recibir asesoría sobre las becas solidarias y los programas técnicos laborales.",
  )}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2"
      aria-label="Atención directa por WhatsApp"
    >
      {/* Tooltip flotante con llamada a la acción */}
      {!closed && (
        <div className="flex items-center gap-2 rounded-2xl bg-card border border-border/80 px-4 py-2.5 shadow-xl shadow-black/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Admisiones FUNASF
            </span>
            <span className="text-[11px] text-muted-foreground">
              ¿Deseas información sobre becas y programas? ¡Chatea con nosotros!
            </span>
          </div>

          <button
            type="button"
            onClick={() => setClosed(true)}
            className="text-muted-foreground/60 hover:text-muted-foreground p-1 rounded-md transition-colors"
            aria-label="Cerrar mensaje de WhatsApp"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Botón flotante WhatsApp */}
      <a
        href={defaultWaUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 transition-all duration-300 hover:scale-110 hover:bg-emerald-500 active:scale-95"
        aria-label="Contactar a admisiones de FUNASF por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex size-3.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </span>
        <MessageCircle className="size-7 fill-white/10 group-hover:scale-105 transition-transform" />
      </a>
    </div>
  );
}
