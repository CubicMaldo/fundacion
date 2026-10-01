import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login
    if (!isLoading && !user && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
            <Loader2 className="size-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Cargando panel administrativo
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Verificando credenciales de acceso...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user && location.pathname !== "/admin/login") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20 text-foreground">
      {/* Sidebar Escritorio */}
      <div className="hidden md:flex md:w-64 md:shrink-0">
        <div className="fixed inset-y-0 z-30 flex w-64 flex-col">
          <AdminSidebar />
        </div>
      </div>

      {/* Sidebar Móvil (Overlay / Drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMobile={() => setMobileOpen(true)} title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
