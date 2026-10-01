import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticuloForm } from "@/components/admin/ArticuloForm";

export const Route = createFileRoute("/admin/blog/nuevo")({
  head: () => ({
    meta: [{ title: "Nuevo Artículo | FUNASF Admin" }],
  }),
  component: NuevoArticuloPage,
});

function NuevoArticuloPage() {
  return (
    <AdminLayout
      title="Nuevo Artículo de Blog"
      subtitle="Redacta y publica noticias o contenidos para la comunidad."
    >
      <div className="py-2">
        <ArticuloForm isEdit={false} />
      </div>
    </AdminLayout>
  );
}
