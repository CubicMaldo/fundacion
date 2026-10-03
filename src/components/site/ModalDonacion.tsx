import { useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalDonacionProps {
  triggerButton?: React.ReactNode;
}

export function ModalDonacion({
  triggerButton,
}: ModalDonacionProps) {
  const [open, setOpen] = useState(false);

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
            Tu solidaridad se transforma en oportunidades reales para quienes más lo necesitan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="bg-brand-green-soft/20 rounded-lg p-5 border border-brand-green-soft">
            <h4 className="font-semibold text-brand-green-deep mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand-green" /> Transferencia Bancaria
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Puedes realizar tu donación directamente a nuestra cuenta institucional:
            </p>
            <div className="space-y-2 text-sm bg-background p-3 rounded border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Banco:</span>
                <span className="font-medium">Bancolombia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de cuenta:</span>
                <span className="font-medium">Ahorros</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número:</span>
                <span className="font-medium">PENDIENTE (Añadir cuenta)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titular:</span>
                <span className="font-medium">FUNASF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NIT:</span>
                <span className="font-medium">901964394-1</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              ¿Deseas donar a través de otro medio o realizar una donación en especie?
            </p>
            <Button variant="outline" asChild className="w-full">
              <a href="/contacto">Contáctanos directamente</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
