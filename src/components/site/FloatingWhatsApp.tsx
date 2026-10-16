import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/data/funasf";

export function FloatingWhatsApp() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("funasf_wa_closed") === "true") {
        setClosed(true);
      }
    } catch {
      // Manejar entornos con almacenamiento deshabilitado o modo incógnito restringido
    }
  }, []);

  const handleClose = () => {
    setClosed(true);
    try {
      sessionStorage.setItem("funasf_wa_closed", "true");
    } catch {
      // Ignorar excepciones si sessionStorage no está disponible o está restringido
    }
  };

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

  const shouldShowTooltip = !closed && pathname !== "/contacto";

  return (
    <div
      className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2"
      aria-label="Atención directa por WhatsApp"
    >
      {/* Tooltip flotante con llamada a la acción */}
      {shouldShowTooltip && (
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
            onClick={handleClose}
            className="text-muted-foreground/60 hover:text-muted-foreground p-2 -mr-1 rounded-md transition-colors cursor-pointer"
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
        className="group relative flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 transition-[transform,background-color,box-shadow] duration-200 hover:scale-105 hover:bg-emerald-500 active:scale-95"
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
