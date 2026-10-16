import { useState } from "react";
import { CheckCircle2, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSiteSettings } from "@/lib/site-settings-context";

interface ModalDonacionProps {
  triggerButton?: React.ReactNode;
}

export function ModalDonacion({ triggerButton }: ModalDonacionProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useSiteSettings();
  const org = settings.org;

  const telefonoWa = settings?.contacto?.telefonos?.[0] ?? org.telefonos[0] ?? "+57 313 577 9384";
  const cleanPhone = telefonoWa.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`}?text=${encodeURIComponent("Hola FUNASF, deseo recibir información oficial para realizar un aporte o donación institucional.")}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="gold" className="gap-2">
            <Heart className="size-4" />
            Donar Ahora
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Haz un aporte a FUNASF</DialogTitle>
          <DialogDescription>
            Tu solidaridad se transforma en oportunidades reales y becas formativas para jóvenes y
            comunidades que más lo necesitan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <div className="bg-brand-green/5 rounded-xl p-5 border border-brand-green/20">
            <h4 className="font-semibold text-brand-green-deep mb-2 flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-brand-green" /> Identificación Institucional Oficial (RUT)
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Los aportes solidarios se gestionan directamente con la coordinación institucional de
              la fundación bajo personería jurídica registrada en Colombia:
            </p>
            <div className="space-y-2 text-xs bg-background p-3.5 rounded-lg border border-border">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Razón social:</span>
                <span className="font-medium text-right">{org.nombre}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Sigla:</span>
                <span className="font-medium text-right">{org.sigla}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">NIT Institucional:</span>
                <span className="font-medium text-foreground tabular-nums">{org.nit}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Domicilio principal:</span>
                <span className="font-medium text-right">{org.direccionPrincipal}</span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-border/60">
                <span className="text-muted-foreground shrink-0">Correo oficial:</span>
                <span className="font-medium text-brand-green">{org.correo}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-medium mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-amber-600 shrink-0" />
              Canal directo de aportes y alianzas
            </p>
            <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-400">
              Para recibir orientación sobre aportes solidarios, convenios o donaciones en especie,
              comunícate directamente con nuestro canal oficial de atención en WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild variant="gold" className="w-full gap-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Contactar por WhatsApp Oficial
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full text-xs">
              <a href="/donaciones">Ver información de donaciones y alianzas</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
