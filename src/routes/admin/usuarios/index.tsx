import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type UserProfile, type UserRole } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/usuarios/")({
  head: () => ({
    meta: [{ title: "Gestión de Usuarios y Roles | FUNASF Admin" }],
  }),
  component: AdminUsuariosPage,
});

const DEMO_USUARIOS: UserProfile[] = [
  {
    id: "user-1",
    email: "admin@funasf.org",
    nombre_completo: "Dirección Ejecutiva",
    rol: "admin",
    avatar_url: null,
  },
  {
    id: "user-2",
    email: "comunicaciones@funasf.org",
    nombre_completo: "Equipo de Comunicaciones",
    rol: "editor",
    avatar_url: null,
  },
  {
    id: "user-3",
    email: "admisiones@funasf.org",
    nombre_completo: "Coordinación Académica",
    rol: "editor",
    avatar_url: null,
  },
];

function AdminUsuariosPage() {
  const { isAdmin, isConfigured, user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsuarios() {
      if (!isConfigured) {
        setUsuarios(DEMO_USUARIOS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("perfiles")
          .select("*")
          .order("created_at", { ascending: true });

        if (error || !data || data.length === 0) {
          setUsuarios(DEMO_USUARIOS);
        } else {
          setUsuarios(
            data.map((row) => ({
              id: row.id,
              email: row.email,
              nombre_completo: row.nombre_completo,
              rol: (row.rol as UserRole) || "editor",
              avatar_url: row.avatar_url,
            }))
          );
        }
      } catch (err) {
        console.warn("Error cargando usuarios:", err);
        setUsuarios(DEMO_USUARIOS);
      } finally {
        setLoading(false);
      }
    }

    loadUsuarios();
  }, [isConfigured]);

  const cambiarRol = async (userId: string, nuevoRol: UserRole) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, rol: nuevoRol } : u))
    );

    if (isConfigured && !userId.startsWith("user-")) {
      try {
        await supabase.from("perfiles").update({ rol: nuevoRol }).eq("id", userId);
      } catch (err) {
        console.error("Error cambiando rol de usuario:", err);
      }
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout title="Acceso Restringido">
        <div className="py-12">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <ShieldAlert className="size-5" />
            <AlertTitle className="text-base font-bold">Permisos insuficientes</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              Esta sección está restringida exclusivamente a Administradores. Tu perfil actual tiene rol de Editor.
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gestión de Usuarios y Roles (RBAC)"
      subtitle="Asigna permisos a miembros del equipo entre Administradores y Editores de contenido."
    >
      <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base text-foreground">Invitar Miembros del Equipo</h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Los nuevos usuarios pueden registrarse o ser dados de alta en Supabase Auth. Una vez creados, aparecerán en este listado y podrás asignarles el rol de Administrador o Editor.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario / Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead className="text-center">Rol Asignado</TableHead>
              <TableHead className="text-right">Cambiar Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  Cargando perfiles de usuario...
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => {
                const esYo = user && u.id === user.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold-deep font-semibold text-xs">
                          {(u.nombre_completo?.[0] || u.email[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {u.nombre_completo || "Usuario"}
                            {esYo && (
                              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                Tú
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">{u.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{u.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={u.rol === "admin" ? "default" : "secondary"}
                        className="capitalize text-xs font-semibold"
                      >
                        <Shield className="size-3 mr-1" />
                        {u.rol === "admin" ? "Administrador" : "Editor"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {esYo ? (
                        <span className="text-xs text-muted-foreground italic">Cuenta activa</span>
                      ) : (
                        <div className="flex justify-end gap-1">
                          {u.rol === "editor" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cambiarRol(u.id, "admin")}
                              className="text-xs h-8"
                            >
                              Hacer Administrador
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cambiarRol(u.id, "editor")}
                              className="text-xs h-8"
                            >
                              Hacer Editor
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-brand-green font-semibold text-sm mb-2">
            <ShieldCheck className="size-4" />
            <span>Permisos del Administrador</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Acceso absoluto al sistema: puede modificar la configuración institucional y enlaces de contacto, eliminar registros, gestionar usuarios y publicar en todos los módulos.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-brand-brown font-semibold text-sm mb-2">
            <UserCheck className="size-4" />
            <span>Permisos del Editor</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Acceso operativo: puede crear, editar y pausar programas académicos, publicar artículos de blog, gestionar fotografías de galería y consultar inscripciones y mensajes de contacto.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
