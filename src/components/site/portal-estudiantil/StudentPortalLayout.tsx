import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Menu,
  X,
  Laptop,
  FileText,
  Calendar,
  LogOut,
  Mail,
  MessageCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { org } from "@/data/funasf";
import { useAuth } from "@/lib/auth-context";

const PORTAL_TABS = [
  { hash: "#expediente", label: "Registro de Notas", mobileLabel: "Consulta de Notas", icon: GraduationCap },
  { hash: "#plataformas", label: "Aulas Virtuales", mobileLabel: "Aulas y Plataformas", icon: Laptop },
  { hash: "#tramites", label: "Trámites y Certificados", mobileLabel: "Trámites y Certificados", icon: FileText },
  { hash: "#calendario", label: "Calendario Académico", mobileLabel: "Calendario Académico", icon: Calendar },
] as const;

export function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("#expediente");
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const mainSiteUrl = "/";

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* 1. Header Superior Específico del Portal de Estudiantes */}
      <header className="sticky top-0 z-40 bg-card border-b border-border/90 shadow-2xs">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Identidad de Marca Institucional */}
          <div className="flex items-center gap-3">
            <Link
              to="/portal-estudiantil"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-brand-green text-white shadow-xs">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-foreground tracking-tight">
                    EduFUNASF
                  </span>
                  <span className="inline-flex items-center rounded-md bg-brand-green/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand-green ring-1 ring-brand-green/20">
                    Estudiantes
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground -mt-0.5">
                  Fundación Amigos Sin Fronteras
                </span>
              </div>
            </Link>
          </div>

          {/* Acciones del Estudiante y Perfil */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex text-xs text-muted-foreground hover:text-brand-green"
            >
              <a href={mainSiteUrl}>← Volver a FUNASF</a>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {profile?.nombre_completo || "Estudiante"}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 h-8 px-2.5"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </Button>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-brand-green hover:bg-brand-green-deep text-white font-medium text-xs h-8 px-3"
              >
                <Link
                  to="/admin/login"
                  search={{ portal: "estudiante", redirect: "/portal-estudiantil" }}
                >
                  Ingresar con mi cuenta
                </Link>
              </Button>
            )}

            {/* Botón menú móvil */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={menuAbierto ? "Cerrar menú del portal" : "Abrir menú del portal"}
              className="md:hidden size-11 text-muted-foreground"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Menú colapsable en móvil */}
        {menuAbierto && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-1.5 animate-in slide-in-from-top duration-200">
            {PORTAL_TABS.map((tab) => {
              const isActive = activeHash === tab.hash;
              return (
                <a
                  key={tab.hash}
                  href={tab.hash}
                  onClick={() => {
                    setActiveHash(tab.hash);
                    setMenuAbierto(false);
                  }}
                  aria-current={isActive ? "location" : undefined}
                  className={`block rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-green/10 text-brand-green-deep"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {tab.mobileLabel}
                </a>
              );
            })}
            <div className="border-t border-border pt-2">
              <a
                href={mainSiteUrl}
                className="block rounded-lg px-3 py-2 text-xs text-brand-green font-medium"
              >
                ← Volver al sitio web principal
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Barra de Navegación de Pestañas del Portal (Optimizada para Móvil y Desktop) */}
      <nav
        aria-label="Navegación del portal de estudiantes"
        className="bg-card border-b border-border/80 sticky top-16 z-30 shadow-2xs"
      >
        <div className="container-page flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {PORTAL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeHash === tab.hash;
            return (
              <a
                key={tab.hash}
                href={tab.hash}
                onClick={() => setActiveHash(tab.hash)}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  isActive
                    ? "bg-brand-green text-white border-brand-green font-semibold shadow-2xs"
                    : "font-medium text-foreground/80 hover:text-brand-green hover:bg-muted/60 border-border/70"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-white" : "text-brand-green"}`} />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* 3. Contenido Principal */}
      <main className="flex-1">{children}</main>

      {/* 4. Footer Específico del Portal Académico */}
      <footer className="border-t border-border bg-card py-8 text-xs text-muted-foreground">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">EduFUNASF</span>
            <span>—</span>
            <span>Campus Virtual & Secretaría Académica</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${org.correo}`}
              className="hover:text-brand-green flex items-center gap-1"
            >
              <Mail className="size-3" /> Soporte
            </a>
            <a
              href={`https://wa.me/57${org.telefonos[0]?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-green flex items-center gap-1"
            >
              <MessageCircle className="size-3" /> WhatsApp
            </a>
            <Link
              to="/admin/login"
              className="hover:text-brand-green flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Panel Administrativo FUNASF"
            >
              <Lock className="size-3" /> Panel Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
