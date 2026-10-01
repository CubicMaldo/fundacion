import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProgramaForm } from "@/components/admin/ProgramaForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { programasAcademicos, type ProgramaAcademico } from "@/data/programas";
import type { ProgramaAdminItem } from "./index";

export const Route = createFileRoute("/admin/programas/$id")({
  head: () => ({
    meta: [{ title: "Editar Programa | FUNASF Admin" }],
  }),
  component: EditarProgramaPage,
});

function EditarProgramaPage() {
  const { id } = Route.useParams();
  const { isConfigured } = useAuth();
  const [programa, setPrograma] = useState<ProgramaAdminItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograma() {
      if (!isConfigured) {
        // Buscar en datos locales por id o por slug
        const local = programasAcademicos.find((p) => p.slug === id) || programasAcademicos[0];
        if (local) {
          setPrograma({ ...local, id: `local-${local.slug}`, activo: true, orden: 1 });
        }
        setLoading(false);
        return;
      }

      try {
        // Buscar por id UUID o por slug
        let query = supabase.from("programas").select("*");
        if (id.includes("-") && id.length > 30) {
          query = query.eq("id", id);
        } else {
          query = query.eq("slug", id);
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
          // Fallback a array local
          const fallback = programasAcademicos.find((p) => p.slug === id);
          if (fallback) {
            setPrograma({ ...fallback, id: `local-${fallback.slug}`, activo: true, orden: 1 });
          }
        } else {
          setPrograma({
            id: data.id,
            slug: data.slug,
            nombre: data.nombre,
            categoria: data.categoria,
            categoriaId: data.categoria_id,
            descripcion: data.descripcion,
            objetivo: data.objetivo,
            modalidades: data.modalidades || [],
            perfilOcupacional: data.perfil_ocupacional || [],
            requisitos: data.requisitos || [],
            certificacionNota: data.certificacion_nota || undefined,
            duracionEstimada: data.duracion_estimada || undefined,
            activo: data.activo,
            orden: data.orden,
          });
        }
      } catch (err) {
        console.warn("Error cargando programa para editar:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrograma();
  }, [id, isConfigured]);

  if (loading) {
    return (
      <AdminLayout title="Editar Programa">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand-green" />
        </div>
      </AdminLayout>
    );
  }

  if (!programa) {
    return (
      <AdminLayout title="Programa no encontrado">
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <h2 className="text-xl font-bold text-foreground">El programa solicitado no existe</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifica el identificador o regresa al listado general de programas.
          </p>
          <Button asChild className="mt-6">
            <Link to="/admin/programas">
              <ArrowLeft className="size-4 mr-2" />
              Volver a programas
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar: ${programa.nombre}`}
      subtitle={`Slug: /programas/${programa.slug}`}
    >
      <div className="py-2">
        <ProgramaForm initialData={programa} isEdit={true} />
      </div>
    </AdminLayout>
  );
}
