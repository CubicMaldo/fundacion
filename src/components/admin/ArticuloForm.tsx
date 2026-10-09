import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Loader2,
  MessageCircle,
  Phone,
  Mail,
  GraduationCap,
  Wand2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { org, telefonoPrincipal } from "@/data/funasf";
import {
  parseContactoDeContenido,
  serializeContactoEnContenido,
  type InfoContactoPost,
} from "@/services/api";
import { ImageUploader } from "./ImageUploader";
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

  // Parsear posible contacto embebido en el contenido existente
  const parsedFromContent = initialData?.contenido
    ? parseContactoDeContenido(initialData.contenido)
    : null;
  const initialContacto = initialData?.contactoDirecto || parsedFromContent?.contacto || null;
  const initialContenidoLimpio =
    parsedFromContent?.contenidoLimpio ?? (initialData?.contenido || "");

  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [resumen, setResumen] = useState(initialData?.resumen || "");
  const [contenido, setContenido] = useState(initialContenidoLimpio);
  const [categoria, setCategoria] = useState(initialData?.categoria || "Convocatorias");
  const [autorNombre, setAutorNombre] = useState(
    initialData?.autorNombre || profile?.nombre_completo || "Comunidad FUNASF",
  );
  const [imagenPortada, setImagenPortada] = useState(initialData?.imagenPortada || "");
  const [publicado, setPublicado] = useState(initialData?.estado === "publicado");

  // Estado de Contacto Directo
  const [contactoActivo, setContactoActivo] = useState(
    initialContacto ? initialContacto.activo !== false : true,
  );
  const [contactoTitulo, setContactoTitulo] = useState(initialContacto?.titulo || "");
  const [contactoDescripcion, setContactoDescripcion] = useState(
    initialContacto?.descripcion || "",
  );
  const [contactoWhatsapp, setContactoWhatsapp] = useState(
    initialContacto?.whatsapp || telefonoPrincipal,
  );
  const [contactoMensajeWa, setContactoMensajeWa] = useState(
    initialContacto?.mensajeWhatsapp || "",
  );
  const [contactoTelefono, setContactoTelefono] = useState(
    initialContacto?.telefono || telefonoPrincipal,
  );
  const [contactoCorreo, setContactoCorreo] = useState(initialContacto?.correo || org.correo);
  const [contactoEnlace, setContactoEnlace] = useState(
    initialContacto?.enlacePostulacion || org.formularioInscripcion,
  );

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

  const handleAutoGenerarMensajeWa = () => {
    const postNombre = titulo.trim() || "esta publicación";
    setContactoMensajeWa(
      `Hola FUNASF, deseo recibir más información y orientación sobre: "${postNombre}".`,
    );
  };

  const handleCargarContactosOficiales = () => {
    setContactoWhatsapp(telefonoPrincipal);
    setContactoTelefono(telefonoPrincipal);
    setContactoCorreo(org.correo);
    setContactoEnlace(org.formularioInscripcion);
    handleAutoGenerarMensajeWa();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const infoContacto: InfoContactoPost = {
      activo: contactoActivo,
      titulo: contactoTitulo.trim() || undefined,
      descripcion: contactoDescripcion.trim() || undefined,
      whatsapp: contactoWhatsapp.trim() || undefined,
      mensajeWhatsapp: contactoMensajeWa.trim() || undefined,
      telefono: contactoTelefono.trim() || undefined,
      correo: contactoCorreo.trim() || undefined,
      enlacePostulacion: contactoEnlace.trim() || undefined,
    };

    const contenidoConContacto = serializeContactoEnContenido(contenido, infoContacto);

    const payload = {
      titulo,
      slug,
      resumen,
      contenido: contenidoConContacto,
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

          {/* Bloque de Contacto Directo */}
          <div className="rounded-xl border-2 border-brand-green/20 bg-card p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
                  <MessageCircle className="size-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                    Contacto Directo en este Post
                    <span className="text-xs font-normal text-muted-foreground">
                      (WhatsApp, Teléfono, Correo)
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Permite a los lectores comunicarse o postularse en 1 clic directamente desde el
                    artículo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Label htmlFor="art-contacto-activo" className="text-xs font-medium cursor-pointer">
                  {contactoActivo ? "Habilitado" : "Desactivado"}
                </Label>
                <Switch
                  id="art-contacto-activo"
                  checked={contactoActivo}
                  onCheckedChange={setContactoActivo}
                />
              </div>
            </div>

            {contactoActivo && (
              <div className="space-y-5 pt-1">
                {/* Botones de ayuda rápida */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 p-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="size-3.5 text-brand-green" />
                    Líneas oficiales FUNASF disponibles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {org.telefonos.map((tel, idx) => (
                      <button
                        key={tel}
                        type="button"
                        onClick={() => {
                          setContactoWhatsapp(tel);
                          setContactoTelefono(tel);
                        }}
                        className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-mono hover:border-brand-green hover:text-brand-green transition-colors"
                        title={`Usar línea ${idx + 1}`}
                      >
                        Línea {idx + 1}: {tel}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleCargarContactosOficiales}
                      className="rounded-md bg-brand-green/10 text-brand-green px-2 py-1 text-[11px] font-semibold hover:bg-brand-green/20 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="size-3" /> Restaurar todo
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="art-wa"
                      className="flex items-center gap-1.5 font-medium text-foreground"
                    >
                      <MessageCircle className="size-3.5 text-[#25D366] fill-current" />
                      Número de WhatsApp Directo *
                    </Label>
                    <Input
                      id="art-wa"
                      value={contactoWhatsapp}
                      onChange={(e) => setContactoWhatsapp(e.target.value)}
                      placeholder="+57 313 577 9384"
                      className="font-mono text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Con código de país (+57). Puede ser una línea de admisiones o la principal.
                    </p>
                  </div>

                  {/* Teléfono de llamada */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="art-tel"
                      className="flex items-center gap-1.5 font-medium text-foreground"
                    >
                      <Phone className="size-3.5 text-brand-green" />
                      Línea Telefónica para Llamadas
                    </Label>
                    <Input
                      id="art-tel"
                      value={contactoTelefono}
                      onChange={(e) => setContactoTelefono(e.target.value)}
                      placeholder="+57 313 577 9384"
                      className="font-mono text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Permite iniciar llamada telefónica en 1 toque.
                    </p>
                  </div>

                  {/* Correo */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="art-correo"
                      className="flex items-center gap-1.5 font-medium text-foreground"
                    >
                      <Mail className="size-3.5 text-brand-brown" />
                      Correo Electrónico de Atención
                    </Label>
                    <Input
                      id="art-correo"
                      type="email"
                      value={contactoCorreo}
                      onChange={(e) => setContactoCorreo(e.target.value)}
                      placeholder="info@edufunasf.org"
                      className="text-sm"
                    />
                  </div>

                  {/* Enlace Postulación / Inscripción */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="art-enlace"
                      className="flex items-center gap-1.5 font-medium text-foreground"
                    >
                      <GraduationCap className="size-3.5 text-brand-green" />
                      Enlace de Postulación / Inscripción (Opcional)
                    </Label>
                    <Input
                      id="art-enlace"
                      value={contactoEnlace}
                      onChange={(e) => setContactoEnlace(e.target.value)}
                      placeholder="https://forms.gle/..."
                      className="text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Mensaje predeterminado de WhatsApp */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="art-wa-msg" className="font-medium text-foreground text-xs">
                      Mensaje inicial sugerido para WhatsApp
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAutoGenerarMensajeWa}
                      className="h-7 text-[11px] text-brand-green hover:text-brand-green-deep p-1 gap-1"
                    >
                      <Wand2 className="size-3" /> Auto-completar con título
                    </Button>
                  </div>
                  <Textarea
                    id="art-wa-msg"
                    value={contactoMensajeWa}
                    onChange={(e) => setContactoMensajeWa(e.target.value)}
                    placeholder="Hola FUNASF, leí la publicación y deseo recibir más información..."
                    rows={2}
                    className="text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Aparecerá escrito automáticamente cuando el usuario abra WhatsApp para que solo
                    deba presionar Enviar.
                  </p>
                </div>

                {/* Título y descripción personalizados del bloque (Opcionales) */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="art-cta-titulo" className="text-xs font-medium text-foreground">
                      Título personalizado del bloque (Opcional)
                    </Label>
                    <Input
                      id="art-cta-titulo"
                      value={contactoTitulo}
                      onChange={(e) => setContactoTitulo(e.target.value)}
                      placeholder="Ej. ¿Deseas postularte a esta beca?"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="art-cta-desc" className="text-xs font-medium text-foreground">
                      Descripción o instrucción personalizada (Opcional)
                    </Label>
                    <Input
                      id="art-cta-desc"
                      value={contactoDescripcion}
                      onChange={(e) => setContactoDescripcion(e.target.value)}
                      placeholder="Ej. Escríbenos para asegurar tu cupo antes del cierre."
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
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

            <div className="pt-2">
              <ImageUploader
                value={imagenPortada}
                onChange={setImagenPortada}
                bucket="articulos"
                label="Imagen de Portada"
                helperText="Sube una fotografía destacada para el artículo o pega una URL directa."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
