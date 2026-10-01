import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface AdminHeaderProps {
  onOpenMobile: () => void;
  title?: string | undefined;
  subtitle?: string | undefined;
}

export function AdminHeader({ onOpenMobile, title, subtitle }: AdminHeaderProps) {
  const { profile, role, isConfigured } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenMobile}
          className="md:hidden size-9"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="size-5" />
        </Button>

        <div>
          {title ? (
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>
              )}
            </div>
          ) : (
            <span className="font-semibold text-foreground">Panel Administrativo</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span
            className={`size-2 rounded-full ${isConfigured ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span className="text-muted-foreground hidden sm:inline">
            {isConfigured ? "Cloud conectado" : "Modo local"}
          </span>
          <span className="font-semibold text-foreground capitalize">{role ?? "usuario"}</span>
        </div>
      </div>
    </header>
  );
}
