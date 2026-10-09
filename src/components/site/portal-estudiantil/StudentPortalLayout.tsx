import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  LifeBuoy,
  LogOut,
  ExternalLink,
  Laptop,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/site/Logo";
import { useAuth } from "@/lib/auth-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import { getMainSiteUrl, isStudentSubdomain } from "@/lib/subdomain";
import { cn } from "@/lib/utils";

interface StudentPortalLayoutProps {
  children: ReactNode;
}

export function StudentPortalLayout({ children }: StudentPortalLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { settings } = useSiteSettings();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onSubdomain = isStudentSubdomain();
  const mainSiteUrl = getMainSiteUrl();

  const org = settings.org;
  const telefonoPrincipal = settings.contacto.telefonoPrincipal;

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Header Dedicado del Portal Estudiantil */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <Logo variant="horizontal" size="sm" showSubtitle={false} />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-green-deep bg-brand-green-soft px-2.5 py-1 rounded-full">
              <GraduationCap className="size-3.5" />
              <span>Portal Estudiantil</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Si está en subdominio, botón sutil para ir al portal informativo general */}
            <a
              href={mainSiteUrl}
              className="text-xs text-slate-500 hover:text-slate-800 hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span>Ir a edufunasf.org</span>
            </a>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {profile?.nombre_completo || user.email?.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-slate-500">Estudiante</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5 h-8 px-2.5"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
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
              className="md:hidden size-8 text-slate-600"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Menú colapsable en móvil */}
        {menuAbierto && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-in slide-in-from-top duration-200">
            <a
              href="#expediente"
              onClick={() => setMenuAbierto(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Consulta de Notas
            </a>
            <a
              href="#plataformas"
              onClick={() => setMenuAbierto(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Aulas y Plataformas
            </a>
            <a
              href="#tramites"
              onClick={() => setMenuAbierto(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Trámites y Certificados
            </a>
            <a
              href="#calendario"
              onClick={() => setMenuAbierto(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Calendario Académico
            </a>
            <div className="border-t border-slate-100 pt-2">
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

      {/* 2. Barra de Navegación de Pestañas del Portal (Desktop) */}
      <nav
        aria-label="Navegación del portal de estudiantes"
        className="bg-white border-b border-slate-200/80 hidden md:block"
      >
        <div className="container-page flex items-center gap-1 overflow-x-auto py-1">
          <a
            href="#expediente"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg transition-colors"
          >
            <GraduationCap className="size-3.5 text-brand-green" />
            <span>Registro de Notas</span>
          </a>
          <a
            href="#plataformas"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Laptop className="size-3.5 text-brand-green" />
            <span>Aulas Virtuales</span>
          </a>
          <a
            href="#tramites"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileText className="size-3.5 text-brand-green" />
            <span>Trámites y Certificados</span>
          </a>
          <a
            href="#calendario"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Calendar className="size-3.5 text-brand-green" />
            <span>Calendario Académico</span>
          </a>
        </div>
      </nav>

      {/* 3. Contenido Principal */}
      <main className="flex-1">{children}</main>

      {/* 4. Footer Específico del Portal Académico */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">EduFUNASF</span>
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
              <Phone className="size-3" /> Orientación
            </a>
            <a
              href={mainSiteUrl}
              className="hover:text-brand-green flex items-center gap-1"
            >
              <ExternalLink className="size-3" /> edufunasf.org
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
