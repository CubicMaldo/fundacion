import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, GraduationCap, Mail, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { whatsappLink } from "@/data/funasf";
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
      {/* 1. Barra superior institucional limpia (contacto + acceso estudiantes) */}
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
            {/* Acceso discreto para estudiantes activos (no satura al visitante nuevo) */}
            <Link
              to="/portal-estudiantil"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium transition-colors",
                pathname === "/portal-estudiantil"
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <GraduationCap aria-hidden className="size-3 text-brand-gold" />
              <span>Soy estudiante activo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Barra de navegación principal */}
      <div className="container-page flex h-20 items-center justify-between gap-6">
        {/* Marca oficial */}
        <Link to="/" aria-label="FUNASF — Inicio" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Enlaces de navegación con hover cards refinados */}
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

        {/* 3. Acción comercial primaria única */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-brand-green hover:bg-brand-green-deep text-white hidden sm:inline-flex h-10 rounded-full px-5 text-xs font-bold tracking-wide uppercase shadow-sm transition-all hover:shadow-md"
          >
            <Link to="/inscripcion">
              Postularme a Beca
            </Link>
          </Button>

          {/* Botón Hamburguesa para Móvil */}
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
              className="flex w-[min(22rem,88vw)] flex-col justify-between overflow-y-auto p-0"
            >
              <div>
                {/* Cabecera compacta móvil */}
                <div className="border-b px-5 py-4 flex items-center justify-between">
                  <Wordmark />
                </div>

                {/* Llamado a la acción destacado para aspirantes en móvil */}
                <div className="p-4 border-b border-border/70 bg-emerald-50/60">
                  <Link
                    to="/inscripcion"
                    onClick={() => setAbierto(false)}
                    className="flex items-center justify-between rounded-xl bg-brand-green p-3 text-white shadow-xs hover:bg-brand-green-deep transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="size-4 text-brand-gold shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight uppercase tracking-wider">
                          Postulación a Becas 90 %
                        </p>
                        <p className="text-[11px] text-white/80 mt-0.5">
                          Diligencia tu cupo en línea
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                </div>

                {/* Navegación móvil estructurada y clara */}
                <nav aria-label="Navegación móvil" className="px-4 py-2">
                  <Accordion type="multiple" className="w-full">
                    {navegacion.map((item) =>
                      item.children ? (
                        <AccordionItem
                          key={item.label}
                          value={item.label}
                          className="border-border/50 border-b"
                        >
                          <AccordionTrigger className="text-foreground px-2 py-3.5 text-sm font-semibold hover:no-underline">
                            <span>{item.label}</span>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-1 pt-1 pb-3 pl-2">
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
                                className="block rounded-lg px-3 py-2 text-xs text-foreground/80 hover:bg-brand-green-soft/40 hover:text-foreground"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <div key={item.label} className="border-border/50 border-b">
                          <Link
                            to={item.to}
                            onClick={() => setAbierto(false)}
                            className="block px-2 py-3.5 text-sm font-semibold text-foreground hover:text-brand-green transition-colors"
                          >
                            {item.label}
                          </Link>
                        </div>
                      ),
                    )}
                  </Accordion>
                </nav>
              </div>

              {/* Pie del menú móvil con soporte y enlace a portal */}
              <div className="border-t border-border/80 bg-muted/30 p-4 space-y-3">
                <Link
                  to="/portal-estudiantil"
                  onClick={() => setAbierto(false)}
                  className="flex items-center justify-between rounded-lg border border-border/80 bg-card px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-brand-green" />
                    <span>Portal para Estudiantes Activos</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>

                <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <a href={phoneHref} className="hover:text-foreground flex items-center gap-1">
                    <Phone className="size-3" /> {org.telefonos[0]}
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-green font-semibold hover:underline"
                  >
                    WhatsApp Admisiones
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
