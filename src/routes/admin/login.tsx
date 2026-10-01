import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Acceso Administrativo | FUNASF" },
      {
        name: "description",
        content: "Portal de acceso para administradores y editores de FUNASF.",
      },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { user, signIn, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/admin" });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        navigate({ to: "/admin" });
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
        {/* Enlace para volver a la web */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver al sitio web principal
          </Link>
        </div>

        {/* Tarjeta de Login */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Encabezado */}
          <div className="border-b border-border bg-brand-green p-8 text-center text-primary-foreground">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xs shadow-inner">
              <ShieldCheck className="size-8" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">FUNASF Panel</h1>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Administración de contenidos y postulaciones
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            {!isConfigured && (
              <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold">Modo Demostración Local</p>
                <p className="mt-1">
                  Las claves de Supabase no están en .env. Puedes escribir cualquier correo y
                  contraseña para ingresar en modo demo.
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
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@funasf.org"
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
                disabled={isSubmitting}
                className="w-full h-11 bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Iniciando sesión...
                  </>
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
