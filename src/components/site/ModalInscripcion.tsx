import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InscripcionForm } from "./InscripcionForm";

export interface ModalInscripcionProps {
  programaNombre?: string | undefined;
  programaId?: string | undefined;
  triggerButton?: React.ReactNode | undefined;
}

export function ModalInscripcion({
  programaNombre,
  programaId,
  triggerButton,
}: ModalInscripcionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold">
            <GraduationCap className="size-4 mr-2" />
            Postularme a una beca
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand-green">
            <GraduationCap className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Admisiones y Becas FUNASF
            </span>
          </div>
          <DialogTitle className="text-xl font-display font-bold">
            Formulario de Postulación a Beca
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Diligencia tus datos para iniciar el proceso de selección y validación de cobertura de hasta el 90%.
          </DialogDescription>
        </DialogHeader>

        <InscripcionForm
          programaNombre={programaNombre}
          programaId={programaId}
          className="mt-2"
        />
      </DialogContent>
    </Dialog>
  );
}
