import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, GraduationCap, Mail, Menu, Phone } from "lucide-react";
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
import { useSiteSettings } from "@/lib/site-settings-context";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

function Wordmark({ invert = false }: { invert?: boolean }) {
  return <Logo variant="horizontal" size="md" invert={invert} showSubtitle={true} />;
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
  const { settings } = useSiteSettings();
  const org = settings.org;
  const telefonoPrincipal = settings.contacto.telefonoPrincipal;
  const phoneDigits = (telefonoPrincipal || "").replace(/\D/g, "");
  const phoneHref = `tel:+${phoneDigits.startsWith("57") ? phoneDigits : `57${phoneDigits}`}`;

  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [activeHash, setActiveHash] = useState(hash);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (hash) setActiveHash(hash);
  }, [hash]);

  // Observer para actualizar el activeHash según el scroll (ScrollSpy)
  useEffect(() => {
    const hashesToObserve = navegacion
      .flatMap((item) => item.children || [])
      .filter((child) => child.to === pathname && child.hash)
      .map((child) => child.hash!);

    if (hashesToObserve.length === 0) {
      setActiveHash(hash);
      return;
    }

    let observer: IntersectionObserver;
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          let visibleId = "";
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleId = entry.target.id;
            }
          });
          if (visibleId) setActiveHash(visibleId);
        },
        { rootMargin: "-80px 0px -60% 0px" },
      );

      hashesToObserve.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [pathname, hash]);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background transition-shadow duration-200",
        scrolled ? "border-border shadow-xs" : "border-border/60",
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
          <div className="text-primary-foreground/80 flex items-center gap-3.5 text-[11px]">
            <a
              className="hover:text-brand-gold inline-flex items-center gap-1.5 transition-colors"
              href={phoneHref}
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
            <span className="text-primary-foreground/30" aria-hidden="true">
              |
            </span>
            <Link
              to="/portal-estudiantil"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-semibold transition-all",
                pathname === "/portal-estudiantil"
                  ? "bg-brand-gold text-brand-green-deep font-bold shadow-xs"
                  : "text-brand-gold hover:bg-white/10 hover:text-white",
              )}
            >
              <GraduationCap aria-hidden className="size-3.5" />
              <span>Portal Estudiantil</span>
            </Link>
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
              <div key={item.label} className="relative group inline-block">
                <Link
                  to={item.to}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none",
                    active
                      ? "bg-brand-green/10 text-brand-green-deep font-bold ring-1 ring-brand-green/20 shadow-xs"
                      : "text-foreground/75 group-hover:bg-brand-green-soft/50 group-hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform duration-200 group-hover:rotate-180",
                      active
                        ? "text-brand-green-deep opacity-90"
                        : "text-muted-foreground opacity-60",
                    )}
                  />
                </Link>
                <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="border-border bg-popover w-72 rounded-xl border p-1.5 shadow-lg">
                    <div className="border-border/60 mb-1 border-b px-2.5 py-1.5">
                      <Link
                        to={item.to}
                        className="text-primary hover:text-brand-green-deep group/link flex items-center justify-between text-xs font-semibold transition-colors"
                      >
                        <span>Explorar todo en {item.label}</span>
                        <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                    <div className="space-y-0.5">
                      {item.children.map((child) => {
                        const currentHash = activeHash || "";
                        const targetHash = child.hash || "";
                        const isChildActive =
                          mounted &&
                          child.to === pathname &&
                          (child.hash ? currentHash === targetHash : !currentHash);

                        return (
                          <Link
                            key={child.label}
                            to={child.to}
                            activeOptions={{ exact: true, includeHash: false }}
                            {...(child.hash ? { hash: child.hash } : {})}
                            className={cn(
                              "flex flex-col items-start px-2.5 py-2 cursor-pointer rounded-lg transition-colors",
                              isChildActive
                                ? "bg-brand-green-soft/80 text-brand-green-deep ring-1 ring-brand-green/20 shadow-xs"
                                : "hover:bg-brand-green-soft/50",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm",
                                isChildActive ? "font-bold" : "font-medium text-foreground",
                              )}
                            >
                              {child.label}
                            </span>
                            {child.description && (
                              <span
                                className={cn(
                                  "mt-0.5 text-[11px] leading-snug",
                                  isChildActive
                                    ? "text-brand-green-deep/80"
                                    : "text-muted-foreground",
                                )}
                              >
                                {child.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none",
                  active
                    ? "bg-brand-green/10 text-brand-green-deep font-bold ring-1 ring-brand-green/20 shadow-xs"
                    : "text-foreground/75 hover:bg-brand-green-soft/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zona 3: Acción destacada y menú móvil */}
        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              "hidden sm:inline-flex h-9 rounded-full px-3.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border",
              pathname === "/portal-estudiantil"
                ? "border-brand-green bg-brand-green/10 text-brand-green-deep font-bold ring-2 ring-brand-green/20 shadow-xs"
                : "border-border/90 bg-background text-foreground/85 hover:border-brand-green/50 hover:bg-brand-green-soft/40 hover:text-brand-green-deep",
            )}
          >
            <Link to="/portal-estudiantil">
              <GraduationCap className="size-4 text-brand-green" />
              <span>Portal Estudiantil</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground hidden md:inline-flex h-9 rounded-full px-5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase shadow-xs transition-all hover:shadow"
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
                  <a href={phoneHref} className="hover:text-brand-gold flex items-center gap-1.5">
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

              {/* Acceso destacado al Portal Estudiantil en móvil */}
              <div className="p-3.5 border-b border-border/70 bg-brand-green-soft/20">
                <Link
                  to="/portal-estudiantil"
                  onClick={() => setAbierto(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 transition-all shadow-2xs",
                    pathname === "/portal-estudiantil"
                      ? "border-brand-green bg-brand-green/10 text-brand-green-deep font-bold ring-1 ring-brand-green/30"
                      : "border-border bg-card text-foreground hover:border-brand-green/40 hover:bg-brand-green-soft/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand-green text-primary-foreground shadow-xs">
                      <GraduationCap className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-tight">Portal Estudiantil</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Campus virtual, notas y certificados
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-brand-green shrink-0" />
                </Link>
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
                        <AccordionTrigger className="text-foreground px-2 py-4 text-base font-semibold hover:no-underline">
                          <span>{item.label}</span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1 pt-1 pb-4">
                          <Link
                            to={item.to}
                            onClick={() => setAbierto(false)}
                            className="text-primary bg-primary/5 hover:bg-primary/10 block rounded-lg px-4 py-3 text-sm font-semibold transition-colors"
                          >
                            Ver todo en {item.label} →
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.to}
                              {...(child.hash ? { hash: child.hash } : {})}
                              onClick={() => setAbierto(false)}
                              className="text-muted-foreground hover:text-foreground hover:bg-secondary/70 block rounded-lg px-4 py-3 text-sm font-medium transition-colors"
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
                        className="text-foreground hover:bg-secondary/70 border-border/50 flex items-center border-b px-2 py-4 text-base font-semibold transition-colors"
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
