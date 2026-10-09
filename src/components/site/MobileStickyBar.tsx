import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/funasf";

export function MobileStickyBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // No mostrar en la propia página de inscripción, ni en contacto, ni en el portal de notas, ni en el panel de administración
  if (
    pathname === "/inscripcion" ||
    pathname === "/contacto" ||
    pathname.startsWith("/portal-estudiantil") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  // Detectar si el usuario está explorando un programa específico para transferirlo a la postulación
  const isProgramaDetail = pathname.startsWith("/programas/") && pathname !== "/programas/";
  const programaSlug = isProgramaDetail
    ? pathname.replace("/programas/", "").split("/")[0]
    : undefined;

  return (
    <aside
      aria-label="Acciones rápidas para móvil"
      className="fixed bottom-0 inset-x-0 z-40 block sm:hidden border-t border-border/80 bg-background/95 backdrop-blur-md px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-2">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar por WhatsApp"
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-3.5 text-xs font-semibold text-emerald-800 transition-colors active:bg-emerald-100"
        >
          <MessageCircle className="size-4 text-emerald-600" />
          <span>WhatsApp</span>
        </a>

        <Link
          to="/inscripcion"
          {...(programaSlug ? { search: { programa: programaSlug } } : {})}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all active:scale-[0.98] active:bg-brand-green-deep"
        >
          <GraduationCap className="size-4 text-brand-gold" />
          <span>{programaSlug ? "Postularme a esta Beca" : "Postularme a Beca"}</span>
        </Link>
      </div>
    </aside>
  );
}
