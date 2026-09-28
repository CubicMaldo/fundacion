import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Placeholder visual para imágenes institucionales aún no suministradas.
 * Mantiene las proporciones definitivas: al recibir la fotografía real basta
 * con reemplazar este componente por <img> con las mismas clases de contenedor.
 */
export function MediaPlaceholder({
  label,
  className,
  tone = "light",
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      role="img"
      aria-label={`Imagen institucional pendiente: ${label}`}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center",
        tone === "light"
          ? "border-border bg-surface text-muted-foreground"
          : "border-primary-foreground/25 bg-primary-foreground/5 text-primary-foreground/80",
        className,
      )}
    >
      <ImageIcon aria-hidden className="size-7 opacity-60" />
      <span className="text-xs font-semibold tracking-[0.12em] uppercase">{label}</span>
    </div>
  );
}
