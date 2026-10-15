import { useState } from "react";
import { Play, Quote, Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Testimonio {
  id: string;
  nombre: string;
  programa: string;
  municipio: string;
  beca: string;
  resumen: string;
  cita: string;
  foto: string;
  videoUrl?: string;
}

const testimonios: Testimonio[] = [
  {
    id: "camila",
    nombre: "Camila Rodríguez Torres",
    programa: "Auxiliar en Enfermería",
    municipio: "Cali, Valle del Cauca",
    beca: "Beca 90 % Solidaria",
    resumen: "Realizando su práctica formativa en centros de salud del Valle del Cauca.",
    cita: "La beca de FUNASF me permitió formarme cuando pensé que no tenía opciones. Los docentes son profesionales activos en hospitales y la exigencia práctica te da total seguridad.",
    foto: "https://images.unsplash.com/photo-1594824813511-1a069df29c2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "andres",
    nombre: "Andrés Felipe Gómez",
    programa: "Auxiliar Administrativo y Contable",
    municipio: "Jamundí, Valle",
    beca: "Beca 90 % Solidaria",
    resumen: "Vinculado como asistente administrativo en empresa de distribución comercial.",
    cita: "Los horarios flexibles y la metodología práctica fueron clave para mí. Pude trabajar de día y adelantar mis módulos académicos sin descuidar mis ingresos familiares.",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "daniela",
    nombre: "Daniela Sofía Restrepo",
    programa: "Atención a la Primera Infancia",
    municipio: "Soledad, Atlántico",
    beca: "Beca 90 % Solidaria",
    resumen: "Auxiliar pedagógica en Centro de Desarrollo Infantil comunitario.",
    cita: "El enfoque humano de FUNASF marca la diferencia. No solo nos brindan formación técnica, sino el compromiso social con los niños y sus familias.",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "carlos",
    nombre: "Carlos Eduardo Silva",
    programa: "Mecánica de Motos",
    municipio: "Barranquilla, Atlántico",
    beca: "Beca 90 % Solidaria",
    resumen: "Emprendedor con taller propio de diagnóstico y mantenimiento preventivo.",
    cita: "En pocos meses adquirí las competencias técnicas para iniciar mi propio taller. El subsidio de beca del 90% hizo posible capacitarme sin endeudarme.",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
];

export function TestimoniosVideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Testimonio | null>(null);

  return (
    <Section id="testimonios">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <SectionHeading
          eyebrow="Historias de Éxito"
          title="Nuestros egresados transforman realidades"
          description="Conoce los testimonios reales de jóvenes y adultos que accedieron a nuestras becas y hoy lideran en sus áreas laborales en Colombia."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {testimonios.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:border-brand-green/40 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Foto con overlay de play */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
              <img
                src={t.foto}
                alt={t.nombre}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Píldora de beca */}
              <span className="absolute top-3 left-3 rounded-full bg-brand-gold/90 px-2.5 py-0.5 text-[11px] font-bold text-brand-green-deep shadow-xs backdrop-blur-xs">
                {t.beca}
              </span>

              {/* Botón de reproducción interactivo */}
              <button
                type="button"
                onClick={() => setSelectedVideo(t)}
                className="absolute inset-0 m-auto size-12 rounded-full bg-white/90 text-brand-green-deep flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group-hover:bg-brand-gold cursor-pointer"
                aria-label={`Ver testimonio de ${t.nombre}`}
              >
                <Play className="size-5 ml-0.5 fill-current" />
              </button>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <p className="text-xs font-semibold leading-tight">{t.nombre}</p>
                <p className="text-[11px] text-white/80">{t.municipio}</p>
              </div>
            </div>

            {/* Contenido del testimonio */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div
                  className="flex items-center gap-1 text-amber-500 mb-2"
                  role="img"
                  aria-label="Calificación: 5 de 5 estrellas"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
                  ))}
                </div>

                <span className="inline-block text-xs font-bold text-brand-green-deep mb-2">
                  {t.programa}
                </span>

                <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-4 relative pl-4 border-l-2 border-brand-green/30">
                  "{t.cita}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground/80">{t.resumen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox de Testimonio */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border">
          {selectedVideo && (
            <div>
              <div className="relative aspect-video w-full bg-black">
                {selectedVideo.videoUrl ? (
                  <iframe
                    src={`${selectedVideo.videoUrl}?autoplay=1`}
                    title={`Testimonio de ${selectedVideo.nombre}`}
                    className="size-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="size-full flex flex-col items-center justify-center p-6 text-center text-white bg-brand-green-deep">
                    <Quote className="size-12 text-brand-gold/60 mb-3" />
                    <p className="text-base font-semibold max-w-md">"{selectedVideo.cita}"</p>
                    <p className="text-xs text-brand-gold mt-3 font-bold">— {selectedVideo.nombre}</p>
                    <p className="text-[11px] text-white/80">{selectedVideo.programa}</p>
                  </div>
                )}
              </div>

              <div className="p-5">
                <DialogHeader>
                  <DialogTitle className="font-display text-lg font-bold text-foreground flex items-center justify-between">
                    <span>{selectedVideo.nombre}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {selectedVideo.municipio}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-brand-green-deep mr-2">
                    {selectedVideo.programa}
                  </span>
                  <span>· {selectedVideo.beca}</span>
                </div>
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                  "{selectedVideo.cita}"
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
