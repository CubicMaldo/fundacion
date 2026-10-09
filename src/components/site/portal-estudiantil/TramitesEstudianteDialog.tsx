import { useState } from "react";
import { CheckCircle2, FileText, Loader2, MessageCircle, Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/data/funasf";
import { useAuth } from "@/lib/auth-context";
import { enviarMensajeContacto } from "@/services/api";

export type TipoTramite =
  | "Constancia de Estudio"
  | "Renovación de Beca"
  | "Certificado de Notas"
  | "Peticiones y Consultas";

interface TramitesEstudianteDialogProps {
  tipoInicial?: TipoTramite;
  trigger?: React.ReactNode;
}

export function TramitesEstudianteDialog({
  tipoInicial = "Constancia de Estudio",
  trigger,
}: TramitesEstudianteDialogProps) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoTramite>(tipoInicial);
  const [nombre, setNombre] = useState(profile?.nombre_completo || "");
  const [correo, setCorreo] = useState(profile?.email || user?.email || "");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErrorMsg(null);

    const res = await enviarMensajeContacto({
      nombre: nombre || "Estudiante FUNASF",
      correo,
      telefono: telefono || undefined,
      asunto: `[Trámite Estudiantil] ${tipo}`,
      mensaje: `Solicitud de trámite: ${tipo}\nEstudiante: ${nombre}\nDocumento/Detalle:\n${mensaje}`,
    });

    setEnviando(false);
    if (res.ok) {
      setEnviado(true);
    } else {
      setErrorMsg(res.error || "No se pudo radicar la solicitud. Intenta por WhatsApp o nuevamente.");
    }
  };

  const handleReset = () => {
    setEnviado(false);
    setMensaje("");
    setOpen(false);
  };

  const waMensaje = encodeURIComponent(
    `Hola FUNASF, soy el estudiante ${nombre || ""}. Deseo radicar la solicitud de: "${tipo}".`,
  );
  const waUrl = `${whatsappLink}?text=${waMensaje}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="size-4 mr-2" />
            Radicar {tipo}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
            <FileText className="size-5 text-brand-green" />
            Ventanilla de Trámites y Solicitudes
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Radica tu requerimiento académico directamente ante la secretaría y coordinación de FUNASF.
          </DialogDescription>
        </DialogHeader>

        {enviado ? (
          <div className="py-6 text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-foreground">¡Solicitud Radicada con Éxito!</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hemos recibido tu solicitud de <strong>{tipo}</strong>. Tu número de radicación interno se enviará a tu correo electrónico en un plazo máximo de 24 a 48 horas hábiles.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild size="sm" className="bg-brand-green hover:bg-brand-green-deep text-white">
                <a href={waUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4 mr-1.5" />
                  Notificar por WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="tramite-tipo" className="text-xs font-semibold">
                Tipo de solicitud *
              </Label>
              <select
                id="tramite-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoTramite)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Constancia de Estudio">Constancia de Estudio</option>
                <option value="Renovación de Beca">Renovación o Postulación de Beca</option>
                <option value="Certificado de Notas">Certificado Oficial de Calificaciones</option>
                <option value="Peticiones y Consultas">Petición, Queja o Consulta Académica</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tramite-nombre" className="text-xs font-semibold">
                Nombre del estudiante *
              </Label>
              <Input
                id="tramite-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="tramite-correo" className="text-xs font-semibold">
                  Correo electrónico *
                </Label>
                <Input
                  id="tramite-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tramite-tel" className="text-xs font-semibold">
                  Teléfono / WhatsApp *
                </Label>
                <Input
                  id="tramite-tel"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="313..."
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tramite-mensaje" className="text-xs font-semibold">
                Detalle del requerimiento o programa cursado *
              </Label>
              <Textarea
                id="tramite-mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Describe tu solicitud, semestre o jornada actual..."
                rows={3}
                required
                className="text-xs resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={enviando}
                className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold h-10 text-xs shadow-xs"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-2" />
                    Radicando solicitud...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5 mr-2" />
                    Radicar solicitud
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
