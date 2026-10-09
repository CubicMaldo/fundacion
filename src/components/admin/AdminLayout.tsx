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
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Si el usuario autenticado tiene rol estudiante, no debe acceder al CMS administrativo.
    // Redirigir a login con aviso para permitir cambiar a credenciales de administrador.
    if (!isLoading && user && role === "estudiante") {
      navigate({
        to: "/admin/login",
        search: { redirect: location.pathname, reason: "requiere_admin" },
      });
      return;
    }

    // Si no está cargando y no hay usuario, redirigir a login
    if (!isLoading && !user && location.pathname !== "/admin/login") {
      navigate({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
  }, [user, role, isLoading, location.pathname, navigate]);

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

  // Si no hay usuario autenticado o tiene rol estudiante, no renderizar el CMS (esperar redirección)
  if (!user || role === "estudiante") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onOpenMobile={() => setMobileOpen(true)} title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
