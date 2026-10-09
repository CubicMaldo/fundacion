import { useState } from "react";
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

export function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, profile, signOut } = useAuth();

  const mainSiteUrl = "/";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* 1. Header Superior Específico del Portal de Estudiantes */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
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
                  <span className="font-display font-bold text-sm text-slate-900 tracking-tight">
                    EduFUNASF
                  </span>
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-green ring-1 ring-emerald-500/20">
                    Estudiantes
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 -mt-0.5">
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
              className="hidden lg:inline-flex text-xs text-slate-600 hover:text-brand-green"
            >
              <a href={mainSiteUrl}>← Volver a FUNASF</a>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {profile?.nombre_completo || "Estudiante"}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs text-slate-600 hover:text-red-600 hover:border-red-200 h-8 px-2.5"
                >
                  <LogOut className="size-3.5 sm:mr-1.5" />
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

      {/* 2. Barra de Navegación de Pestañas del Portal (Optimizada para Móvil y Desktop) */}
      <nav
        aria-label="Navegación del portal de estudiantes"
        className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs"
      >
        <div className="container-page flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <a
            href="#expediente"
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg border border-slate-200/70 transition-colors"
          >
            <GraduationCap className="size-3.5 text-brand-green" />
            <span>Registro de Notas</span>
          </a>
          <a
            href="#plataformas"
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg border border-slate-200/70 transition-colors"
          >
            <Laptop className="size-3.5 text-brand-green" />
            <span>Aulas Virtuales</span>
          </a>
          <a
            href="#tramites"
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg border border-slate-200/70 transition-colors"
          >
            <FileText className="size-3.5 text-brand-green" />
            <span>Trámites y Certificados</span>
          </a>
          <a
            href="#calendario"
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-green hover:bg-slate-50 rounded-lg border border-slate-200/70 transition-colors"
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
              <MessageCircle className="size-3" /> WhatsApp
            </a>
            <Link
              to="/admin/login"
              className="hover:text-brand-green flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
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
