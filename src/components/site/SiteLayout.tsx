import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileStickyBar } from "./MobileStickyBar";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Solo aplicar espaciado inferior en móviles cuando la barra sticky está activa
  const hasMobileStickyBar =
    pathname !== "/inscripcion" &&
    pathname !== "/contacto" &&
    !pathname.startsWith("/portal-estudiantil") &&
    !pathname.startsWith("/admin");

  return (
    <div className={cn("flex min-h-screen flex-col", hasMobileStickyBar && "pb-14 sm:pb-0")}>
      <a
        href="#contenido"
        className="bg-primary text-primary-foreground sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Ir al contenido principal
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
