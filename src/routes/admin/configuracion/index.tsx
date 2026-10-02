import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Shield,
  Sliders,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import {
  saveLocalSiteSettingsOverride,
  getLocalSiteSettingsOverride,
  sanitizeDomain,
} from "@/services/api";
import { toast } from "sonner";
import { org, becas, sedes } from "@/data/funasf";

export const Route = createFileRoute("/admin/configuracion/")({
  head: () => ({
    meta: [{ title: "Configuración Institucional | FUNASF Admin" }],
  }),
  component: AdminConfiguracionPage,
});

function AdminConfiguracionPage() {
  const { isConfigured, isAdmin } = useAuth();
  const { refreshSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState("contacto");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados de Contacto
  const [telefonos, setTelefonos] = useState<string[]>(org.telefonos);
  const [correo, setCorreo] = useState(org.correo);
  const [instagram, setInstagram] = useState(org.instagram);
  const [instagramUrl, setInstagramUrl] = useState(org.instagramUrl);
  const [direccionPrincipal, setDireccionPrincipal] = useState(org.direccionPrincipal);
  const [ciudadPrincipal, setCiudadPrincipal] = useState(org.ciudadPrincipal);
  const [formularioInscripcion, setFormularioInscripcion] = useState(org.formularioInscripcion);
  const [horario, setHorario] = useState("Lunes a Viernes 8:00 AM - 5:00 PM");

  // Estados Institucionales
  const [nombre, setNombre] = useState(org.nombre);
  const [sigla, setSigla] = useState(org.sigla);
  const [nit, setNit] = useState(org.nit);
  const [eslogan, setEslogan] = useState(org.eslogan);
  const [esloganSecundario, setEsloganSecundario] = useState(org.esloganSecundario);

  // Estados de Becas
  const [porcentajeBeca, setPorcentajeBeca] = useState(becas.porcentaje);
  const [tituloBecas, setTituloBecas] = useState(becas.titulo);
  const [introBecas, setIntroBecas] = useState(becas.intro);
  const [aclaracionBecas, setAclaracionBecas] = useState(becas.aclaracion);
  const [beneficios, setBeneficios] = useState<string[]>(becas.beneficios);

  useEffect(() => {
    async function loadConfig() {
      const localOverride = getLocalSiteSettingsOverride();
      if (localOverride) {
        if (localOverride.contacto) {
          const c = localOverride.contacto;
          if (c.telefonos) setTelefonos(c.telefonos);
          if (c.correo) setCorreo(sanitizeDomain(c.correo));
          if (c.instagram) setInstagram(c.instagram);
          if (c.instagramUrl) setInstagramUrl(c.instagramUrl);
          if (c.direccionPrincipal) setDireccionPrincipal(c.direccionPrincipal);
          if (c.ciudadPrincipal) setCiudadPrincipal(c.ciudadPrincipal);
          if (c.formularioInscripcion) setFormularioInscripcion(c.formularioInscripcion);
          if (c.horario) setHorario(c.horario);
        }
        if (localOverride.institucional) {
          const inst = localOverride.institucional;
          if (inst.nombre) setNombre(inst.nombre);
          if (inst.sigla) setSigla(inst.sigla);
          if (inst.nit) setNit(inst.nit);
          if (inst.eslogan) setEslogan(inst.eslogan);
          if (inst.esloganSecundario) setEsloganSecundario(inst.esloganSecundario);
        }
        if (localOverride.becas) {
          const b = localOverride.becas;
          if (b.porcentaje) setPorcentajeBeca(b.porcentaje);
          if (b.titulo) setTituloBecas(b.titulo);
          if (b.intro) setIntroBecas(b.intro);
          if (b.aclaracion) setAclaracionBecas(b.aclaracion);
          if (b.beneficios) setBeneficios(b.beneficios);
        }
      }

      if (!isConfigured) return;

      try {
        const { data, error } = await supabase.from("configuracion").select("*");
        if (!error && data) {
          data.forEach((row) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const v = row.valor as any;
            if (row.clave === "contacto" && v) {
              if (v.telefonos && !localOverride?.contacto?.telefonos) setTelefonos(v.telefonos);
              if (v.correo && !localOverride?.contacto?.correo) setCorreo(sanitizeDomain(v.correo));
              if (v.instagram && !localOverride?.contacto?.instagram) setInstagram(v.instagram);
              if (v.instagramUrl && !localOverride?.contacto?.instagramUrl)
                setInstagramUrl(v.instagramUrl);
              if (v.direccionPrincipal && !localOverride?.contacto?.direccionPrincipal)
                setDireccionPrincipal(v.direccionPrincipal);
              if (v.ciudadPrincipal && !localOverride?.contacto?.ciudadPrincipal)
                setCiudadPrincipal(v.ciudadPrincipal);
              if (v.formularioInscripcion && !localOverride?.contacto?.formularioInscripcion)
                setFormularioInscripcion(v.formularioInscripcion);
              if (v.horario && !localOverride?.contacto?.horario) setHorario(v.horario);
            }
            if (row.clave === "institucional" && v) {
              if (v.nombre && !localOverride?.institucional?.nombre) setNombre(v.nombre);
              if (v.sigla && !localOverride?.institucional?.sigla) setSigla(v.sigla);
              if (v.nit && !localOverride?.institucional?.nit) setNit(v.nit);
              if (v.eslogan && !localOverride?.institucional?.eslogan) setEslogan(v.eslogan);
              if (v.esloganSecundario && !localOverride?.institucional?.esloganSecundario)
                setEsloganSecundario(v.esloganSecundario);
            }
            if (row.clave === "becas" && v) {
              if (v.porcentaje && !localOverride?.becas?.porcentaje)
                setPorcentajeBeca(v.porcentaje);
              if (v.titulo && !localOverride?.becas?.titulo) setTituloBecas(v.titulo);
              if (v.intro && !localOverride?.becas?.intro) setIntroBecas(v.intro);
              if (v.aclaracion && !localOverride?.becas?.aclaracion)
                setAclaracionBecas(v.aclaracion);
              if (v.beneficios && !localOverride?.becas?.beneficios) setBeneficios(v.beneficios);
            }
          });
        }
      } catch (err) {
        console.warn("Error cargando configuración:", err);
      }
    }

    loadConfig();
  }, [isConfigured]);

  const handleAddTelefono = () => {
    setTelefonos((prev) => [...prev, ""]);
  };

  const handleRemoveTelefono = (index: number) => {
    setTelefonos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTelefono = (index: number, val: string) => {
    const updated = [...telefonos];
    updated[index] = val;
    setTelefonos(updated);
  };

  const handleAddBeneficio = () => {
    setBeneficios((prev) => [...prev, ""]);
  };

  const handleRemoveBeneficio = (index: number) => {
    setBeneficios((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateBeneficio = (index: number, val: string) => {
    const updated = [...beneficios];
    updated[index] = val;
    setBeneficios(updated);
  };

  const handleSave = async () => {
    setSaving(true);

    const configContacto = {
      telefonos: telefonos.filter((t) => t.trim().length > 0),
      correo: sanitizeDomain(correo),
      instagram,
      instagramUrl,
      direccionPrincipal,
      ciudadPrincipal,
      formularioInscripcion,
      horario,
    };

    const configInstitucional = {
      nombre,
      sigla,
      nit,
      eslogan,
      esloganSecundario,
    };

    const configBecas = {
      porcentaje: porcentajeBeca,
      titulo: tituloBecas,
      intro: introBecas,
      aclaracion: aclaracionBecas,
      beneficios: beneficios.filter((b) => b.trim().length > 0),
    };

    // Guardar inmediatamente en capa local resiliente para que nunca desaparezca
    saveLocalSiteSettingsOverride({
      contacto: configContacto,
      institucional: configInstitucional,
      becas: configBecas,
    });

    if (isConfigured) {
      try {
        await Promise.all([
          supabase.from("configuracion").upsert({ clave: "contacto", valor: configContacto }),
          supabase
            .from("configuracion")
            .upsert({ clave: "institucional", valor: configInstitucional }),
          supabase.from("configuracion").upsert({ clave: "becas", valor: configBecas }),
        ]);
        await refreshSettings();
        toast.success("¡Configuración guardada y sincronizada en toda la web!");
      } catch (err) {
        console.error("Error guardando configuración:", err);
        await refreshSettings();
        toast.success("¡Configuración guardada localmente!");
      }
    } else {
      await refreshSettings();
      toast.success("¡Configuración guardada localmente!");
    }

    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AdminLayout
      title="Datos Institucionales y Configuración"
      subtitle="Actualiza los canales de contacto oficiales, enlaces de redes, sedes y datos institucionales."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Configuración Centralizada</h2>
          <p className="text-xs text-muted-foreground">
            Los cambios se reflejarán en la cabecera, pie de página, sección de contacto y
            recorridos de inscripción.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !isAdmin}
          className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground min-w-[150px]"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Guardando...
            </>
          ) : savedSuccess ? (
            <>
              <Check className="size-4 mr-2" /> ¡Cambios guardados!
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" /> Guardar Cambios
            </>
          )}
        </Button>
      </div>

      {!isAdmin && (
        <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300">
          Nota: Estás conectado con rol de Editor. Solo los Administradores tienen permisos para
          modificar la configuración institucional.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="contacto">Contacto & Canales</TabsTrigger>
          <TabsTrigger value="institucional">Institucional</TabsTrigger>
          <TabsTrigger value="becas">Becas & Apoyos</TabsTrigger>
        </TabsList>

        {/* TAB 1: CONTACTO */}
        <TabsContent value="contacto" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
            <h3 className="font-semibold text-base text-foreground">
              Líneas de Atención y Canales Digitales
            </h3>

            {/* Teléfonos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Líneas telefónicas de atención</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTelefono}
                  disabled={!isAdmin}
                >
                  <Plus className="size-3.5 mr-1" /> Añadir teléfono
                </Button>
              </div>
              <div className="space-y-2">
                {telefonos.map((tel, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Phone className="size-4 text-brand-green shrink-0 ml-1" />
                    <Input
                      value={tel}
                      onChange={(e) => handleUpdateTelefono(idx, e.target.value)}
                      placeholder="Ej. +57 313 577 9384"
                      disabled={!isAdmin}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTelefono(idx)}
                      disabled={!isAdmin || telefonos.length <= 1}
                      className="text-muted-foreground hover:text-destructive shrink-0 size-9"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico oficial</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={!isAdmin}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horario de atención</Label>
                <Input
                  id="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Usuario de Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    disabled={!isAdmin}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">URL de Instagram</Label>
                <Input
                  id="instagramUrl"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formInscripcion">
                Enlace al formulario de Google Forms (Inscripción)
              </Label>
              <Input
                id="formInscripcion"
                value={formularioInscripcion}
                onChange={(e) => setFormularioInscripcion(e.target.value)}
                disabled={!isAdmin}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Botón externo de respaldo en la navegación y pie de página.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección Sede Principal (Cali)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="direccion"
                    value={direccionPrincipal}
                    onChange={(e) => setDireccionPrincipal(e.target.value)}
                    disabled={!isAdmin}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad Principal</Label>
                <Input
                  id="ciudad"
                  value={ciudadPrincipal}
                  onChange={(e) => setCiudadPrincipal(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: INSTITUCIONAL */}
        <TabsContent value="institucional" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Identidad Legal y Eslóganes</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nombreInst">Nombre institucional</Label>
                <Input
                  id="nombreInst"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siglaInst">Sigla</Label>
                <Input
                  id="siglaInst"
                  value={sigla}
                  onChange={(e) => setSigla(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nitInst">NIT / Identificación Tributaria</Label>
              <Input
                id="nitInst"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                disabled={!isAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="esloganInst">Eslógan Principal</Label>
              <Input
                id="esloganInst"
                value={eslogan}
                onChange={(e) => setEslogan(e.target.value)}
                disabled={!isAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="esloganSec">Eslógan Secundario</Label>
              <Input
                id="esloganSec"
                value={esloganSecundario}
                onChange={(e) => setEsloganSecundario(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: BECAS */}
        <TabsContent value="becas" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">
              Parámetros del Programa de Becas
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pctBeca">Porcentaje de Cobertura</Label>
                <Input
                  id="pctBeca"
                  value={porcentajeBeca}
                  onChange={(e) => setPorcentajeBeca(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="Ej. Becas de hasta el 90 %"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tituloBeca">Título de la Convocatoria</Label>
                <Input
                  id="tituloBeca"
                  value={tituloBecas}
                  onChange={(e) => setTituloBecas(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introBeca">Texto Introductorio</Label>
              <Textarea
                id="introBeca"
                value={introBecas}
                onChange={(e) => setIntroBecas(e.target.value)}
                disabled={!isAdmin}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aclaracionBeca">Aclaración Normativa</Label>
              <Input
                id="aclaracionBeca"
                value={aclaracionBecas}
                onChange={(e) => setAclaracionBecas(e.target.value)}
                disabled={!isAdmin}
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Beneficios Clave del Programa</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBeneficio}
                  disabled={!isAdmin}
                >
                  <Plus className="size-3.5 mr-1" /> Añadir beneficio
                </Button>
              </div>

              <div className="space-y-2">
                {beneficios.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-brand-gold shrink-0 ml-1" />
                    <Input
                      value={b}
                      onChange={(e) => handleUpdateBeneficio(idx, e.target.value)}
                      disabled={!isAdmin}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBeneficio(idx)}
                      disabled={!isAdmin || beneficios.length <= 1}
                      className="text-muted-foreground hover:text-destructive shrink-0 size-9"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
