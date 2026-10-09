import { useState } from "react";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  GraduationCap,
  Laptop,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { whatsappLink } from "@/data/funasf";

export function PlataformasEstudio() {
  const [modalAulaOpen, setModalAulaOpen] = useState(false);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tarjeta 1: Aula Virtual */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between hover:border-brand-green/40 transition-colors">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green mb-4">
              <Laptop className="size-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground">
              Campus & Aula Virtual
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Accede a tus clases grabadas, foros de debate, guías de estudio y talleres en plataforma Moodle institucional.
            </p>
          </div>

          <div className="pt-6">
            <Button
              onClick={() => setModalAulaOpen(true)}
              className="w-full bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
            >
              Ingresar al Aula Virtual
              <ExternalLink className="size-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Tarjeta 2: Calendario y Horarios */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between hover:border-brand-green/40 transition-colors">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold-deep mb-4">
              <Calendar className="size-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground">
              Calendario Académico 2026
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Consulta las fechas de inicio de módulos, entrega de notas parciales, semanas de recuperación y ceremonias de grado.
            </p>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" className="w-full text-xs font-semibold">
              <a href="#tramites">
                Ver fechas y trámites
              </a>
            </Button>
          </div>
        </div>

        {/* Tarjeta 3: Biblioteca y Recursos */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between hover:border-brand-green/40 transition-colors">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green mb-4">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground">
              Biblioteca y Guías de Apoyo
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Material bibliográfico, manuales técnicos de enfermería, primeros auxilios, veterinaria y sistemas en acceso abierto.
            </p>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" className="w-full text-xs font-semibold">
              <a
                href={`${whatsappLink}?text=${encodeURIComponent("Hola FUNASF, solicito acceso al repositorio de guías y biblioteca digital.")}`}
                target="_blank"
                rel="noreferrer"
              >
                Solicitar guías de estudio
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Acceso al Aula Virtual */}
      <Dialog open={modalAulaOpen} onOpenChange={setModalAulaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Laptop className="size-5 text-brand-green" />
              Acceso al Campus Virtual FUNASF
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Instrucciones de ingreso a las aulas de aprendizaje virtual.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs text-foreground/80 leading-relaxed">
            <div className="rounded-xl bg-brand-cream/50 border border-brand-gold/30 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-gold-deep text-xs">
                <Sparkles className="size-3.5" />
                <span>Credenciales de ingreso a plataforma Moodle</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                <strong>Usuario:</strong> Tu número de documento de identidad (sin puntos ni espacios).<br />
                <strong>Contraseña inicial:</strong> Asignada durante tu inducción o enviada a tu correo institucional.
              </p>
            </div>

            <p>
              Si presentas dificultades con tu usuario o restablecimiento de clave, puedes contactar al soporte técnico de sistemas vía WhatsApp:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Button asChild className="w-full bg-brand-green hover:bg-brand-green-deep text-white text-xs">
                <a
                  href={`${whatsappLink}?text=${encodeURIComponent("Hola Soporte FUNASF, requiero soporte de acceso a mi Campus Virtual.")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4 mr-2" />
                  Soporte Técnico por WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={() => setModalAulaOpen(false)} className="text-xs">
                Entendido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
