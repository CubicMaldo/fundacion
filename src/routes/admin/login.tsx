import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Loader2, Lock, Mail, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/site/Logo";

export interface AdminLoginSearch {
  portal?: string;
  redirect?: string;
}

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): AdminLoginSearch => {
    const res: AdminLoginSearch = {};
    if (typeof search["portal"] === "string") res.portal = search["portal"];
    if (typeof search["redirect"] === "string") res.redirect = search["redirect"];
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

  const { user, role, signIn, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      if (role === "estudiante" || isEstudianteLogin) {
        navigate({ to: "/portal-estudiantil" });
      } else {
        navigate({ to: "/admin" });
      }
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
        isEstudianteLogin ? "estudiante" : undefined,
      );
      if (result.error) {
        setErrorMessage(result.error);
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
          <div className="border-b border-border bg-brand-green p-8 text-center text-primary-foreground">
            <Logo variant="vertical" invert size="lg" showSubtitle className="mx-auto" />
            <div className="mt-3 flex items-center justify-center gap-2">
              {isEstudianteLogin ? (
                <>
                  <GraduationCap className="size-4 text-brand-gold" />
                  <p className="text-xs text-primary-foreground font-semibold tracking-wide uppercase">
                    Portal Académico Estudiantil
                  </p>
                </>
              ) : (
                <>
                  <Shield className="size-4 text-brand-gold" />
                  <p className="text-xs text-primary-foreground/85 font-medium tracking-wide uppercase">
                    Panel Administrativo Central
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8">
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
                  {isEstudianteLogin ? "Correo institucional o personal" : "Correo electrónico"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      isEstudianteLogin ? "estudiante@edufunasf.org" : "admin@edufunasf.org"
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
                <Label htmlFor="password">Contraseña</Label>
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
                className="w-full h-11 bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold mt-2"
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
