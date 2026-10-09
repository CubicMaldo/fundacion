import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, LifeBuoy, Loader2, Lock, Mail, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
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
  head: () => ({
    meta: [
      { title: "Acceso al Sistema | FUNASF" },
      {
        name: "description",
        content: "Portal de acceso para estudiantes y equipo administrativo de FUNASF.",
      },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const search = Route.useSearch();
  const isEstudianteLogin =
    search.portal === "estudiante" || search.redirect === "/portal-estudiantil";

  const { user, role, signIn, signOut, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      if (isEstudianteLogin) {
        navigate({ to: "/portal-estudiantil" });
      } else if (role === "admin") {
        navigate({ to: "/admin" });
      }
      // Si el rol es estudiante y la persona vino a /admin/login con la intención de acceder al panel admin,
      // no la redirigimos automáticamente a /portal-estudiantil para evitar bloquearle el acceso.
    }
  }, [user, role, isEstudianteLogin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signIn(
        email,
        password,
        isEstudianteLogin ? "estudiante" : "admin",
      );
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        if (isEstudianteLogin) {
          navigate({ to: "/portal-estudiantil" });
        } else {
          navigate({ to: "/admin" });
        }
      }
    } catch (err) {
      setErrorMessage((err as Error).message || "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Enlace para volver */}
        <div className="mb-6">
          <Link
            to={isEstudianteLogin ? "/portal-estudiantil" : "/"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            {isEstudianteLogin ? "Volver al Portal Estudiantil" : "Volver al sitio web principal"}
          </Link>
        </div>

        {/* Tarjeta de Login */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Encabezado contextual */}
          <div className="border-b border-border bg-brand-green p-7 text-center text-primary-foreground">
            <Logo variant="vertical" invert size="lg" showSubtitle className="mx-auto" />
            <div className="mt-3.5 flex items-center justify-center gap-2">
              {isEstudianteLogin ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white tracking-wide">
                  <GraduationCap className="size-4 text-brand-gold" />
                  <span>Portal Académico Estudiantil</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white tracking-wide">
                  <Shield className="size-4 text-brand-gold" />
                  <span>Panel Administrativo Central</span>
                </div>
              )}
            </div>
          </div>

          {/* Formulario */}
          <div className="p-7 sm:p-8">
            {isEstudianteLogin && (
              <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 leading-relaxed">
                <p className="font-bold text-emerald-900">¿Eres estudiante matriculado?</p>
                <p className="mt-1 text-emerald-850">
                  Ingresa con el correo electrónico registrado durante tu matrícula. Tu contraseña inicial es tu número de documento de identidad (a menos que la hayas actualizado).
                </p>
              </div>
            )}

            {user && role === "estudiante" && !isEstudianteLogin && (
              <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-50/90 p-4 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <Shield className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                      Sesión activa como Estudiante ({user.email})
                    </p>
                    <p className="leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                      Para ingresar al Panel Administrativo, debes iniciar sesión con tus credenciales de administrador o cerrar la sesión actual de estudiante.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await signOut();
                        }}
                        className="h-7 text-xs bg-white hover:bg-amber-100/50 border-amber-300 text-amber-900 font-medium"
                      >
                        Cerrar sesión de estudiante
                      </Button>
                      <Button
                        asChild
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-amber-800 hover:text-amber-950"
                      >
                        <Link to="/portal-estudiantil">Ir a Portal Estudiantil</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isConfigured && (
              <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold">Servicio de Autenticación Pendiente</p>
                <p className="mt-1">
                  Las credenciales de Supabase no están configuradas en el entorno. Para acceder, configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.
                </p>
              </div>
            )}

            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {isEstudianteLogin ? "Correo registrado" : "Correo electrónico"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      isEstudianteLogin ? "tu-correo@ejemplo.com" : "admin@edufunasf.org"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 h-11"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  {isEstudianteLogin && (
                    <span className="text-[11px] text-muted-foreground">
                      (N° de documento por defecto)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 h-11"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isConfigured}
                className="w-full h-11 bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold mt-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Iniciando sesión...
                  </>
                ) : isEstudianteLogin ? (
                  "Ingresar a mi Portal de Estudiante"
                ) : (
                  "Ingresar al panel"
                )}
              </Button>
            </form>

            {isEstudianteLogin && (
              <div className="mt-6 pt-5 border-t border-border/70 text-center">
                <p className="text-xs text-muted-foreground">
                  ¿Tienes problemas para acceder a tus notas o aula virtual?
                </p>
                <a
                  href={`${whatsappLink}&text=Hola%20Mesa%20de%20Ayuda%20FUNASF,%20necesito%20ayuda%20para%20ingresar%20a%20mi%20portal%20estudiantil`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-deep hover:underline"
                >
                  <LifeBuoy className="size-3.5" />
                  <span>Contactar a Soporte Académico vía WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Pie */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Fundación Internacional Amigos Sin Fronteras &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
