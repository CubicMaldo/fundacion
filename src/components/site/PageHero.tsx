import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <header className="surface-hero relative overflow-hidden">
      <div
        aria-hidden
        className="bg-brand-gold/15 pointer-events-none absolute -top-24 -right-24 size-80 rounded-full blur-3xl"
      />
      <div className="container-page relative py-16 md:py-24">
        <div className="fade-up max-w-3xl">
          {eyebrow ? (
            <span className="text-brand-gold text-xs font-bold tracking-[0.16em] uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-primary-foreground mt-4 text-4xl leading-tight md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="text-primary-foreground/85 text-balance-pretty mt-5 text-lg leading-relaxed">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
