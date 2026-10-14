import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocenteLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

export function DocenteLayout({ children, title, subtitle, breadcrumbs }: DocenteLayoutProps) {
  const { user, profile, role, isDocente, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate({
          to: "/admin/login",
          search: { redirect: location.pathname, reason: "requiere_docente" },
        });
      } else if (!isDocente) {
        navigate({
          to: "/admin/login",
          search: { redirect: location.pathname, reason: "requiere_docente" },
        });
      }
    }
  }, [user, isDocente, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green animate-spin">
            <GraduationCap className="size-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">Cargando Portal Docente FUNASF...</p>
        </div>
      </div>
    );
  }

  if (!user || !isDocente) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header Institucional */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo y Marca */}
            <div className="flex items-center gap-3">
              <Link to="/docente" className="flex items-center gap-2">
                <Logo size="sm" showSubtitle={false} />
                <span className="hidden sm:inline-block h-5 w-px bg-slate-200" />
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold text-[11px] px-2 py-0.5"
                >
                  <GraduationCap className="size-3 mr-1 text-emerald-600" />
                  Portal Docente
                </Badge>
              </Link>
            </div>

            {/* Acciones de usuario en Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/docente"
                className="text-xs font-semibold text-slate-700 hover:text-brand-green px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Mis Cursos Asignados
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1"
                >
                  <ShieldCheck className="size-3" />
                  Panel Admin
                </Link>
              )}

              <div className="h-4 w-px bg-slate-200" />

              <div className="flex items-center gap-3 pl-1">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-bold text-xs">
                  {(profile?.nombre_completo?.[0] || user.email?.[0] || "D").toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {profile?.nombre_completo || "Docente"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {profile?.usuario ? `@${profile.usuario}` : user.email}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/admin/login" });
                }}
                className="text-xs text-slate-600 hover:text-destructive hover:bg-destructive/10 h-8 px-2.5"
                title="Cerrar sesión docente"
              >
                <LogOut className="size-3.5 mr-1.5" />
                Salir
              </Button>
            </div>

            {/* Botón Móvil */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="size-9 p-0"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-bold text-sm">
                {(profile?.nombre_completo?.[0] || user.email?.[0] || "D").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {profile?.nombre_completo || "Docente"}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                to="/docente"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 py-2 px-2 rounded-lg hover:bg-slate-100"
              >
                <BookOpen className="size-4 text-emerald-600" />
                Mis Cursos Asignados
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-700 py-2 px-2 rounded-lg hover:bg-amber-50"
                >
                  <ShieldCheck className="size-4 text-amber-600" />
                  Ir al Panel de Administrador
                </Link>
              )}

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-slate-600 py-2 px-2 rounded-lg hover:bg-slate-100"
              >
                <ExternalLink className="size-4" />
                Sitio Web Institucional
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/admin/login" });
                }}
                className="w-full text-xs font-semibold"
              >
                <LogOut className="size-3.5 mr-1.5" />
                Cerrar Sesión Docente
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumbs y Barra de Contexto */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-slate-100/70 border-b border-slate-200/80 px-4 py-2 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto">
            <Link to="/docente" className="hover:text-emerald-700 font-medium">
              Docente
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5 shrink-0">
                <ChevronRight className="size-3 text-slate-400" />
                {crumb.to ? (
                  <Link to={crumb.to as any} className="hover:text-emerald-700 font-medium">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {(title || subtitle) && (
          <div className="mb-6 sm:mb-8">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Footer del Portal Docente */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FUNASF — Sistema de Gestión y Acreditación Académica</span>
          <span className="text-[11px] text-slate-400">
            Soporte Académico:{" "}
            <a href="mailto:academico@edufunasf.org" className="underline hover:text-emerald-700">
              academico@edufunasf.org
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
