import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { ArticuloAdminItem } from "@/routes/admin/blog/index";

const CATEGORIAS_BLOG = [
  "Convocatorias",
  "Comunidad",
  "Educación",
  "Salud",
  "Emprendimiento",
  "Institucional",
];

interface ArticuloFormProps {
  initialData?: Partial<ArticuloAdminItem>;
  isEdit?: boolean;
}

export function ArticuloForm({ initialData, isEdit }: ArticuloFormProps) {
  const navigate = useNavigate();
  const { profile, isConfigured } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [resumen, setResumen] = useState(initialData?.resumen || "");
  const [contenido, setContenido] = useState(initialData?.contenido || "");
  const [categoria, setCategoria] = useState(initialData?.categoria || "Convocatorias");
  const [autorNombre, setAutorNombre] = useState(
    initialData?.autorNombre || profile?.nombre_completo || "Comunidad FUNASF",
  );
  const [imagenPortada, setImagenPortada] = useState(initialData?.imagenPortada || "");
  const [publicado, setPublicado] = useState(initialData?.estado === "publicado");

  const handleTituloChange = (val: string) => {
    setTitulo(val);
    if (!isEdit || !slug) {
      const auto = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(auto);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      titulo,
      slug,
      resumen,
      contenido,
      categoria,
      autor_nombre: autorNombre,
      imagen_portada: imagenPortada || null,
      estado: (publicado ? "publicado" : "borrador") as "borrador" | "publicado",
      fecha_publicacion: publicado ? new Date().toISOString() : null,
    };

    if (isConfigured) {
      try {
        if (isEdit && initialData?.id && !initialData.id.startsWith("art-")) {
          await supabase.from("articulos").update(payload).eq("id", initialData.id);
        } else {
          await supabase.from("articulos").upsert(payload, { onConflict: "slug" });
        }
      } catch (err) {
        console.error("Error guardando artículo en Supabase:", err);
      }
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      navigate({ to: "/admin/blog" });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/blog">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit ? `Editar: ${titulo || "Artículo"}` : "Nuevo Artículo de Blog"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Publica historias, noticias y contenidos para la comunidad educativa de FUNASF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/blog">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving || !titulo || !slug}
            className="bg-brand-green hover:bg-brand-green-deep text-primary-foreground min-w-[130px]"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Guardando...
              </>
            ) : success ? (
              <>
                <Check className="size-4 mr-2" /> ¡Guardado!
              </>
            ) : (
              "Guardar Artículo"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contenido Principal (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="space-y-2">
              <Label htmlFor="art-titulo">Título del artículo *</Label>
              <Input
                id="art-titulo"
                value={titulo}
                onChange={(e) => handleTituloChange(e.target.value)}
                placeholder="Ej. Apertura de la nueva convocatoria de becas"
                required
                className="text-lg font-medium h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="art-slug">Identificador URL (Slug) *</Label>
              <Input
                id="art-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ej. apertura-de-convocatoria-becas"
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="art-resumen">Resumen breve (Excerpt) *</Label>
              <Textarea
                id="art-resumen"
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                placeholder="Breve párrafo introductorio que aparecerá en la tarjeta del blog..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="art-contenido">Cuerpo del artículo (Texto o Markdown) *</Label>
              <Textarea
                id="art-contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe aquí el contenido completo del artículo. Puedes usar párrafos y subtítulos..."
                rows={12}
                required
                className="font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Parámetros de Publicación (1 col) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground">Estado de Publicación</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="art-publicado" className="font-medium">
                  Publicar en el sitio
                </Label>
                <p className="text-xs text-muted-foreground">
                  Si está desactivado se guardará como borrador.
                </p>
              </div>
              <Switch id="art-publicado" checked={publicado} onCheckedChange={setPublicado} />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="art-cat">Categoría</Label>
              <select
                id="art-cat"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
              >
                {CATEGORIAS_BLOG.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="art-autor">Firma / Autor</Label>
              <Input
                id="art-autor"
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                placeholder="Ej. Dirección Académica FUNASF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="art-img">URL de Imagen de Portada</Label>
              <Input
                id="art-img"
                value={imagenPortada}
                onChange={(e) => setImagenPortada(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              {imagenPortada && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border aspect-video">
                  <img
                    src={imagenPortada}
                    alt="Vista previa"
                    className="size-full object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
