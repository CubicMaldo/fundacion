import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { org, whatsappLink } from "@/data/funasf";
import { programasAcademicos } from "@/data/programas";
import { crearInscripcion } from "@/services/api";
import { createSeoMeta, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/inscripcion")({
  head: () =>
    createSeoMeta({
      title: "Formulario de Inscripción y Becas | FUNASF Colombia — EduFUNASF",
      description:
        "Postúlate a las convocatorias de becas de hasta el 90 % en formación técnica, laboral y programas sociales de FUNASF en Colombia. Diligencia tu formulario oficial.",
      canonicalPath: "/inscripcion",
      keywords:
        "formulario inscripcion FUNASF, becas FUNASF, postularse beca fundacion, estudiar con FUNASF, formacion tecnica Cali Atlantico",
      jsonLd: [
        getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Inscripción", path: "/inscripcion" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Formulario Oficial de Inscripción — FUNASF",
          url: `${SITE_URL}/inscripcion`,
          description: "Formulario de postulación para programas académicos y convocatorias de becas solidarias.",
        },
      ],
    }),
  component: InscripcionPage,
});

function InscripcionPage() {
  const [programaSeleccionado, setProgramaSeleccionado] = useState(
    programasAcademicos[0]?.nombre || "Auxiliar de Enfermería",
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
      programaNombre: programaSeleccionado,
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
  };

  const waMensaje = encodeURIComponent(
    `Hola FUNASF, acabo de diligenciar el formulario de inscripción para "${programaSeleccionado}". Mi nombre es ${nombreCompleto}. Quisiera validar los requisitos y fechas de inicio.`,
  );
  const waUrl = `${whatsappLink}?text=${waMensaje}`;

  return (
    <>
      <PageHero
        eyebrow="Convocatorias y Admisiones"
        title="Formulario Oficial de Inscripción"
        description="Diligencia tus datos para iniciar tu postulación a becas solidarias de hasta el 90 % en programas técnicos y de formación para el trabajo."
      />

      <Section tone="surface">
        <div className="mx-auto max-w-4xl grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Columna Principal: Formulario */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
            {enviadoExito ? (
              <div className="py-10 text-center space-y-5">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
                  <CheckCircle2 className="size-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    ¡Tu inscripción ha sido registrada!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Hemos recibido correctamente tus datos para el programa{" "}
                    <strong className="text-foreground">{programaSeleccionado}</strong>. Uno de nuestros orientadores se
                    pondrá en contacto contigo vía WhatsApp o llamada telefónica.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-deep text-white font-semibold">
                    <a href={waUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4 mr-2" />
                      Contactar por WhatsApp ahora
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    Nueva postulación
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Datos del Postulante
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todos los campos marcados con (*) son indispensables para formalizar tu solicitud.
                  </p>
                </div>

                {errorMsg && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="prog-select" className="text-xs font-semibold">
                    Programa académico de interés *
                  </Label>
                  <select
                    id="prog-select"
                    value={programaSeleccionado}
                    onChange={(e) => setProgramaSeleccionado(e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    {programasAcademicos.map((prog) => (
                      <option key={prog.slug} value={prog.nombre}>
                        {prog.nombre} — {prog.categoria}
                      </option>
                    ))}
                    <option value="Validación del Bachillerato">Validación del Bachillerato</option>
                    <option value="Orientación Vocacional General">Deseo recibir orientación general</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre-completo" className="text-xs font-semibold">
                    Nombre completo *
                  </Label>
                  <Input
                    id="nombre-completo"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Nombres y apellidos completos"
                    required
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-doc" className="text-xs font-semibold">
                      Tipo doc. *
                    </Label>
                    <select
                      id="tipo-doc"
                      value={documentoTipo}
                      onChange={(e) => setDocumentoTipo(e.target.value)}
                      className="h-11 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="CC">C.C.</option>
                      <option value="TI">T.I.</option>
                      <option value="CE">C.E.</option>
                      <option value="PPT">PPT</option>
                      <option value="PAS">Pasaporte</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="num-doc" className="text-xs font-semibold">
                      Número de documento *
                    </Label>
                    <Input
                      id="num-doc"
                      value={documentoNumero}
                      onChange={(e) => setDocumentoNumero(e.target.value)}
                      placeholder="Número de identidad"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-xs font-semibold">
                      Teléfono / WhatsApp *
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. 313 577 9384"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-xs font-semibold">
                      Ciudad o Municipio de residencia *
                    </Label>
                    <Input
                      id="ciudad"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Ej. Cali, Soledad, Santo Tomás..."
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="correo" className="text-xs font-semibold">
                      Correo electrónico *
                    </Label>
                    <Input
                      id="correo"
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="nombre@correo.com"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modalidad" className="text-xs font-semibold">
                      Modalidad de preferencia
                    </Label>
                    <select
                      id="modalidad"
                      value={modalidadDeseada}
                      onChange={(e) => setModalidadDeseada(e.target.value)}
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Virtual">Virtual / A distancia</option>
                      <option value="Presencial Cali">Presencial (Sede Cali)</option>
                      <option value="Presencial Atlántico">Presencial (Sedes Atlántico)</option>
                      <option value="Flexible">Horario flexible / Fines de semana</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 space-y-3">
                  <Button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold h-12 text-base shadow-sm"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="size-5 animate-spin mr-2" /> Registrando inscripción...
                      </>
                    ) : (
                      "Enviar solicitud de inscripción y beca"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Tus datos se encuentran protegidos bajo la política de privacidad y tratamiento de datos de FUNASF.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Columna Lateral: Información de Apoyo */}
          <div className="space-y-5">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
                <Sparkles className="size-4" />
                <span>Beneficios de la Beca</span>
              </div>
              <h4 className="text-base font-bold font-display text-foreground">
                Apoyo Educativo FUNASF
              </h4>
              <ul className="text-xs text-muted-foreground space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Subsidio de hasta el 90 % en el valor del programa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Sin cobro de matrícula en convocatorias vigentes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Certificación oficial por institución educativa aliada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Acompañamiento docente y opciones presenciales o virtuales.</span>
                </li>
              </ul>
            </div>

            <div className="bg-brand-green-soft/20 rounded-xl border border-brand-green-soft/40 p-5 space-y-3">
              <h4 className="text-sm font-bold text-brand-green-deep flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-green" />
                Atención Directa
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ¿Prefieres que un asesor te asista directamente en tu inscripción o tienes dudas sobre los requisitos?
              </p>
              <div className="space-y-2 pt-1">
                <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-3.5 mr-2 text-emerald-600" /> WhatsApp Oficial
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                  <Link to="/contacto">
                    <Phone className="size-3.5 mr-2 text-brand-brown" /> Líneas de Atención
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center p-4 border border-dashed rounded-xl border-border">
              <p className="text-xs text-muted-foreground mb-2">
                ¿Prefieres diligenciar el formulario externo en Google Forms?
              </p>
              <Button asChild variant="ghost" size="sm" className="text-xs text-brand-green">
                <a href={org.formularioInscripcion} target="_blank" rel="noreferrer">
                  Abrir Google Forms <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
