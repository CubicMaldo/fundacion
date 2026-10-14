import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  GraduationCap,
  LifeBuoy,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { createSeoMeta } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/site/Logo";
import { whatsappLink } from "@/data/funasf";

export interface AdminLoginSearch {
  portal?: string;
  redirect?: string;
  reason?: string;
}

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): AdminLoginSearch => {
    const res: AdminLoginSearch = {};
    if (typeof search["portal"] === "string") res.portal = search["portal"];
    if (typeof search["redirect"] === "string") res.redirect = search["redirect"];
    if (typeof search["reason"] === "string") res.reason = search["reason"];
    return res;
  },
  head: () =>
    createSeoMeta({
      title: "Acceso al Sistema y Portales Académicos | FUNASF",
      noindex: true,
      canonicalPath: "/admin/login",
    }),
  component: AdminLogin,
});

function AdminLogin() {
  const search = Route.useSearch();
  const initialPortal =
    search.portal === "docente" || search.redirect?.startsWith("/docente")
      ? "docente"
      : search.portal === "estudiante" || search.redirect === "/portal-estudiantil"
        ? "estudiante"
        : "admin";

  const [activeTab, setActiveTab] = useState<"estudiante" | "docente" | "admin">(initialPortal);
  const { user, role, signIn, signOut, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirección inteligente según el rol autenticado
  useEffect(() => {
    if (!isLoading && user && role) {
      if (search.redirect && search.redirect !== "/admin/login") {
        navigate({ to: search.redirect as any });
        return;
      }

      if (role === "docente") {
        navigate({ to: "/docente" });
      } else if (role === "estudiante") {
        navigate({ to: "/portal-estudiantil" });
      } else if (role === "admin" || role === "editor") {
        navigate({ to: "/admin" });
      }
    }
  }, [user, role, isLoading, navigate, search.redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signIn(identifier, password, activeTab);
      if (result.error) {
        setErrorMessage(result.error);
      }
      // La redirección ocurrirá reactivamente en el useEffect una vez cargado el perfil
    } catch (err) {
      setErrorMessage((err as Error).message || "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100/60 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Enlace para volver */}
        <div className="mb-5 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="size-3.5" />
            Volver al portal principal
          </Link>
          <span className="text-slate-400">Campus FUNASF</span>
        </div>

        {/* Tarjeta de Login */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl">
          {/* Encabezado contextual */}
          <div className="border-b border-emerald-950/20 bg-linear-to-br from-emerald-900 via-emerald-850 to-emerald-950 p-6 sm:p-7 text-center text-white">
            <Logo variant="vertical" invert size="md" showSubtitle className="mx-auto" />
            <p className="mt-2 text-xs text-emerald-200/90 font-medium">
              Intranet & Servicios Académicos Oficiales
            </p>
          </div>

          {/* Selector de Pestaña de Acceso (Estudiante / Docente / Admin) */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("estudiante");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold transition-all ${
                activeTab === "estudiante"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="size-3.5 text-emerald-600" />
              <span>Estudiantes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("docente");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold transition-all ${
                activeTab === "docente"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="size-3.5 text-emerald-600" />
              <span>Docentes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold transition-all ${
                activeTab === "admin"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="size-3.5 text-emerald-600" />
              <span>Administrativo</span>
            </button>
          </div>

          {/* Formulario */}
          <div className="p-6 sm:p-8">
            {/* Aviso Contextual por Tipo de Portal */}
            {activeTab === "estudiante" && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 leading-relaxed">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-emerald-600" />
                  Portal Estudiantil
                </p>
                <p className="mt-1 text-emerald-850">
                  Ingresa con tu <strong>usuario</strong> o <strong>correo registrado</strong>. Tu contraseña inicial corresponde a tu documento de identidad (o la asignada por coordinación).
                </p>
              </div>
            )}

            {activeTab === "docente" && (
              <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-950 leading-relaxed">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-blue-600" />
                  Módulo Docente
                </p>
                <p className="mt-1 text-blue-850">
                  Acceso exclusivo para docentes FUNASF: gestiona mallas de evaluación, asienta notas parciales y emite actas de cierre.
                </p>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950 leading-relaxed">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Shield className="size-3.5 text-amber-600" />
                  Panel Administrativo y CMS
                </p>
                <p className="mt-1 text-amber-850">
                  Gestión integral de admisiones, matrículas, usuarios, cursos, artículos de blog y parámetros institucionales.
                </p>
              </div>
            )}

            {/* Sesión ya activa con rol cruzado */}
            {user && (
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Sesión activa ({user.email})</p>
                    <p className="text-[11px] text-slate-500">Rol: <span className="capitalize font-bold text-emerald-700">{role || "Usuario"}</span></p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await signOut();
                    }}
                    className="h-7 text-xs font-semibold"
                  >
                    Cambiar Cuenta
                  </Button>
                </div>
              </div>
            )}

            {errorMessage && (
              <Alert variant="destructive" className="mb-5 rounded-xl">
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-xs font-semibold text-slate-800">
                  {activeTab === "estudiante"
                    ? "Usuario o Correo de Estudiante"
                    : activeTab === "docente"
                      ? "Usuario o Correo Docente"
                      : "Correo o Usuario Administrador"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={
                      activeTab === "estudiante"
                        ? "estudiante.camila o correo@..."
                        : activeTab === "docente"
                          ? "docente.carlos o correo@..."
                          : "admin@edufunasf.org"
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="pl-9 h-11 text-xs"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-800">
                    Contraseña
                  </Label>
                  {activeTab === "estudiante" && (
                    <span className="text-[10px] text-slate-500">
                      (N° Documento por defecto)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 h-11 text-xs"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-brand-green hover:bg-brand-green-deep text-white font-semibold text-xs mt-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Validando credenciales...
                  </>
                ) : activeTab === "estudiante" ? (
                  "Ingresar a mi Expediente Estudiantil"
                ) : activeTab === "docente" ? (
                  "Ingresar al Portal Docente"
                ) : (
                  "Ingresar al Panel Administrativo"
                )}
              </Button>
            </form>

            {/* Ayuda y Soporte */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                ¿Problemas para acceder a tu cuenta o aula virtual?
              </p>
              <a
                href={`${whatsappLink}&text=Hola%20Mesa%20de%20Ayuda%20FUNASF,%20necesito%20soporte%20para%20ingresar%20a%20mi%20cuenta%20de%20${activeTab}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-deep hover:underline"
              >
                <LifeBuoy className="size-3.5" />
                <span>Contactar a Mesa de Ayuda por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pie */}
        <p className="mt-6 text-center text-[11px] text-slate-500">
          Fundación Internacional Amigos Sin Fronteras &copy; {new Date().getFullYear()} · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
