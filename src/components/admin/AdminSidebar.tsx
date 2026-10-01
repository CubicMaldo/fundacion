import { Link, useLocation } from "@tanstack/react-router";
import {
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Shield,
  Sliders,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Programas", to: "/admin/programas", icon: GraduationCap },
  { label: "Blog", to: "/admin/blog", icon: Newspaper },
  { label: "Galería", to: "/admin/galeria", icon: ImageIcon },
  { label: "Inscripciones", to: "/admin/inscripciones", icon: ClipboardList },
  { label: "Mensajes", to: "/admin/mensajes", icon: Inbox },
  { label: "Configuración", to: "/admin/configuracion", icon: Sliders },
  { label: "Usuarios", to: "/admin/usuarios", icon: Users, adminOnly: true },
];

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { profile, role, isAdmin, signOut, isConfigured } = useAuth();

  const isCurrent = (to: string) => {
    if (to === "/admin") return pathname === "/admin";
    return pathname.startsWith(to);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card text-card-foreground shadow-sm">
      {/* Cabecera Sidebar */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-green text-primary-foreground font-bold font-display text-lg">
            F
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-tight text-foreground">
              FUNASF CMS
            </span>
            <span className="block text-[11px] text-muted-foreground font-medium">
              Panel Administrativo
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="md:hidden size-8"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Perfil del usuario activo */}
      <div className="border-b border-border p-4 bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold-deep font-semibold text-sm">
            {(profile?.nombre_completo?.[0] ?? profile?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {profile?.nombre_completo || "Usuario"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  isAdmin
                    ? "bg-brand-green/15 text-brand-green-deep"
                    : "bg-brand-brown/15 text-brand-brown"
                )}
              >
                <Shield className="size-2.5" />
                {role === "admin" ? "Administrador" : "Editor"}
              </span>
            </div>
          </div>
        </div>

        {!isConfigured && (
          <div className="mt-3 rounded-md bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-700 dark:text-amber-400">
            Modo local / demostración activo.
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Navegación del panel">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const active = isCurrent(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-green text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      {/* Acciones inferiores */}
      <div className="border-t border-border p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" />
          <span>Ver sitio web</span>
        </a>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
