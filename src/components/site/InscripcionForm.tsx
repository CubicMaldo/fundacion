import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { org, whatsappLink } from "@/data/funasf";
import { programasAcademicos } from "@/data/programas";
import { crearInscripcion } from "@/services/api";

export interface InscripcionFormProps {
  programaNombre?: string | undefined;
  programaId?: string | undefined;
  onSuccess?: (() => void) | undefined;
  onReset?: (() => void) | undefined;
  showHeader?: boolean | undefined;
  className?: string | undefined;
}

export function InscripcionForm({
  programaNombre,
  programaId,
  onSuccess,
  onReset,
  showHeader = false,
  className = "",
}: InscripcionFormProps) {
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
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot
  const [enviando, setEnviando] = useState(false);
  const [enviadoExito, setEnviadoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectivePrograma = programaNombre || programaSeleccionado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Detección de bot silenciosa
      setEnviadoExito(true);
      return;
    }

    setEnviando(true);
    setErrorMsg(null);

    const res = await crearInscripcion({
      nombreCompleto,
      documentoTipo,
      documentoNumero,
      telefono,
      correo,
      ciudad: `${ciudad} (${modalidadDeseada})`,
      programaNombre: effectivePrograma,
      programaId: programaId || undefined,
      website_empresa: honeypot || undefined,
    });

    setEnviando(false);
    if (res.ok) {
      setEnviadoExito(true);
      onSuccess?.();
    } else {
      setErrorMsg(res.error || "Hubo un error al registrar la postulación. Intenta nuevamente.");
    }
  };

  const handleResetForm = () => {
    setEnviadoExito(false);
    setNombreCompleto("");
    setDocumentoNumero("");
    setTelefono("");
    setCorreo("");
    setCiudad("");
    setHoneypot("");
    onReset?.();
  };

  const waMensaje = encodeURIComponent(
    `Hola FUNASF, acabo de diligenciar el formulario de postulación a beca para el programa "${effectivePrograma}". Mi nombre es ${nombreCompleto || ""}. Quisiera validar los requisitos y fechas de inicio.`,
  );
  const waUrl = `${whatsappLink}?text=${waMensaje}`!;

  if (enviadoExito) {
    return (
      <div className="py-8 text-center space-y-5">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-display text-foreground">
            ¡Tu inscripción ha sido registrada!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Hemos recibido correctamente tus datos para el programa{" "}
            <strong className="text-foreground">{effectivePrograma}</strong>. Uno de nuestros orientadores se pondrá en contacto contigo vía WhatsApp o llamada telefónica.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold">
            <a href={waUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4 mr-2" />
              Contactar por WhatsApp ahora
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={handleResetForm}>
            Nueva postulación
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="mb-2">
          <h2 className="text-xl font-bold font-display text-foreground">
            Datos del Postulante
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Todos los campos marcados con (*) son indispensables para formalizar tu solicitud de beca.
          </p>
        </div>
      )}

      {/* Honeypot anti-spam oculto */}
      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
        <input
          type="text"
          name="website_empresa"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
        />
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
          {errorMsg}
        </div>
      )}

      {/* Selector de programa si no fue predeterminado */}
      {!programaNombre && (
        <div className="space-y-1.5">
          <Label htmlFor="form-programa" className="text-xs font-semibold">
            Programa académico de interés *
          </Label>
          <select
            id="form-programa"
            value={programaSeleccionado}
            onChange={(e) => setProgramaSeleccionado(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            {programasAcademicos.map((prog) => (
              <option key={prog.slug} value={prog.nombre}>
                {prog.nombre} — {prog.categoria}
              </option>
            ))}
            <option value="Validación del Bachillerato">Validación del Bachillerato (Básica y Media)</option>
            <option value="Orientación Vocacional General">Deseo recibir orientación general</option>
          </select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="form-nombre" className="text-xs font-semibold">
          Nombre completo *
        </Label>
        <Input
          id="form-nombre"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          placeholder="Nombres y apellidos completos"
          required
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="form-tipo-doc" className="text-xs font-semibold">
            Tipo doc. *
          </Label>
          <select
            id="form-tipo-doc"
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
          <Label htmlFor="form-num-doc" className="text-xs font-semibold">
            Número de documento *
          </Label>
          <Input
            id="form-num-doc"
            value={documentoNumero}
            onChange={(e) => setDocumentoNumero(e.target.value)}
            placeholder="Número de identidad"
            required
            className="h-10"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="form-telefono" className="text-xs font-semibold">
            Teléfono / WhatsApp *
          </Label>
          <Input
            id="form-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 313 577 9384"
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="form-ciudad" className="text-xs font-semibold">
            Ciudad o Municipio *
          </Label>
          <Input
            id="form-ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ej. Cali, Soledad, Barranquilla..."
            required
            className="h-10"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="form-correo" className="text-xs font-semibold">
            Correo electrónico *
          </Label>
          <Input
            id="form-correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="nombre@correo.com"
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="form-modalidad" className="text-xs font-semibold">
            Modalidad preferida
          </Label>
          <select
            id="form-modalidad"
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

      <div className="pt-2 space-y-3">
        <Button
          type="submit"
          disabled={enviando}
          className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold h-11 text-base shadow-sm"
        >
          {enviando ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Registrando postulación...
            </>
          ) : (
            "Enviar solicitud de inscripción y beca"
          )}
        </Button>

        <div className="text-center pt-1">
          <p className="text-[11px] text-muted-foreground">
            Al enviar autorizas el tratamiento de tus datos personales conforme a nuestra política de privacidad.
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            ¿Deseas diligenciar el formulario externo?{" "}
            <a
              href={org.formularioInscripcion}
              target="_blank"
              rel="noreferrer"
              className="text-brand-green underline hover:text-brand-green-deep font-medium"
            >
              Abrir Google Forms <ExternalLink className="inline size-3" />
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
