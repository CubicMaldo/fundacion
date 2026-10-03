import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
  tone?: "default" | "soft" | "surface" | "deep";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 section-spacing",
        tone === "soft" && "surface-soft",
        tone === "surface" && "bg-surface",
        tone === "deep" && "surface-hero text-primary-foreground",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  invert = false,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  invert?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span className={cn("eyebrow", invert && "text-brand-gold")}>{eyebrow}</span>
      ) : null}
      <Tag
        className={cn(
          "mt-3 text-3xl md:text-4xl",
          invert ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "text-balance-pretty mt-4 text-base leading-relaxed md:text-lg",
            invert ? "text-primary-foreground/85" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
