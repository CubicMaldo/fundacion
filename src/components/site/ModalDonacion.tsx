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

  const telefonoWa = settings?.contacto?.telefonos?.[0] ?? "+57 313 577 9384";
  const cleanPhone = telefonoWa.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`}?text=${encodeURIComponent("Hola FUNASF, deseo recibir los datos para realizar una donación y solicitar mi certificado institucional.")}`;

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
              <ShieldCheck className="size-4 text-brand-green" /> Donación Institucional Verificada
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Todas las donaciones son canalizadas a través de las cuentas oficiales de la fundación
              bajo personería jurídica registrada en Colombia:
            </p>
            <div className="space-y-2 text-xs bg-background p-3.5 rounded-lg border border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entidad:</span>
                <span className="font-medium">Fundación Internacional Amigos Sin Fronteras</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NIT Institucional:</span>
                <span className="font-medium text-foreground">901964394-1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entidad bancaria:</span>
                <span className="font-medium">Bancolombia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de cuenta:</span>
                <span className="font-medium">Cuenta de Ahorros Empresarial</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/60">
                <span className="text-muted-foreground">Certificado donación:</span>
                <span className="font-medium text-brand-green">Deducible de renta (DIAN)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-medium mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-amber-600 shrink-0" />
              Solicitud de datos y certificación
            </p>
            <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-400">
              Para garantizar la transparencia y expedir tu comprobante tributario oficial, comunícate
              directamente con nuestro equipo de Tesorería y Donaciones por WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild variant="gold" className="w-full gap-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Contactar a Tesorería por WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full text-xs">
              <a href="/contacto">Otras formas de apoyo o donaciones en especie</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
