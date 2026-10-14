import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  BookOpen,
} from "lucide-react";
import { createSeoMeta } from "@/lib/seo";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type UserProfile, type UserRole, LOGIN_EMAIL_DOMAIN } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/usuarios/")({
  head: () =>
    createSeoMeta({
      title: "Gestión de Usuarios y Roles | FUNASF Admin",
      noindex: true,
      canonicalPath: "/admin/usuarios",
    }),
  component: AdminUsuariosPage,
});

function AdminUsuariosPage() {
  const { isAdmin, isConfigured, user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");

  // Modal para crear nuevo usuario
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevoRol, setNuevoRol] = useState<UserRole>("estudiante");
  const [nuevoDocumento, setNuevoDocumento] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [creandoUsuario, setCreandoUsuario] = useState(false);

  const cargarUsuarios = async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando usuarios:", error);
      } else {
        setUsuarios(
          (data || []).map((row: any) => ({
            id: row.id,
            email: row.email,
            nombre_completo: row.nombre_completo,
            rol: (row.rol as UserRole) || "estudiante",
            avatar_url: row.avatar_url,
            usuario: row.usuario,
            documento: row.documento,
            telefono: row.telefono,
            activo: row.activo ?? true,
          })),
        );
      }
    } catch (err) {
      console.warn("Error cargando usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [isConfigured]);

  const cambiarRol = async (userId: string, targetRol: UserRole) => {
    const prev = [...usuarios];
    setUsuarios((current) =>
      current.map((u) => (u.id === userId ? { ...u, rol: targetRol } : u)),
    );

    try {
      const { error } = await supabase
        .from("perfiles")
        .update({ rol: targetRol })
        .eq("id", userId);

      if (error) {
        toast.error("No se pudo cambiar el rol: " + error.message);
        setUsuarios(prev);
      } else {
        toast.success(`Rol actualizado a ${targetRol}.`);
      }
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar rol.");
      setUsuarios(prev);
    }
  };

  const toggleActivo = async (userId: string, currentActivo: boolean) => {
    const next = !currentActivo;
    const prev = [...usuarios];
    setUsuarios((c) => c.map((u) => (u.id === userId ? { ...u, activo: next } : u)));

    try {
      const { error } = await supabase
        .from("perfiles")
        .update({ activo: next })
        .eq("id", userId);

      if (error) {
        toast.error("Error al cambiar estado: " + error.message);
        setUsuarios(prev);
      } else {
        toast.success(next ? "Usuario activado." : "Usuario desactivado temporalmente.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al cambiar estado.");
      setUsuarios(prev);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = nuevoUsuario.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    if (!cleanUser || cleanUser.length < 3) {
      toast.error("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (!nuevoNombre.trim()) {
      toast.error("El nombre completo es obligatorio.");
      return;
    }
    const pass = nuevoPassword.trim() || nuevoDocumento.trim() || "Funasf2026*";
    if (pass.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCreandoUsuario(true);
    try {
      // Intentar invocar la edge function de admin
      const { data: edgeData, error: edgeErr } = await supabase.functions.invoke("admin-usuarios", {
        body: {
          accion: "crear",
          usuario: cleanUser,
          nombre_completo: nuevoNombre.trim(),
          rol: nuevoRol,
          documento: nuevoDocumento.trim() || null,
          telefono: nuevoTelefono.trim() || null,
          password: pass,
        },
      });

      if (edgeErr || !edgeData?.ok) {
        // Si la edge function no está desplegada aún en cloud, mensaje claro
        const errMsg = edgeErr?.message || edgeData?.error || "Verifica la función admin-usuarios";
        toast.error("No se pudo crear automáticamente: " + errMsg);
      } else {
        toast.success(`Usuario @${cleanUser} creado exitosamente con contraseña inicial.`);
        setModalCrearOpen(false);
        setNuevoNombre("");
        setNuevoUsuario("");
        setNuevoDocumento("");
        setNuevoTelefono("");
        setNuevoPassword("");
        await cargarUsuarios();
      }
    } catch (err: any) {
      toast.error(err.message || "Error al procesar la solicitud.");
    } finally {
      setCreandoUsuario(false);
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout title="Acceso Restringido">
        <div className="py-12">
          <Alert variant="destructive" className="max-w-xl mx-auto rounded-2xl">
            <ShieldAlert className="size-5" />
            <AlertTitle className="text-base font-bold">Permisos insuficientes</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              Esta sección está restringida exclusivamente a Administradores del sistema FUNASF.
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtroRol !== "todos" && u.rol !== filtroRol) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const matchName = u.nombre_completo?.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchUser = u.usuario?.toLowerCase().includes(q);
      const matchDoc = u.documento?.toLowerCase().includes(q);
      return matchName || matchEmail || matchUser || matchDoc;
    }
    return true;
  });

  return (
    <AdminLayout
      title="Gestión de Cuentas y Roles Académicos"
      subtitle="Administración centralizada de Estudiantes, Docentes, Editores y Administradores de FUNASF."
    >
      {/* Controles y Botón de Creación */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              size="sm"
              variant={filtroRol === "todos" ? "default" : "outline"}
              onClick={() => setFiltroRol("todos")}
              className={`text-xs h-8 ${filtroRol === "todos" ? "bg-brand-green hover:bg-brand-green-deep text-white" : ""}`}
            >
              Todos ({usuarios.length})
            </Button>
            <Button
              size="sm"
              variant={filtroRol === "estudiante" ? "default" : "outline"}
              onClick={() => setFiltroRol("estudiante")}
              className={`text-xs h-8 ${filtroRol === "estudiante" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            >
              <GraduationCap className="size-3.5 mr-1" />
              Estudiantes ({usuarios.filter((u) => u.rol === "estudiante").length})
            </Button>
            <Button
              size="sm"
              variant={filtroRol === "docente" ? "default" : "outline"}
              onClick={() => setFiltroRol("docente")}
              className={`text-xs h-8 ${filtroRol === "docente" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
            >
              <BookOpen className="size-3.5 mr-1" />
              Docentes ({usuarios.filter((u) => u.rol === "docente").length})
            </Button>
            <Button
              size="sm"
              variant={filtroRol === "admin" ? "default" : "outline"}
              onClick={() => setFiltroRol("admin")}
              className={`text-xs h-8 ${filtroRol === "admin" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
            >
              <Shield className="size-3.5 mr-1" />
              Admins ({usuarios.filter((u) => u.rol === "admin").length})
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, usuario, cédula..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <Button
              size="sm"
              onClick={() => setModalCrearOpen(true)}
              className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold h-8 shrink-0 shadow-xs"
            >
              <UserPlus className="size-3.5 mr-1.5" />
              Nueva Cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70">
              <TableHead className="text-xs font-bold text-slate-800">Usuario / Nombre</TableHead>
              <TableHead className="text-xs font-bold text-slate-800">Identificación / Teléfono</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-center">Rol</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-center">Estado</TableHead>
              <TableHead className="text-xs font-bold text-slate-800 text-right">Gestión de Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 text-xs">
                  <Loader2 className="size-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  Consultando base de datos de usuarios...
                </TableCell>
              </TableRow>
            ) : usuariosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 text-xs">
                  No se encontraron usuarios registrados con el filtro actual.
                </TableCell>
              </TableRow>
            ) : (
              usuariosFiltrados.map((u) => {
                const esYo = user && u.id === user.id;
                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full font-bold text-xs ${
                            u.rol === "admin"
                              ? "bg-amber-100 text-amber-900"
                              : u.rol === "docente"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          {(u.nombre_completo?.[0] || u.email[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                            {u.nombre_completo || "Usuario"}
                            {esYo && (
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                                Tú
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            {u.usuario && (
                              <span className="font-mono font-bold text-emerald-700">
                                @{u.usuario}
                              </span>
                            )}
                            <span className="truncate max-w-[180px]">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      <div>
                        {u.documento ? (
                          <span className="font-mono font-medium">CC {u.documento}</span>
                        ) : (
                          <span className="text-slate-400 italic">Sin documento</span>
                        )}
                      </div>
                      {u.telefono && (
                        <div className="text-[10px] text-slate-500">{u.telefono}</div>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`capitalize text-[10px] font-semibold ${
                          u.rol === "admin"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : u.rol === "docente"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : u.rol === "editor"
                                ? "bg-purple-50 text-purple-800 border-purple-300"
                                : "bg-emerald-50 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {u.rol === "admin" ? (
                          <Shield className="size-3 mr-1" />
                        ) : u.rol === "docente" ? (
                          <BookOpen className="size-3 mr-1" />
                        ) : (
                          <GraduationCap className="size-3 mr-1" />
                        )}
                        {u.rol}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {esYo ? (
                        <Badge className="bg-emerald-600 text-white text-[10px]">Activo</Badge>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleActivo(u.id, u.activo)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            u.activo
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {esYo ? (
                        <span className="text-xs text-slate-400 italic">Cuenta activa</span>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <select
                            value={u.rol}
                            onChange={(e) => cambiarRol(u.id, e.target.value as UserRole)}
                            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-800 font-medium"
                          >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="editor">Editor CMS</option>
                            <option value="admin">Administrador</option>
                          </select>
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

      {/* DIÁLOGO: CREAR NUEVA CUENTA DE USUARIO */}
      <Dialog open={modalCrearOpen} onOpenChange={setModalCrearOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Crear Nueva Cuenta de Usuario
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Registra un estudiante o docente para habilitar su acceso al portal educativo con usuario y contraseña.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCrearUsuario} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Rol Asignado</Label>
              <select
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value as UserRole)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white font-medium"
              >
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="editor">Editor de Contenido</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Nombre Completo</Label>
              <Input
                placeholder="Ej. Camila Andrea Rodríguez"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Nombre de Usuario</Label>
                <Input
                  placeholder="ej. camila.rodriguez"
                  value={nuevoUsuario}
                  onChange={(e) => setNuevoUsuario(e.target.value.toLowerCase())}
                  required
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Documento (CC/TI)</Label>
                <Input
                  placeholder="1005847291"
                  value={nuevoDocumento}
                  onChange={(e) => setNuevoDocumento(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Teléfono / WhatsApp</Label>
                <Input
                  placeholder="3154829102"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Contraseña Inicial</Label>
                <Input
                  type="password"
                  placeholder="Por defecto: documento"
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              El usuario podrá iniciar sesión inmediatamente introduciendo su usuario (<strong>@{nuevoUsuario || "usuario"}</strong>) y su contraseña en el portal.
            </p>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalCrearOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={creandoUsuario}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                {creandoUsuario ? (
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                ) : (
                  <UserPlus className="size-3.5 mr-1" />
                )}
                Crear Usuario
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
