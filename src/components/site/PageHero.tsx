import type { ReactNode } from "react";

export interface PageHeroProps {
  eyebrow?: string | undefined;
  badge?: string | undefined;
  badgeIcon?: ReactNode | undefined;
  title: string;
  description?: string | undefined;
  lead?: string | undefined;
  children?: ReactNode | undefined;
}

export function PageHero({
  eyebrow,
  badge,
  badgeIcon,
  title,
  description,
  lead,
  children,
}: PageHeroProps) {
  const displayEyebrow = badge || eyebrow;
  const displayDescription = lead || description;

  return (
    <header className="surface-hero relative overflow-hidden">
      <div className="container-page relative py-14 md:py-20">
        <div className="fade-up max-w-3xl">
          {displayEyebrow ? (
            <div className="inline-flex items-center gap-2">
              {badgeIcon ? <span className="text-brand-gold">{badgeIcon}</span> : null}
              <span className="text-brand-gold text-xs font-bold tracking-[0.16em] uppercase">
                {displayEyebrow}
              </span>
            </div>
          ) : null}
          <h1 className="text-primary-foreground mt-4 text-4xl leading-tight md:text-5xl">
            {title}
          </h1>
          {displayDescription ? (
            <p className="text-primary-foreground/85 text-balance-pretty mt-5 text-lg leading-relaxed">
              {displayDescription}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
