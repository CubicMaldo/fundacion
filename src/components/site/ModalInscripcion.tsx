import { useState } from "react";
import { CheckCircle2, ExternalLink, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { org } from "@/data/funasf";
import { crearInscripcion } from "@/services/api";

interface ModalInscripcionProps {
  programaNombre?: string;
  programaId?: string;
  triggerButton?: React.ReactNode;
}

export function ModalInscripcion({
  programaNombre = "Programa Académico",
  programaId,
  triggerButton,
}: ModalInscripcionProps) {
  const [open, setOpen] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [documentoTipo, setDocumentoTipo] = useState("CC");
  const [documentoNumero, setDocumentoNumero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoExito, setEnviadoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErrorMsg(null);

    const res = await crearInscripcion({
      nombreCompleto,
      documentoTipo,
      documentoNumero,
      telefono,
      correo,
      ciudad,
      programaNombre,
      programaId,
    });

    setEnviando(false);
    if (res.ok) {
      setEnviadoExito(true);
      setNombreCompleto("");
      setDocumentoNumero("");
      setTelefono("");
      setCorreo("");
      setCiudad("");
    } else {
      setErrorMsg(res.error || "Hubo un error al registrar la postulación. Intenta nuevamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="gold" size="lg">
            Postularme a este programa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand-green font-semibold text-xs tracking-wider uppercase">
            <GraduationCap className="size-4" />
            <span>Postulación a Beca FUNASF</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Inscripción para {programaNombre}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Diligencia tus datos para recibir asesoría sobre requisitos, horarios y asignación de
            beca solidaria.
          </DialogDescription>
        </DialogHeader>

        {enviadoExito ? (
          <div className="py-8 text-center space-y-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">¡Postulación registrada!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Hemos recibido tus datos correctamente. Nuestro equipo de admisiones te contactará por
              WhatsApp o llamada para formalizar tu proceso.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => {
                  setEnviadoExito(false);
                  setOpen(false);
                }}
              >
                Entendido
              </Button>
              <Button asChild variant="outline">
                <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                  Ver Google Form Oficial <ExternalLink className="size-3.5 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-2">
            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="postulante-nombre">Nombre completo *</Label>
              <Input
                id="postulante-nombre"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Nombres y apellidos completos"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="postulante-tipo-doc">Tipo doc.</Label>
                <select
                  id="postulante-tipo-doc"
                  value={documentoTipo}
                  onChange={(e) => setDocumentoTipo(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs"
                >
                  <option value="CC">C.C.</option>
                  <option value="TI">T.I.</option>
                  <option value="CE">C.E.</option>
                  <option value="PPT">PPT</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="postulante-num-doc">Número de documento *</Label>
                <Input
                  id="postulante-num-doc"
                  value={documentoNumero}
                  onChange={(e) => setDocumentoNumero(e.target.value)}
                  placeholder="Número de identidad"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postulante-tel">Teléfono / WhatsApp *</Label>
                <Input
                  id="postulante-tel"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 315 889 4421"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postulante-ciudad">Ciudad o Municipio *</Label>
                <Input
                  id="postulante-ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej. Cali, Soledad, etc."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postulante-correo">Correo electrónico *</Label>
              <Input
                id="postulante-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@correo.com"
                required
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={enviando}
                className="w-full bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold h-11"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" /> Enviando postulación...
                  </>
                ) : (
                  "Completar Postulación"
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                ¿Prefieres el formulario tradicional?{" "}
                <a
                  href={org.formularioInscripcion}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-green underline hover:text-brand-green-deep"
                >
                  Abrir formulario en Google Forms
                </a>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
