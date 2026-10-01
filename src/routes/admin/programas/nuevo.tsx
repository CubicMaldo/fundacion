import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProgramaForm } from "@/components/admin/ProgramaForm";

export const Route = createFileRoute("/admin/programas/nuevo")({
  head: () => ({
    meta: [{ title: "Nuevo Programa Académico | FUNASF Admin" }],
  }),
  component: NuevoProgramaPage,
});

function NuevoProgramaPage() {
  return (
    <AdminLayout
      title="Crear Nuevo Programa"
      subtitle="Añade un nuevo programa formativo oficial al catálogo de FUNASF."
    >
      <div className="py-2">
        <ProgramaForm isEdit={false} />
      </div>
    </AdminLayout>
  );
}
