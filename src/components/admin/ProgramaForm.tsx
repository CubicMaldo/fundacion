import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Plus, Trash2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { ProgramaAdminItem } from "@/routes/admin/programas/index";

const CATEGORIAS_PREDEFINIDAS = [
  { id: "salud", label: "Área de salud" },
  { id: "administracion", label: "Administración y empresa" },
  { id: "sst", label: "Seguridad y Salud en el Trabajo" },
  { id: "educacion-social", label: "Educación y área social" },
  { id: "basica", label: "Educación básica" },
  { id: "otras", label: "Otras áreas de formación" },
];

const MODALIDADES_DISPONIBLES = ["Presencial", "Semipresencial", "Virtual"];

const ProgramaFormSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  categoriaId: z.string().min(1, "Selecciona un área de formación"),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  imagenUrl: z.string().optional(),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  objetivo: z.string().min(10, "El objetivo debe tener al menos 10 caracteres"),
  duracionEstimada: z.string().optional(),
  certificacionNota: z.string().optional(),
  orden: z.coerce.number().min(1, "El orden debe ser al menos 1"),
  activo: z.boolean(),
  modalidades: z.array(z.string()).min(1, "Selecciona al menos una modalidad"),
  perfilOcupacional: z.array(z.object({ value: z.string() })),
  requisitos: z.array(z.object({ value: z.string() })),
});

type ProgramaFormValues = z.infer<typeof ProgramaFormSchema>;

interface ProgramaFormProps {
  initialData?: Partial<ProgramaAdminItem>;
  isEdit?: boolean;
}

export function ProgramaForm({ initialData, isEdit }: ProgramaFormProps) {
  const navigate = useNavigate();
  const { isConfigured } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const defaultValues: ProgramaFormValues = {
    nombre: initialData?.nombre || "",
    slug: initialData?.slug || "",
    categoriaId: initialData?.categoriaId || "salud",
    categoria:
      initialData?.categoria ||
      CATEGORIAS_PREDEFINIDAS.find((c) => c.id === "salud")?.label ||
      "Área de salud",
    descripcion: initialData?.descripcion || "",
    objetivo: initialData?.objetivo || "",
    duracionEstimada: initialData?.duracionEstimada || "",
    certificacionNota: initialData?.certificacionNota || "",
    orden: initialData?.orden ?? 1,
    activo: initialData?.activo ?? true,
    modalidades: initialData?.modalidades || ["Presencial", "Semipresencial"],
    perfilOcupacional:
      initialData?.perfilOcupacional && initialData.perfilOcupacional.length > 0
        ? initialData.perfilOcupacional.map((v) => ({ value: v }))
        : [{ value: "" }],
    requisitos:
      initialData?.requisitos && initialData.requisitos.length > 0
        ? initialData.requisitos.map((v) => ({ value: v }))
        : [
            { value: "Documento de identidad vigente" },
            { value: "Certificado de noveno grado o diploma de bachiller" },
          ],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProgramaFormValues>({
    resolver: zodResolver(ProgramaFormSchema),
    defaultValues,
  });

  const {
    fields: perfilFields,
    append: appendPerfil,
    remove: removePerfil,
  } = useFieldArray({
    control,
    name: "perfilOcupacional",
  });

  const {
    fields: requisitosFields,
    append: appendRequisito,
    remove: removeRequisito,
  } = useFieldArray({
    control,
    name: "requisitos",
  });

  const currentModalidades = watch("modalidades");
  const currentSlug = watch("slug");
  const currentNombre = watch("nombre");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("nombre", val, { shouldValidate: true });
    if (!isEdit || !currentSlug) {
      const autoSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", autoSlug, { shouldValidate: true });
    }
  };

  const handleCategoriaChange = (catId: string) => {
    setValue("categoriaId", catId);
    const found = CATEGORIAS_PREDEFINIDAS.find((c) => c.id === catId);
    if (found) {
      setValue("categoria", found.label);
    }
  };

  const toggleModalidad = (mod: string) => {
    const updated = currentModalidades.includes(mod)
      ? currentModalidades.filter((m) => m !== mod)
      : [...currentModalidades, mod];
    setValue("modalidades", updated, { shouldValidate: true });
  };

  const onSubmit = async (values: ProgramaFormValues) => {
    setSaving(true);

    const payload = {
      nombre: values.nombre,
      slug: values.slug,
      categoria_id: values.categoriaId,
      categoria: values.categoria,
      descripcion: values.descripcion,
      objetivo: values.objetivo,
      duracion_estimada: values.duracionEstimada || null,
      certificacion_nota: values.certificacionNota || null,
      modalidades: values.modalidades,
      perfil_ocupacional: values.perfilOcupacional
        .map((p) => p.value.trim())
        .filter((val) => val.length > 0),
      requisitos: values.requisitos.map((r) => r.value.trim()).filter((val) => val.length > 0),
      orden: values.orden,
      activo: values.activo,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              {isEdit ? `Editar: ${currentNombre || "Programa"}` : "Nuevo Programa Académico"}
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
            disabled={saving}
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
                {...register("nombre")}
                onChange={handleNombreChange}
                placeholder="Ej. Auxiliar de Enfermería"
                className="h-10 text-base"
              />
              {errors.nombre && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Identificador URL (Slug) *</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="ej. auxiliar-de-enfermeria"
                  className="font-mono text-sm"
                />
                {errors.slug && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoriaId">Área de Formación</Label>
                <select
                  id="categoriaId"
                  {...register("categoriaId")}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
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
                {...register("descripcion")}
                rows={3}
                placeholder="Resumen del enfoque y formación que ofrece el programa..."
              />
              {errors.descripcion && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.descripcion.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo del programa *</Label>
              <Textarea
                id="objetivo"
                {...register("objetivo")}
                rows={3}
                placeholder="Competencias que adquirirá el estudiante..."
              />
              {errors.objetivo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.objetivo.message}
                </p>
              )}
            </div>
          </div>

          {/* Tarjeta Perfil Ocupacional */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-foreground">Perfil Ocupacional</h3>
                <p className="text-xs text-muted-foreground">
                  Campos laborales donde podrá desempeñarse el egresado.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPerfil({ value: "" })}
              >
                <Plus className="size-3.5 mr-1" /> Añadir campo
              </Button>
            </div>

            <div className="space-y-2.5">
              {perfilFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-gold shrink-0 ml-1" />
                  <Input
                    {...register(`perfilOcupacional.${index}.value` as const)}
                    placeholder="Ej. Clínicas, hospitales y centros de atención básica"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (perfilFields.length > 1) removePerfil(index);
                    }}
                    disabled={perfilFields.length <= 1}
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
                <p className="text-xs text-muted-foreground">
                  Documentos o condiciones solicitadas para la inscripción.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendRequisito({ value: "" })}
              >
                <Plus className="size-3.5 mr-1" /> Añadir requisito
              </Button>
            </div>

            <div className="space-y-2.5">
              {requisitosFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-brown shrink-0 ml-1" />
                  <Input
                    {...register(`requisitos.${index}.value` as const)}
                    placeholder="Ej. Documento de identidad vigente"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (requisitosFields.length > 1) removeRequisito(index);
                    }}
                    disabled={requisitosFields.length <= 1}
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
                <Label htmlFor="activo" className="font-medium">
                  Programa Activo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Visible en el catálogo y página de inicio
                </p>
              </div>
              <Controller
                control={control}
                name="activo"
                render={({ field }) => (
                  <Switch id="activo" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="orden">Orden en el catálogo</Label>
              <Input id="orden" type="number" min={1} {...register("orden")} className="h-10" />
              <p className="text-[11px] text-muted-foreground">
                Determina la posición en la lista (1 = primero).
              </p>
            </div>
          </div>

          {/* Modalidades */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Modalidades Disponibles</h3>
            <p className="text-xs text-muted-foreground">
              Selecciona las modalidades aplicables para este programa.
            </p>

            <div className="space-y-2.5">
              {MODALIDADES_DISPONIBLES.map((mod) => {
                const checked = currentModalidades.includes(mod);
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
            {errors.modalidades && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.modalidades.message}
              </p>
            )}
          </div>

          {/* Duración y Certificación */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Condiciones Académicas</h3>

            <div className="space-y-2">
              <Label htmlFor="duracion">Duración estimada</Label>
              <Input
                id="duracion"
                {...register("duracionEstimada")}
                placeholder="Ej. Sujeta al plan de estudios..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificacion">Nota de certificación</Label>
              <Input
                id="certificacion"
                {...register("certificacionNota")}
                placeholder="Ej. Certificado emitido por institución aliada..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
