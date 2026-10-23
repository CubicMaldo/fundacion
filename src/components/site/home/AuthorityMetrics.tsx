import { BookOpen, Building2, MapPin, Percent } from "lucide-react";

interface MetricItem {
  prefijo?: string;
  valor: string;
  sufijo?: string;
  etiquetaCorta?: string;
  etiqueta: string;
  detalle: string;
  icono: typeof BookOpen;
  isMono?: boolean;
}

const metricas: MetricItem[] = [
  {
    valor: "19",
    sufijo: "Programas",
    etiquetaCorta: "Formación",
    etiqueta: "Oferta técnico-laboral",
    detalle: "Salud, administración, SST, educación y áreas productivas",
    icono: BookOpen,
  },
  {
    prefijo: "Hasta",
    valor: "90%",
    etiquetaCorta: "Convenio",
    etiqueta: "Beca solidaria",
    detalle: "Subsidios educativos directos en convenio institucional",
    icono: Percent,
  },
  {
    valor: "6+",
    sufijo: "Territorios",
    etiquetaCorta: "Multi-sede",
    etiqueta: "Presencia regional",
    detalle: "Valle, Atlántico, Cesar y proyección internacional en Panamá",
    icono: MapPin,
  },
  {
    prefijo: "NIT",
    valor: "901964394-1",
    etiquetaCorta: "Oficial",
    etiqueta: "Personería jurídica formal",
    detalle: "Entidad sin ánimo de lucro registrada en Colombia",
    icono: Building2,
    isMono: true,
  },
];

export function AuthorityMetrics() {
  return (
    <section
      aria-labelledby="metricas-heading"
      className="relative z-10 -mt-6 sm:-mt-10 mb-12 sm:mb-16 container-page"
    >
      <h2 id="metricas-heading" className="sr-only">
        Cifras de impacto y autoridad institucional
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 bg-card border border-border/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[var(--shadow-soft)]">
        {metricas.map((m, idx) => {
          const Icon = m.icono;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between p-3 sm:p-4 rounded-xl transition-colors duration-200 hover:bg-muted/50 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center size-9 sm:size-10 rounded-lg bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                    <Icon className="size-4 sm:size-5" />
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {m.prefijo && (
                    <span className="text-xs sm:text-sm font-bold text-muted-foreground tracking-wide">
                      {m.prefijo}
                    </span>
                  )}
                  <span
                    className={`font-extrabold tracking-tight text-foreground tabular-nums whitespace-nowrap ${
                      m.isMono
                        ? "font-mono text-xl sm:text-2xl lg:text-[1.35rem]"
                        : "font-display text-2xl sm:text-3xl lg:text-4xl"
                    }`}
                  >
                    {m.valor}
                  </span>
                  {m.sufijo && (
                    <span className="text-xs sm:text-sm font-semibold text-brand-green-deep">
                      {m.sufijo}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mt-2">
                  {m.etiqueta}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-snug line-clamp-2">
                {m.detalle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
