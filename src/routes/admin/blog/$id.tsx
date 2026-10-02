import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticuloForm } from "@/components/admin/ArticuloForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getArticuloBySlug, parseContactoDeContenido, type InfoContactoPost } from "@/services/api";
import type { ArticuloAdminItem } from "./index";

export const Route = createFileRoute("/admin/blog/$id")({
  head: () => ({
    meta: [{ title: "Editar Artículo | FUNASF Admin" }],
  }),
  component: EditarArticuloPage,
});

function EditarArticuloPage() {
  const { id } = Route.useParams();
  const { isConfigured } = useAuth();
  const [articulo, setArticulo] = useState<ArticuloAdminItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticulo() {
      if (!isConfigured) {
        const fallback = await getArticuloBySlug(id);
        if (fallback) {
          setArticulo({ ...fallback, estado: "publicado" });
        }
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from("articulos").select("*");
        if (id.includes("-") && id.length > 30) {
          query = query.eq("id", id);
        } else {
          query = query.eq("slug", id);
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
          const fallback = await getArticuloBySlug(id);
          if (fallback) {
            setArticulo({ ...fallback, estado: "publicado" });
          }
        } else {
          const { contenidoLimpio, contacto } = parseContactoDeContenido(data.contenido);
          setArticulo({
            id: data.id,
            slug: data.slug,
            titulo: data.titulo,
            resumen: data.resumen,
            contenido: contenidoLimpio,
            autorNombre: data.autor_nombre,
            categoria: data.categoria,
            imagenPortada: data.imagen_portada,
            estado: (data.estado as "borrador" | "publicado") || "borrador",
            fechaPublicacion: data.fecha_publicacion || data.created_at,
            contactoDirecto:
              ("contacto_directo" in data ? (data.contacto_directo as InfoContactoPost) : null) ||
              contacto ||
              null,
          });
        }
      } catch (err) {
        console.warn("Error cargando artículo:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticulo();
  }, [id, isConfigured]);

  if (loading) {
    return (
      <AdminLayout title="Editar Artículo">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand-green" />
        </div>
      </AdminLayout>
    );
  }

  if (!articulo) {
    return (
      <AdminLayout title="Artículo no encontrado">
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <h2 className="text-xl font-bold text-foreground">El artículo solicitado no existe</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifica el identificador o regresa al listado general del blog.
          </p>
          <Button asChild className="mt-6">
            <Link to="/admin/blog">
              <ArrowLeft className="size-4 mr-2" />
              Volver al blog
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editar: ${articulo.titulo}`} subtitle={`Slug: /blog/${articulo.slug}`}>
      <div className="py-2">
        <ArticuloForm initialData={articulo} isEdit={true} />
      </div>
    </AdminLayout>
  );
}
