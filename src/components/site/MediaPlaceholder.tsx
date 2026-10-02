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
        "relative flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed p-6 text-center",
        tone === "light"
          ? "border-brand-brown/35 bg-brand-sand text-brand-brown"
          : "border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground/80",
        className,
      )}
    >
      <span aria-hidden className="bg-brand-brown/10 absolute inset-x-0 top-0 h-1" />
      <ImageIcon aria-hidden className="size-7 opacity-60 shrink-0" />
      <span className="max-w-72 text-xs font-semibold tracking-[0.12em] uppercase line-clamp-2">
        {label}
      </span>
    </div>
  );
}
