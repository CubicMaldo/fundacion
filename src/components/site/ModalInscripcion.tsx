import { useState } from "react";
import { CheckCircle2, ExternalLink, GraduationCap, Loader2, MessageCircle } from "lucide-react";
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
import { org, whatsappLink } from "@/data/funasf";
import { programasAcademicos } from "@/data/programas";
import { crearInscripcion } from "@/services/api";

interface ModalInscripcionProps {
  programaNombre?: string;
  programaId?: string;
  triggerButton?: React.ReactNode;
}

export function ModalInscripcion({
  programaNombre,
  programaId,
  triggerButton,
}: ModalInscripcionProps) {
  const [open, setOpen] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(
    programaNombre || programasAcademicos[0]?.nombre || "Auxiliar de Enfermería",
  );
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [documentoTipo, setDocumentoTipo] = useState("CC");
  const [documentoNumero, setDocumentoNumero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [modalidadDeseada, setModalidadDeseada] = useState("Virtual");
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
      ciudad: `${ciudad} (${modalidadDeseada})`,
      programaNombre: programaNombre || programaSeleccionado,
      programaId: programaId || undefined,
    });

    setEnviando(false);
    if (res.ok) {
      setEnviadoExito(true);
    } else {
      setErrorMsg(res.error || "Hubo un error al registrar la postulación. Intenta nuevamente.");
    }
  };

  const handleReset = () => {
    setEnviadoExito(false);
    setNombreCompleto("");
    setDocumentoNumero("");
    setTelefono("");
    setCorreo("");
    setCiudad("");
    setOpen(false);
  };

  const waMensaje = encodeURIComponent(
    `Hola FUNASF, acabo de diligenciar el formulario de postulación a beca para el programa "${programaNombre || programaSeleccionado}". Mi nombre es ${nombreCompleto || ""}. Quisiera más información sobre los siguientes pasos.`,
  );
  const waUrl = `${whatsappLink}?text=${waMensaje}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="gold" size="lg">
            Postularme a este programa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand-green font-semibold text-xs tracking-wider uppercase">
            <GraduationCap className="size-4" />
            <span>Postulación a Beca FUNASF</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {programaNombre ? `Inscripción para ${programaNombre}` : "Formulario de Inscripción y Becas"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Diligencia tus datos para recibir asesoría sobre requisitos, convocatorias vigentes y asignación de
            beca de hasta el 90 %.
          </DialogDescription>
        </DialogHeader>

        {enviadoExito ? (
          <div className="py-6 text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">¡Postulación registrada con éxito!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Hemos recibido tus datos para el programa{" "}
              <strong className="text-foreground">{programaNombre || programaSeleccionado}</strong>. Nuestro equipo de
              admisiones y orientación te contactará en breve.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 max-w-xs mx-auto">
              <Button asChild className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold">
                <a href={waUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4 mr-2" />
                  Escribir a WhatsApp ahora
                </a>
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Cerrar formulario
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

            {/* Selector de programa si no fue predeterminado */}
            {!programaNombre ? (
              <div className="space-y-1.5">
                <Label htmlFor="postulante-programa" className="text-xs font-semibold">
                  Programa académico de tu interés *
                </Label>
                <select
                  id="postulante-programa"
                  value={programaSeleccionado}
                  onChange={(e) => setProgramaSeleccionado(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  {programasAcademicos.map((prog) => (
                    <option key={prog.slug} value={prog.nombre}>
                      {prog.nombre} ({prog.categoria})
                    </option>
                  ))}
                  <option value="Validación del Bachillerato">Validación del Bachillerato (Básica y Media)</option>
                  <option value="Orientación Vocacional General">Otro / Deseo recibir orientación general</option>
                </select>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="postulante-nombre" className="text-xs font-semibold">
                Nombre completo *
              </Label>
              <Input
                id="postulante-nombre"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Nombres y apellidos completos"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="postulante-tipo-doc" className="text-xs font-semibold">
                  Tipo doc.
                </Label>
                <select
                  id="postulante-tipo-doc"
                  value={documentoTipo}
                  onChange={(e) => setDocumentoTipo(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="CC">C.C.</option>
                  <option value="TI">T.I.</option>
                  <option value="CE">C.E.</option>
                  <option value="PPT">PPT</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="postulante-num-doc" className="text-xs font-semibold">
                  Número de documento *
                </Label>
                <Input
                  id="postulante-num-doc"
                  value={documentoNumero}
                  onChange={(e) => setDocumentoNumero(e.target.value)}
                  placeholder="Número de identidad"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="postulante-tel" className="text-xs font-semibold">
                  Teléfono / WhatsApp *
                </Label>
                <Input
                  id="postulante-tel"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 313 577 9384"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postulante-ciudad" className="text-xs font-semibold">
                  Ciudad o Municipio *
                </Label>
                <Input
                  id="postulante-ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej. Cali, Soledad, Santo Tomás..."
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="postulante-correo" className="text-xs font-semibold">
                  Correo electrónico *
                </Label>
                <Input
                  id="postulante-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="nombre@correo.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postulante-modalidad" className="text-xs font-semibold">
                  Modalidad preferida
                </Label>
                <select
                  id="postulante-modalidad"
                  value={modalidadDeseada}
                  onChange={(e) => setModalidadDeseada(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Virtual">Virtual / A distancia</option>
                  <option value="Presencial Cali">Presencial (Sede Cali)</option>
                  <option value="Presencial Atlántico">Presencial (Sedes Atlántico)</option>
                  <option value="Flexible">Horario flexible / Fines de semana</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={enviando}
                className="w-full bg-brand-green hover:bg-brand-green-deep text-primary-foreground font-semibold h-11 text-base shadow-sm"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" /> Enviando postulación...
                  </>
                ) : (
                  "Enviar postulación a beca"
                )}
              </Button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-muted-foreground">
                  Al enviar autorizas el tratamiento de tus datos para fines de asesoría y matrícula.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  ¿Problemas con el formulario?{" "}
                  <a
                    href={org.formularioInscripcion}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-green underline hover:text-brand-green-deep"
                  >
                    Abrir Google Form alternativo <ExternalLink className="inline size-3" />
                  </a>
                </p>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
