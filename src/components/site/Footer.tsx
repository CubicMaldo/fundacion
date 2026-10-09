import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, Lock } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-context";
import { Logo } from "@/components/site/Logo";

const columnas = [
  {
    titulo: "FUNASF",
    enlaces: [
      { label: "Quiénes somos", to: "/quienes-somos", hash: undefined },
      { label: "Misión", to: "/quienes-somos", hash: "mision" },
      { label: "Visión", to: "/quienes-somos", hash: "vision" },
      { label: "Historia", to: "/quienes-somos", hash: "resena-historica" },
    ],
  },
  {
    titulo: "Estudia",
    enlaces: [
      { label: "Catálogo de programas", to: "/programas", hash: undefined },
      { label: "Formulario de inscripción", to: "/inscripcion", hash: undefined },
      { label: "Áreas académicas", to: "/estudia", hash: "programas" },
      { label: "Becas de hasta 90 %", to: "/estudia", hash: "becas" },
      { label: "Requisitos y matrícula", to: "/estudia", hash: "matriculas" },
      { label: "Portal estudiantil", to: "/portal-estudiantil", hash: undefined },
    ],
  },
  {
    titulo: "Comunidad",
    enlaces: [
      { label: "Blog", to: "/blog", hash: undefined },
      { label: "Galería", to: "/galeria", hash: undefined },
      { label: "Voluntariado", to: "/portal-informativo", hash: "voluntariado" },
      { label: "Trabaja con nosotros", to: "/trabaja-con-nosotros", hash: undefined },
      { label: "Alianzas", to: "/portal-informativo", hash: "alianzas" },
    ],
  },
  {
    titulo: "Legal",
    enlaces: [
      { label: "Política de privacidad", to: "/politica-privacidad", hash: undefined },
      { label: "Tratamiento de datos", to: "/tratamiento-datos", hash: undefined },
      { label: "Términos y condiciones", to: "/terminos-condiciones", hash: undefined },
      { label: "Información institucional", to: "/", hash: undefined },
      { label: "Acceso administrativo", to: "/admin/login", hash: undefined },
    ],
  },
] as const;

export function Footer() {
  const { settings } = useSiteSettings();
  const org = settings.org;
  const telefonoPrincipal = settings.contacto.telefonoPrincipal;
  const phoneDigits = (telefonoPrincipal || "").replace(/\D/g, "");
  const phoneHref = `tel:+${phoneDigits.startsWith("57") ? phoneDigits : `57${phoneDigits}`}`;

  return (
    <footer className="bg-brand-green-deep text-primary-foreground">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo
              variant="vertical"
              invert
              size="lg"
              showSubtitle
              className="items-start text-left mb-4"
            />
            <p className="text-brand-gold mt-1 text-sm font-semibold tracking-wide">
              {org.eslogan}
            </p>
            <p className="text-primary-foreground/75 mt-5 max-w-sm text-sm leading-relaxed italic">
              {org.frases[0]}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="border-primary-foreground/25 hover:bg-primary-foreground/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
              >
                <Phone aria-hidden className="size-4" /> Llamar
              </a>
              <a
                href={`mailto:${org.correo}`}
                className="border-primary-foreground/25 hover:bg-primary-foreground/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
              >
                <Mail aria-hidden className="size-4" /> Correo
              </a>
              <a
                href={org.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="border-primary-foreground/25 hover:bg-primary-foreground/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
              >
                <Instagram aria-hidden className="size-4" /> Instagram
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columnas.map((col) => (
              <nav key={col.titulo} aria-label={col.titulo}>
                <h2 className="text-brand-gold text-xs font-bold tracking-[0.14em] uppercase">
                  {col.titulo}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.enlaces.map((e) => (
                    <li key={e.label}>
                      <Link
                        to={e.to}
                        {...(e.hash ? { hash: e.hash } : {})}
                        className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                      >
                        {e.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="sm:col-span-2 lg:col-span-4">
              <h2 className="text-brand-gold text-xs font-bold tracking-[0.14em] uppercase">
                Contacto
              </h2>
              <div className="text-primary-foreground/80 mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {org.telefonos.map((t) => {
                  const digits = t.replace(/\D/g, "");
                  const href = `tel:+${digits.startsWith("57") ? digits : `57${digits}`}`;
                  const formattedText = t.startsWith("+57") ? t : `+57 ${t}`;
                  return (
                    <a
                      key={t}
                      href={href}
                      className="hover:text-primary-foreground transition-colors tabular-nums"
                    >
                      {formattedText}
                    </a>
                  );
                })}
                <a href={`mailto:${org.correo}`} className="hover:text-primary-foreground">
                  {org.correo}
                </a>
                <a
                  href={org.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-foreground"
                >
                  {org.instagram}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-primary-foreground/15 mt-12 border-t pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-primary-foreground/70 text-xs font-bold tracking-[0.14em] uppercase">
                Información institucional
              </h2>
              <p className="text-primary-foreground/65 max-w-3xl text-xs leading-relaxed">
                Razón social: {org.razonSocial} · Sigla: {org.sigla} · Tipo: {org.tipoContribuyente} ·
                NIT: {org.nit} · Domicilio principal: {org.ciudadPrincipal}.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 px-3.5 py-2 text-xs font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/15 hover:text-white hover:border-brand-gold/40 shadow-2xs"
              >
                <Lock className="size-3.5 text-brand-gold" />
                <span>Panel Administrativo</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-primary-foreground/55">
            <p>
              © {new Date().getFullYear()} Fundación Internacional Amigos Sin Fronteras – FUNASF.
              Todos los derechos reservados.
            </p>
            <p className="text-[11px] text-primary-foreground/45">
              EduFUNASF · Gestión Institucional & Académica
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
