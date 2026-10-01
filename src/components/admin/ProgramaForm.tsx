import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus, Trash2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { ProgramaAdminItem } from "@/routes/admin/programas/index";

const CATEGORIAS_PREDEFINIDAS = [
  { id: "salud", label: "Área de salud" },
  { id: "sst", label: "Seguridad y Salud en el Trabajo" },
  { id: "administracion", label: "Administración y empresa" },
  { id: "educacion-social", label: "Educación y área social" },
  { id: "otras", label: "Otras áreas de formación" },
  { id: "basica", label: "Educación básica" },
];

const MODALIDADES_DISPONIBLES = ["Presencial", "Semipresencial", "Virtual"];

interface ProgramaFormProps {
  initialData?: Partial<ProgramaAdminItem>;
  isEdit?: boolean;
}

export function ProgramaForm({ initialData, isEdit }: ProgramaFormProps) {
  const navigate = useNavigate();
  const { isConfigured } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoriaId, setCategoriaId] = useState(initialData?.categoriaId || "salud");
  const [categoria, setCategoria] = useState(
    initialData?.categoria || CATEGORIAS_PREDEFINIDAS.find((c) => c.id === "salud")?.label || ""
  );
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [objetivo, setObjetivo] = useState(initialData?.objetivo || "");
  const [duracionEstimada, setDuracionEstimada] = useState(initialData?.duracionEstimada || "");
  const [certificacionNota, setCertificacionNota] = useState(initialData?.certificacionNota || "");
  const [orden, setOrden] = useState(initialData?.orden ?? 1);
  const [activo, setActivo] = useState(initialData?.activo ?? true);

  const [modalidades, setModalidades] = useState<string[]>(
    initialData?.modalidades || ["Presencial", "Semipresencial"]
  );

  const [perfilOcupacional, setPerfilOcupacional] = useState<string[]>(
    initialData?.perfilOcupacional && initialData.perfilOcupacional.length > 0
      ? initialData.perfilOcupacional
      : [""]
  );

  const [requisitos, setRequisitos] = useState<string[]>(
    initialData?.requisitos && initialData.requisitos.length > 0
      ? initialData.requisitos
      : ["Documento de identidad vigente", "Certificado de noveno grado o diploma de bachiller"]
  );

  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (!isEdit || !slug) {
      const autoSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleCategoriaSelect = (catId: string) => {
    setCategoriaId(catId);
    const found = CATEGORIAS_PREDEFINIDAS.find((c) => c.id === catId);
    if (found) setCategoria(found.label);
  };

  const toggleModalidad = (mod: string) => {
    setModalidades((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  // Manejo de arrays dinámicos
  const handleArrayItemChange = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    val: string
  ) => {
    const updated = [...list];
    updated[index] = val;
    setList(updated);
  };

  const addArrayItem = (setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList((prev) => [...prev, ""]);
  };

  const removeArrayItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    if (list.length <= 1) {
      setList([""]);
      return;
    }
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      nombre,
      slug,
      categoria_id: categoriaId,
      categoria,
      descripcion,
      objetivo,
      duracion_estimada: duracionEstimada || null,
      certificacion_nota: certificacionNota || null,
      modalidades,
      perfil_ocupacional: perfilOcupacional.filter((item) => item.trim().length > 0),
      requisitos: requisitos.filter((item) => item.trim().length > 0),
      orden: Number(orden),
      activo,
    };

    if (isConfigured) {
      try {
        if (isEdit && initialData?.id && !initialData.id.startsWith("local-")) {
          await supabase.from("programas").update(payload).eq("id", initialData.id);
        } else {
          await supabase.from("programas").upsert(payload, { onConflict: "slug" });
        }
      } catch (err) {
        console.error("Error guardando programa en Supabase:", err);
      }
    }

    setSaving(false);
    setSuccessNotice(true);
    setTimeout(() => {
      navigate({ to: "/admin/programas" });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Barra de cabecera con navegación y botón guardar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/programas">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit ? `Editar: ${nombre || "Programa"}` : "Nuevo Programa Académico"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Define los contenidos informativos oficiales y condiciones de postulación.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/programas">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving || !nombre || !slug}
            className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground min-w-[130px]"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Guardando...
              </>
            ) : successNotice ? (
              <>
                <Check className="size-4 mr-2" /> ¡Guardado!
              </>
            ) : (
              "Guardar Programa"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Columna Izquierda: Información General (2 columnas) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tarjeta Datos Básicos */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Datos Básicos</h3>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre oficial del programa *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => handleNombreChange(e.target.value)}
                placeholder="Ej. Auxiliar de Enfermería"
                required
                className="h-10 text-base"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Identificador URL (Slug) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej. auxiliar-de-enfermeria"
                  required
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoriaId">Área de Formación</Label>
                <select
                  id="categoriaId"
                  value={categoriaId}
                  onChange={(e) => handleCategoriaSelect(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                >
                  {CATEGORIAS_PREDEFINIDAS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción institucional *</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Resumen del enfoque y formación que ofrece el programa..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo del programa *</Label>
              <Textarea
                id="objetivo"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
                placeholder="Competencias que adquirirá el estudiante..."
                required
              />
            </div>
          </div>

          {/* Tarjeta Perfil Ocupacional */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-foreground">Perfil Ocupacional</h3>
                <p className="text-xs text-muted-foreground">Campos laborales donde podrá desempeñarse el egresado.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(setPerfilOcupacional)}
              >
                <Plus className="size-3.5 mr-1" /> Añadir campo
              </Button>
            </div>

            <div className="space-y-2.5">
              {perfilOcupacional.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-gold shrink-0 ml-1" />
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayItemChange(perfilOcupacional, setPerfilOcupacional, index, e.target.value)
                    }
                    placeholder="Ej. Clínicas, hospitales y centros de atención básica"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem(perfilOcupacional, setPerfilOcupacional, index)}
                    className="text-muted-foreground hover:text-destructive shrink-0 size-9"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta Requisitos */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-foreground">Requisitos de Ingreso</h3>
                <p className="text-xs text-muted-foreground">Documentos o condiciones solicitadas para la inscripción.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(setRequisitos)}
              >
                <Plus className="size-3.5 mr-1" /> Añadir requisito
              </Button>
            </div>

            <div className="space-y-2.5">
              {requisitos.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-brown shrink-0 ml-1" />
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayItemChange(requisitos, setRequisitos, index, e.target.value)
                    }
                    placeholder="Ej. Documento de identidad vigente"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem(requisitos, setRequisitos, index)}
                    className="text-muted-foreground hover:text-destructive shrink-0 size-9"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Configuración Lateral (1 columna) */}
        <div className="space-y-6">
          {/* Publicación & Estado */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h3 className="font-semibold text-base text-foreground">Estado y Publicación</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activo" className="font-medium">Programa Activo</Label>
                <p className="text-xs text-muted-foreground">Visible en el catálogo y página de inicio</p>
              </div>
              <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="orden">Orden en el catálogo</Label>
              <Input
                id="orden"
                type="number"
                min={1}
                value={orden}
                onChange={(e) => setOrden(Number(e.target.value))}
                className="h-10"
              />
              <p className="text-[11px] text-muted-foreground">Determina la posición en la lista (1 = primero).</p>
            </div>
          </div>

          {/* Modalidades */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Modalidades Disponibles</h3>
            <p className="text-xs text-muted-foreground">Selecciona las modalidades aplicables para este programa.</p>

            <div className="space-y-2.5">
              {MODALIDADES_DISPONIBLES.map((mod) => {
                const checked = modalidades.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModalidad(mod)}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                      checked
                        ? "border-brand-green bg-brand-green/10 text-brand-green-deep font-medium"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{mod}</span>
                    {checked && <Check className="size-4 text-brand-green" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duración y Certificación */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Condiciones Académicas</h3>

            <div className="space-y-2">
              <Label htmlFor="duracion">Duración estimada</Label>
              <Input
                id="duracion"
                value={duracionEstimada}
                onChange={(e) => setDuracionEstimada(e.target.value)}
                placeholder="Ej. Sujeta al plan de estudios..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificacion">Nota de certificación</Label>
              <Input
                id="certificacion"
                value={certificacionNota}
                onChange={(e) => setCertificacionNota(e.target.value)}
                placeholder="Ej. Certificado emitido por institución aliada..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
