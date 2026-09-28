import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone } from "lucide-react";
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
  // [LOGO FUNASF PENDIENTE] — reemplazar este bloque por el logo oficial
  // manteniendo la altura (h-11) para no alterar el diseño del header.
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg border border-dashed text-[9px] leading-tight font-bold tracking-wider",
          invert
            ? "border-primary-foreground/40 text-primary-foreground/70"
            : "border-border text-muted-foreground",
        )}
      >
        LOGO
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            invert ? "text-primary-foreground" : "text-primary",
          )}
        >
          FUNASF
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] tracking-[0.1em] uppercase",
            invert ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Amigos Sin Fronteras
        </span>
      </span>
    </span>
  );
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
          ? "bg-background/95 border-border shadow-[0_1px_0_0_var(--color-border)] backdrop-blur"
          : "bg-background border-transparent",
      )}
    >
      <div className="bg-brand-green-deep text-primary-foreground/90 hidden py-2 text-xs lg:block">
        <div className="container-page flex items-center justify-between gap-6">
          <p className="tracking-wide">{org.eslogan}</p>
          <div className="flex items-center gap-5">
            <a className="hover:text-brand-gold inline-flex items-center gap-2 transition-colors" href={`tel:+57${telefonoPrincipal.replace(/\s/g, "")}`}>
              <Phone aria-hidden className="size-3.5" />
              {org.telefonos[0]}
            </a>
            <a className="hover:text-brand-gold transition-colors" href={`mailto:${org.correo}`}>
              {org.correo}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="FUNASF — Inicio" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Navegación principal" className="hidden xl:flex xl:items-center xl:gap-1">
          {navegacion.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={cn(
                    "hover:bg-secondary hover:text-primary inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    pathname === item.to ? "text-primary" : "text-foreground/80",
                  )}
                >
                  {item.label}
                  <ChevronDown aria-hidden className="size-3.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuItem asChild>
                    <Link to={item.to} className="font-semibold">
                      Ver todo
                    </Link>
                  </DropdownMenuItem>
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.label} asChild>
                      <Link to={child.to} {...(child.hash ? { hash: child.hash } : {})}>
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "hover:bg-secondary hover:text-primary rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  pathname === item.to ? "text-primary" : "text-foreground/80",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" className="hidden md:inline-flex">
            <Link to="/estudia" hash="becas">
              Conoce las becas
            </Link>
          </Button>

          <Sheet open={abierto} onOpenChange={setAbierto}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Abrir menú">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,90vw)] overflow-y-auto p-0">
              <div className="border-b px-5 py-5">
                <Wordmark />
              </div>
              <nav aria-label="Navegación móvil" className="px-3 py-4">
                <Accordion type="multiple" className="w-full">
                  {navegacion.map((item) =>
                    item.children ? (
                      <AccordionItem key={item.label} value={item.label} className="border-b-0">
                        <AccordionTrigger className="px-2 py-3 text-sm font-semibold hover:no-underline">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <Link
                            to={item.to}
                            className="text-primary block rounded-md px-4 py-2 text-sm font-semibold"
                          >
                            Ver todo
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.to}
                              {...(child.hash ? { hash: child.hash } : {})}
                              className="text-muted-foreground hover:text-primary block rounded-md px-4 py-2 text-sm"
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
                        className="hover:bg-secondary block rounded-md px-2 py-3 text-sm font-semibold"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </Accordion>
                <div className="mt-5 grid gap-2 px-2">
                  <Button asChild>
                    <Link to="/estudia">Estudia con FUNASF</Link>
                  </Button>
                  <Button asChild variant="outline">
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
