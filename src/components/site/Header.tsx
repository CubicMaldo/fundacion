import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Mail, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navegacion } from "./nav";
import { org, telefonoPrincipal } from "@/data/funasf";
import { cn } from "@/lib/utils";

function Wordmark({ invert = false }: { invert?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl font-display text-sm font-bold tracking-tight shadow-xs transition-all",
          invert
            ? "border border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground"
            : "border border-brand-green/20 bg-brand-green/10 text-brand-green shadow-inner",
        )}
      >
        <svg
          className="size-5 sm:size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="m14 14 2 2 4-4" />
        </svg>
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            "font-display text-lg sm:text-xl font-bold tracking-tight",
            invert ? "text-primary-foreground" : "text-primary",
          )}
        >
          FUNASF
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-semibold tracking-[0.14em] uppercase",
            invert ? "text-primary-foreground/80" : "text-brand-brown",
          )}
        >
          Amigos Sin Fronteras
        </span>
      </span>
    </span>
  );
}

function isRouteActive(
  itemTo: string,
  children?: { to: string }[],
  currentPath: string = "",
): boolean {
  if (currentPath === itemTo) return true;
  if (itemTo !== "/" && currentPath.startsWith(itemTo)) return true;
  if (
    children?.some(
      (child) => child.to === currentPath || (child.to !== "/" && currentPath.startsWith(child.to)),
    )
  ) {
    return true;
  }
  return false;
}

export function Header() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/95 shadow-[0_1px_0_0_var(--color-border)] backdrop-blur"
          : "border-transparent bg-background",
      )}
    >
      {/* Barra superior institucional informativa */}
      <div className="bg-brand-green-deep text-primary-foreground/90 hidden border-b border-white/10 py-1.5 text-xs lg:block">
        <div className="container-page flex h-6 items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-brand-gold inline-block size-1.5 rounded-full" />
            <p className="text-primary-foreground/95 text-[11px] font-medium tracking-wide">
              {org.eslogan}
            </p>
          </div>
          <div className="text-primary-foreground/80 flex items-center gap-4 text-[11px]">
            <a
              className="hover:text-brand-gold inline-flex items-center gap-1.5 transition-colors"
              href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}
            >
              <Phone aria-hidden className="text-brand-gold/90 size-3" />
              <span className="tabular-nums font-medium">{org.telefonos[0]}</span>
            </a>
            <span className="text-primary-foreground/30" aria-hidden="true">
              ·
            </span>
            <a
              className="hover:text-brand-gold inline-flex items-center gap-1.5 transition-colors"
              href={`mailto:${org.correo}`}
            >
              <Mail aria-hidden className="text-brand-gold/90 size-3" />
              <span>{org.correo}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Barra de navegación principal */}
      <div className="container-page flex h-20 items-center justify-between gap-6">
        {/* Zona 1: Identidad de Marca */}
        <Link to="/" aria-label="FUNASF — Inicio" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Zona 2: Enlaces de navegación con espaciado consistente y tipografía uniforme */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-1.5"
        >
          {navegacion.map((item) => {
            const active = isRouteActive(item.to, item.children, pathname);

            return item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={cn(
                    "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none",
                    active
                      ? "bg-brand-green-soft text-brand-green-deep font-semibold shadow-xs"
                      : "text-foreground/75 hover:bg-brand-green-soft/50 hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180",
                      active
                        ? "text-brand-green-deep opacity-90"
                        : "text-muted-foreground opacity-60",
                    )}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={8}
                  className="border-border/80 bg-popover/95 w-72 rounded-xl border p-1.5 shadow-xl backdrop-blur-md"
                >
                  <div className="border-border/60 mb-1 border-b px-2.5 py-1.5">
                    <Link
                      to={item.to}
                      className="text-primary hover:text-brand-green-deep group flex items-center justify-between text-xs font-semibold transition-colors"
                    >
                      <span>Explorar todo en {item.label}</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        key={child.label}
                        asChild
                        className="focus:bg-brand-green-soft/70 cursor-pointer rounded-lg"
                      >
                        <Link
                          to={child.to}
                          {...(child.hash ? { hash: child.hash } : {})}
                          className="flex flex-col items-start px-2.5 py-2"
                        >
                          <span className="text-foreground text-sm font-medium">{child.label}</span>
                          {child.description && (
                            <span className="text-muted-foreground mt-0.5 text-[11px] leading-snug">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none",
                  active
                    ? "bg-brand-green-soft text-brand-green-deep font-semibold shadow-xs"
                    : "text-foreground/75 hover:bg-brand-green-soft/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zona 3: Acción destacada y menú móvil */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground hidden h-9 rounded-full px-5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase shadow-xs transition-all hover:shadow sm:inline-flex"
          >
            <Link to="/estudia" hash="becas">
              Conoce las becas
            </Link>
          </Button>

          <Sheet open={abierto} onOpenChange={setAbierto}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary size-9 rounded-lg lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(22rem,90vw)] flex-col overflow-y-auto p-0"
            >
              <div className="border-b px-5 py-4">
                <Wordmark />
              </div>
              <div className="bg-brand-green-deep text-primary-foreground/90 px-5 py-3 text-xs">
                <p className="font-medium">{org.eslogan}</p>
                <div className="text-primary-foreground/80 mt-2 flex flex-col gap-1.5 text-[11px]">
                  <a
                    href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}
                    className="hover:text-brand-gold flex items-center gap-1.5"
                  >
                    <Phone className="text-brand-gold size-3" /> {org.telefonos[0]}
                  </a>
                  <a
                    href={`mailto:${org.correo}`}
                    className="hover:text-brand-gold flex items-center gap-1.5"
                  >
                    <Mail className="text-brand-gold size-3" /> {org.correo}
                  </a>
                </div>
              </div>
              <nav aria-label="Navegación móvil" className="flex-1 space-y-1 px-4 py-4">
                <Accordion type="multiple" className="w-full">
                  {navegacion.map((item) =>
                    item.children ? (
                      <AccordionItem
                        key={item.label}
                        value={item.label}
                        className="border-border/50 border-b"
                      >
                        <AccordionTrigger className="text-foreground px-2 py-3 text-sm font-semibold hover:no-underline">
                          <span>{item.label}</span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1 pt-1 pb-3">
                          <Link
                            to={item.to}
                            onClick={() => setAbierto(false)}
                            className="text-primary bg-primary/5 hover:bg-primary/10 block rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                          >
                            Ver todo en {item.label} →
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.to}
                              {...(child.hash ? { hash: child.hash } : {})}
                              onClick={() => setAbierto(false)}
                              className="text-muted-foreground hover:text-foreground hover:bg-secondary/70 block rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setAbierto(false)}
                        className="text-foreground hover:bg-secondary/70 border-border/50 flex items-center border-b px-2 py-3 text-sm font-semibold transition-colors"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </Accordion>
                <div className="grid gap-2.5 pt-6">
                  <Button asChild onClick={() => setAbierto(false)} className="w-full rounded-full">
                    <Link to="/estudia" hash="becas">
                      Conoce las becas
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    onClick={() => setAbierto(false)}
                    className="w-full rounded-full"
                  >
                    <Link to="/contacto">Contáctanos</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
