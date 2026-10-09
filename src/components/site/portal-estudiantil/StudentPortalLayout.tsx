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
  Sparkles,
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
  const contacto = settings.contacto;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onSubdomain, setOnSubdomain] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOnSubdomain(isStudentSubdomain());
  }, []);

  const mainSiteUrl = getMainSiteUrl();
  const studentEmail = user?.email || "";
  const studentName =
    profile?.nombre_completo ||
    (studentEmail ? (studentEmail.split("@")[0]?.replace(".", " ") ?? "Estudiante FUNASF") : "Estudiante FUNASF");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 text-slate-800 antialiased selection:bg-brand-green/20 selection:text-brand-green-deep">
      {/* 1. Barra superior académica exclusiva */}
      <div className="bg-brand-green-deep text-white border-b border-emerald-900/30 text-xs">
        <div className="container-page flex h-8 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wide text-emerald-100 text-[11px] sm:text-xs">
              Portal Académico Oficial &bull; FUNASF Estudiantes
            </span>
            <span className="hidden md:inline-block text-white/30">&bull;</span>
            <span className="hidden md:inline-block text-white/80 text-[11px]">
              Período Activo 2026-II
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href={`https://wa.me/${contacto.whatsappLlamadas || "573232946184"}?text=Hola%20Mesa%20de%20Ayuda%20FUNASF,%20necesito%20asistencia%20con%20mi%20portal%20de%20estudiante`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-brand-gold hover:text-white transition-colors"
            >
              <LifeBuoy className="size-3" />
              <span>Soporte Académico</span>
            </a>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <a
              href={mainSiteUrl}
              className="inline-flex items-center gap-1 font-medium text-emerald-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span>Ir al Sitio Institucional FUNASF</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Cabecera diferenciada del Portal Estudiantil */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="container-page flex h-20 items-center justify-between gap-4">
          {/* Identidad con insignia de Portal Estudiantil */}
          <div className="flex items-center gap-3">
            <Link
              to={onSubdomain ? "/" : "/portal-estudiantil"}
              className="flex items-center gap-2 group focus-visible:outline-hidden"
            >
              <div className="size-11 sm:size-12 shrink-0">
                <Logo variant="emblem" size="md" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-brand-green-deep">
                    EduFUNASF
                  </span>
                  <Badge className="bg-brand-green text-white hover:bg-brand-green border-none px-2 py-0 text-[10px] tracking-wider uppercase font-bold shadow-xs">
                    Campus Estudiantil
                  </Badge>
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-tight">
                  Servicios Académicos &bull; Expediente &bull; Aulas
                </span>
              </div>
            </Link>
          </div>

          {/* Navegación de escritorio específica del estudiante */}
          <nav className="hidden lg:flex items-center gap-1">
            <a
              href="#expediente"
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-green rounded-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              <GraduationCap className="size-3.5 text-brand-green" />
              <span>Mi Expediente</span>
            </a>
            <a
              href="#plataformas"
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-green rounded-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              <Laptop className="size-3.5 text-brand-green" />
              <span>Campus Virtual LMS</span>
            </a>
            <a
              href="#tramites"
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-green rounded-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              <FileText className="size-3.5 text-brand-green" />
              <span>Trámites & Solicitudes</span>
            </a>
            <a
              href="#calendario"
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-green rounded-md hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              <Calendar className="size-3.5 text-brand-green" />
              <span>Calendario</span>
            </a>
          </nav>

          {/* Acciones de usuario / sesión (hidratación segura) */}
          <div className="flex items-center gap-2">
            {mounted && user ? (
              <div className="flex items-center gap-2.5 bg-slate-100/90 border border-slate-200 rounded-full pl-2 pr-1.5 py-1">
                <div className="size-7 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {studentName.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight max-w-[140px] truncate capitalize">
                    {studentName}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold leading-none">
                    Estudiante Activo
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="size-7 p-0 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  title="Cerrar sesión del portal"
                >
                  <LogOut className="size-3.5" />
                  <span className="sr-only">Cerrar sesión</span>
                </Button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                search={{ portal: "estudiante", redirect: "/portal-estudiantil" }}
              >
                <Button
                  size="sm"
                  className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-4 text-xs font-semibold shadow-xs"
                >
                  <User className="size-3.5 mr-1.5" />
                  <span>Ingresar a mi Expediente</span>
                </Button>
              </Link>
            )}

            {/* Botón menú móvil */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menú de navegación estudiantil"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            <a
              href="#expediente"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-brand-green"
            >
              <GraduationCap className="size-4 text-brand-green" />
              <span>Mi Expediente & Calificaciones</span>
            </a>
            <a
              href="#plataformas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-brand-green"
            >
              <Laptop className="size-4 text-brand-green" />
              <span>Aulas y Campus Virtual</span>
            </a>
            <a
              href="#tramites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-brand-green"
            >
              <FileText className="size-4 text-brand-green" />
              <span>Radicación de Trámites & Certificados</span>
            </a>
            <a
              href="#calendario"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-brand-green"
            >
              <Calendar className="size-4 text-brand-green" />
              <span>Calendario Académico</span>
            </a>
            <div className="pt-2 border-t border-slate-100">
              <a
                href={mainSiteUrl}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <span>Volver al Sitio Institucional FUNASF</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. Contenido principal del portal */}
      <main id="contenido-estudiantil" className="flex-1">
        {children}
      </main>

      {/* 4. Pie de página del portal estudiantil */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EduFUNASF &bull; División de Registro y Control Académico.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:admisiones@edufunasf.org" className="hover:text-slate-800">
              admisiones@edufunasf.org
            </a>
            <span>&bull;</span>
            <a href={`https://wa.me/${contacto.whatsappLlamadas || "573232946184"}`} target="_blank" rel="noreferrer" className="hover:text-slate-800">
              Mesa de Ayuda WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
