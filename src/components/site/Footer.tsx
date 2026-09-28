import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import { org } from "@/data/funasf";

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
      { label: "Programas", to: "/estudia", hash: "programas" },
      { label: "Becas", to: "/estudia", hash: "becas" },
      { label: "Matrículas", to: "/estudia", hash: "matriculas" },
      { label: "Portal estudiantil", to: "/portal-estudiantil", hash: undefined },
    ],
  },
  {
    titulo: "Comunidad",
    enlaces: [
      { label: "Blog", to: "/blog", hash: undefined },
      { label: "Galería", to: "/galeria", hash: undefined },
      { label: "Voluntariado", to: "/portal-informativo", hash: "voluntariado" },
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
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-brand-green-deep text-primary-foreground">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-display text-2xl">Fundación Internacional Amigos Sin Fronteras</p>
            <p className="text-brand-gold mt-2 text-sm font-semibold tracking-wide">
              {org.eslogan}
            </p>
            <p className="text-primary-foreground/75 mt-5 max-w-sm text-sm leading-relaxed italic">
              {org.frases[0]}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`tel:+57${org.telefonos[0].replace(/\s/g, "")}`}
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
                        hash={e.hash}
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
                {org.telefonos.map((t) => (
                  <a
                    key={t}
                    href={`tel:+57${t.replace(/\s/g, "")}`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {t}
                  </a>
                ))}
                <a href={`mailto:${org.correo}`} className="hover:text-primary-foreground">
                  {org.correo}
                </a>
                <a href={org.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary-foreground">
                  {org.instagram}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-primary-foreground/15 mt-12 border-t pt-8">
          <h2 className="text-primary-foreground/70 text-xs font-bold tracking-[0.14em] uppercase">
            Información institucional
          </h2>
          <p className="text-primary-foreground/65 mt-3 max-w-3xl text-xs leading-relaxed">
            Razón social: {org.razonSocial} · Sigla: {org.sigla} · Tipo: {org.tipoContribuyente} ·
            NIT: {org.nit} · Domicilio principal: {org.ciudadPrincipal}.
          </p>
          <p className="text-primary-foreground/55 mt-6 text-xs">
            © {new Date().getFullYear()} Fundación Internacional Amigos Sin Fronteras – FUNASF.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
