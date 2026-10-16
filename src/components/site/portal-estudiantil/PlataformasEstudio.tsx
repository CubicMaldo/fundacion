import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  GraduationCap,
  Laptop,
  MessageCircle,
  ShieldCheck,
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
        {/* Tarjeta 1: Aulas Virtuales */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green mb-4">
              <Laptop className="size-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green">
              Campus Digital
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">
              Aulas Virtuales y Material
            </h3>
            <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
              Ingresa al espacio de aprendizaje virtual dispuesto en articulación con tu institución aliada para consultar material de clase, actividades y evaluaciones.
            </p>
          </div>

          <div className="pt-6 space-y-2">
            <Button
              className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-medium text-xs shadow-xs"
              onClick={() => setModalAulaOpen(true)}
            >
              <span>Instructivo de Acceso</span>
              <ExternalLink className="size-3.5 ml-1.5" />
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Usa tu documento de identidad como usuario
            </p>
          </div>
        </div>

        {/* Tarjeta 2: Pensum y Guías de Estudio */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 mb-4">
              <BookOpen className="size-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-brown">
              Guías Académicas
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">
              Módulos y Pensum Oficial
            </h3>
            <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
              Consulta los módulos formativos, perfiles ocupacionales y ejes temáticos de cada uno de los programas técnico laborales en convenio.
            </p>
          </div>

          <div className="pt-6">
            <Button
              asChild
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted text-xs font-medium"
            >
              <Link to="/programas" className="flex items-center justify-center gap-1.5">
                <span>Consultar Módulos por Programa</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tarjeta 3: Horarios y Clases en Vivo (Google Meet / Zoom) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 mb-4">
              <Calendar className="size-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
              Sincrónico
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Clases en Vivo y Tutorías
            </h3>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              Accede a las sesiones sincrónicas con tus docentes y asesorías vocacionales grupales programadas por la Fundación.
            </p>
          </div>

          <div className="pt-6">
            <Button
              asChild
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
            >
              <a
                href={`${whatsappLink}?text=${encodeURIComponent("Hola FUNASF, deseo consultar el enlace de mi clase sincrónica de hoy.")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="size-3.5 text-emerald-600" />
                <span>Pedir Link de Tutoría</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Instructivo para Aulas Virtuales */}
      <Dialog open={modalAulaOpen} onOpenChange={setModalAulaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <GraduationCap className="size-5 text-brand-green" />
              <span>Acceso a las Aulas Virtuales</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Instrucciones de ingreso a las aulas de aprendizaje virtual.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs text-foreground/80 leading-relaxed">
            <div className="rounded-xl bg-brand-cream/50 border border-brand-gold/30 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-gold-deep text-xs">
                <ShieldCheck className="size-3.5" />
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
                  <MessageCircle className="size-3.5 mr-1.5" />
                  Escribir a Soporte Técnico
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => setModalAulaOpen(false)}
              >
                Cerrar instructivo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
