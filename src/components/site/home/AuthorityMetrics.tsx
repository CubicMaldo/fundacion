import { BookOpen, Clock, GraduationCap, Percent } from "lucide-react";

interface MetricItem {
  valor: string;
  etiqueta: string;
  detalle: string;
  icono: typeof GraduationCap;
}

const metricas: MetricItem[] = [
  {
    valor: "+12.000",
    etiqueta: "Egresados formados",
    detalle: "Técnicos laborales impulsando el desarrollo regional",
    icono: GraduationCap,
  },
  {
    valor: "17+ Años",
    etiqueta: "Trayectoria y compromiso",
    detalle: "Cumpliendo metas educativas y labor social continua",
    icono: Clock,
  },
  {
    valor: "Hasta 90%",
    etiqueta: "Beca solidaria",
    detalle: "Subsidios educativos directos para estratos 1, 2 y 3",
    icono: Percent,
  },
  {
    valor: "19 Programas",
    etiqueta: "Técnicos y laborales",
    detalle: "En salud, sistemas, administración, agro y bienestar",
    icono: BookOpen,
  },
];

export function AuthorityMetrics() {
  return (
    <section
      aria-label="Cifras de impacto y autoridad institucional"
      className="relative z-10 -mt-6 sm:-mt-10 mb-12 sm:mb-16 container-page"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 bg-card border border-border/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl shadow-brand-green/5 backdrop-blur-sm">
        {metricas.map((m, idx) => {
          const Icon = m.icono;
          return (
            <div
              key={idx}
              className="flex flex-col items-start p-3 sm:p-4 rounded-xl transition-all duration-300 hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                  <Icon className="size-4 sm:size-5" />
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-display tabular-nums">
                  {m.valor}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-brand-green-deep tracking-tight">
                {m.etiqueta}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                {m.detalle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
