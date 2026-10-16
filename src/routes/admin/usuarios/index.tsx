import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  GraduationCap,
  KeyRound,
  Loader2,
  MessageCircle,
  Pencil,
  Search,
  Shield,
  ShieldAlert,
  UserPlus,
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
import { useAuth, type UserProfile, type UserRole } from "@/lib/auth-context";
import { cleanPhoneDigits } from "@/services/api";
import type { Database } from "@/integrations/supabase/types";
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

interface ActualizarUsuarioPayload {
  id: string;
  password?: string | null | undefined;
  nombre_completo?: string | null | undefined;
  rol?: UserRole | undefined;
  documento?: string | null | undefined;
  telefono?: string | null | undefined;
  activo?: boolean | undefined;
  usuario?: string | null | undefined;
}

interface CredencialesGeneradas {
  nombre: string;
  usuario: string;
  documento: string | null;
  password: string;
  rol: UserRole;
  telefono: string | null;
}

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
  const [credencialesCreadas, setCredencialesCreadas] = useState<CredencialesGeneradas | null>(
    null,
  );

  // Modal para editar usuario / restablecer contraseña
  const [usuarioEditando, setUsuarioEditando] = useState<UserProfile | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDocumento, setEditDocumento] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editRol, setEditRol] = useState<UserRole>("estudiante");
  const [editPassword, setEditPassword] = useState("");
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

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
          (data || []).map((row) => ({
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

  const actualizarUsuarioBackend = async (payload: ActualizarUsuarioPayload) => {
    const { data, error } = await supabase.functions.invoke("admin-usuarios", {
      body: { accion: "actualizar", ...payload },
    });

    if (!error && data?.ok) {
      return { ok: true };
    }

    // Fallback directo a tabla perfiles si no se requiere cambio de contraseña
    if (!payload.password && typeof payload.id === "string") {
      const dbFields: Database["public"]["Tables"]["perfiles"]["Update"] = {};
      if (payload.nombre_completo !== undefined) dbFields.nombre_completo = payload.nombre_completo;
      if (payload.rol !== undefined) dbFields.rol = payload.rol;
      if (payload.documento !== undefined) dbFields.documento = payload.documento;
      if (payload.telefono !== undefined) dbFields.telefono = payload.telefono;
      if (payload.activo !== undefined) dbFields.activo = payload.activo;

      const { error: dbErr } = await supabase
        .from("perfiles")
        .update(dbFields)
        .eq("id", payload.id);

      if (!dbErr) return { ok: true };
      return { ok: false, error: dbErr.message };
    }

    return {
      ok: false,
      error: error?.message || data?.error || "Error actualizando el usuario.",
    };
  };

  const cambiarRol = async (userId: string, targetRol: UserRole) => {
    const prev = [...usuarios];
    setUsuarios((current) =>
      current.map((u) => (u.id === userId ? { ...u, rol: targetRol } : u)),
    );

    const res = await actualizarUsuarioBackend({ id: userId, rol: targetRol });
    if (!res.ok) {
      toast.error("No se pudo cambiar el rol: " + res.error);
      setUsuarios(prev);
    } else {
      toast.success(`Rol actualizado a ${targetRol}.`);
    }
  };

  const toggleActivo = async (userId: string, currentActivo: boolean) => {
    const next = !currentActivo;
    const prev = [...usuarios];
    setUsuarios((c) => c.map((u) => (u.id === userId ? { ...u, activo: next } : u)));

    const res = await actualizarUsuarioBackend({ id: userId, activo: next });
    if (!res.ok) {
      toast.error("Error al cambiar estado: " + res.error);
      setUsuarios(prev);
    } else {
      toast.success(next ? "Usuario activado." : "Usuario desactivado temporalmente.");
    }
  };

  const abrirModalEdicion = (u: UserProfile) => {
    setUsuarioEditando(u);
    setEditNombre(u.nombre_completo || "");
    setEditDocumento(u.documento || "");
    setEditTelefono(u.telefono || "");
    setEditRol(u.rol);
    setEditPassword("");
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando) return;
    if (!editNombre.trim()) {
      toast.error("El nombre completo es obligatorio.");
      return;
    }
    if (editPassword.trim() && editPassword.trim().length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setGuardandoEdicion(true);
    try {
      const res = await actualizarUsuarioBackend({
        id: usuarioEditando.id,
        nombre_completo: editNombre.trim(),
        documento: editDocumento.trim() || null,
        telefono: editTelefono.trim() || null,
        rol: editRol,
        ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
      });

      if (!res.ok) {
        toast.error(res.error || "No se pudo actualizar el usuario.");
      } else {
        toast.success(
          editPassword.trim()
            ? "Datos y contraseña actualizados correctamente."
            : "Datos del usuario actualizados.",
        );
        setUsuarioEditando(null);
        await cargarUsuarios();
      }
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      toast.error("El nombre completo es obligatorio.");
      return;
    }
    const cleanDoc = nuevoDocumento.replace(/\s+/g, "").trim();
    if ((nuevoRol === "estudiante" || nuevoRol === "docente") && !cleanDoc) {
      toast.error("El número de documento es obligatorio para estudiantes y docentes.");
      return;
    }
    const cleanUser = nuevoUsuario.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const pass = nuevoPassword.trim() || cleanDoc || "Funasf2026*";
    if (pass.length < 6) {
      toast.error("La contraseña o documento debe tener al menos 6 caracteres.");
      return;
    }

    setCreandoUsuario(true);
    try {
      const { data: edgeData, error: edgeErr } = await supabase.functions.invoke("admin-usuarios", {
        body: {
          accion: "crear",
          usuario: cleanUser || undefined,
          nombre_completo: nuevoNombre.trim(),
          rol: nuevoRol,
          documento: cleanDoc || null,
          telefono: nuevoTelefono.trim() || null,
          password: pass,
        },
      });

      if (edgeErr || !edgeData?.ok) {
        const errMsg = edgeErr?.message || edgeData?.error || "Error invocando admin-usuarios";
        toast.error("No se pudo crear la cuenta: " + errMsg);
      } else {
        const usuarioFinal = edgeData.usuario || cleanUser || cleanDoc;
        const passFinal = edgeData.password_temporal || pass;
        setCredencialesCreadas({
          nombre: nuevoNombre.trim(),
          usuario: usuarioFinal,
          documento: cleanDoc || null,
          password: passFinal,
          rol: nuevoRol,
          telefono: nuevoTelefono.trim() || null,
        });
        toast.success(`Cuenta creada para ${nuevoNombre.trim()}.`);
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

  const copiarCredenciales = (cred: CredencialesGeneradas) => {
    const identificador = cred.documento || cred.usuario;
    const portalUrl =
      cred.rol === "estudiante"
        ? "https://edufunasf.org/portal-estudiantil"
        : cred.rol === "docente"
          ? "https://edufunasf.org/docente"
          : "https://edufunasf.org/admin/login";
    const texto = `Credenciales FUNASF - ${cred.nombre}\nPortal: ${portalUrl}\nDocumento / Usuario: ${identificador}\nContraseña: ${cred.password}`;
    navigator.clipboard.writeText(texto);
    toast.success("Credenciales copiadas al portapapeles.");
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
              onClick={() => {
                setCredencialesCreadas(null);
                setModalCrearOpen(true);
              }}
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
              <TableHead className="text-xs font-bold text-slate-800 text-right">Acciones</TableHead>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModalEdicion(u)}
                          className="h-7 px-2.5 text-[11px] font-medium"
                        >
                          <Pencil className="size-3 mr-1" />
                          Editar / Clave
                        </Button>
                        {!esYo && (
                          <select
                            value={u.rol}
                            onChange={(e) => cambiarRol(u.id, e.target.value as UserRole)}
                            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-800 font-medium h-7"
                          >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="editor">Editor CMS</option>
                            <option value="admin">Administrador</option>
                          </select>
                        )}
                      </div>
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
              {credencialesCreadas ? "Credenciales de Acceso Generadas" : "Crear Nueva Cuenta de Usuario"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {credencialesCreadas
                ? "Comparte estos datos de ingreso con el usuario. Puede ingresar con su número de documento o su nombre de usuario."
                : "Registra un estudiante, docente o administrador para habilitar su acceso inmediato al portal."}
            </DialogDescription>
          </DialogHeader>

          {credencialesCreadas ? (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {credencialesCreadas.nombre}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Documento de Ingreso
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {credencialesCreadas.documento || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Usuario Alterno
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      @{credencialesCreadas.usuario}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-emerald-200/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Contraseña Inicial
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {credencialesCreadas.password}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copiarCredenciales(credencialesCreadas)}
                  className="flex-1 text-xs"
                >
                  <Copy className="size-3.5 mr-1.5" />
                  Copiar credenciales
                </Button>
                {credencialesCreadas.telefono && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <a
                      href={`https://wa.me/${cleanPhoneDigits(credencialesCreadas.telefono)}?text=${encodeURIComponent(
                        `Hola ${credencialesCreadas.nombre}, tu cuenta académica en FUNASF ha sido habilitada.\n\n📌 Ingresa con tu documento: ${credencialesCreadas.documento || credencialesCreadas.usuario}\n🔑 Contraseña inicial: ${credencialesCreadas.password}\n🌐 Portal: https://edufunasf.org/${credencialesCreadas.rol === "docente" ? "docente" : "portal-estudiantil"}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-3.5 mr-1.5" />
                      Enviar por WhatsApp
                    </a>
                  </Button>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setCredencialesCreadas(null);
                    setModalCrearOpen(false);
                  }}
                  className="w-full bg-slate-900 text-white text-xs"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          ) : (
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
                <Label className="text-xs font-semibold">Nombre Completo *</Label>
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
                  <Label className="text-xs font-semibold">
                    Documento (CC/TI) {nuevoRol === "estudiante" || nuevoRol === "docente" ? "*" : ""}
                  </Label>
                  <Input
                    placeholder="1005847291"
                    value={nuevoDocumento}
                    onChange={(e) => setNuevoDocumento(e.target.value)}
                    required={nuevoRol === "estudiante" || nuevoRol === "docente"}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Usuario (Opcional)</Label>
                  <Input
                    placeholder="Auto: documento o nombre"
                    value={nuevoUsuario}
                    onChange={(e) => setNuevoUsuario(e.target.value.toLowerCase())}
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
                    type="text"
                    placeholder="Por defecto: documento"
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                El usuario podrá iniciar sesión ingresando su <strong>Número de Documento</strong> (o usuario) y su contraseña inicial.
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
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: EDITAR USUARIO / RESTABLECER CONTRASEÑA */}
      <Dialog
        open={Boolean(usuarioEditando)}
        onOpenChange={(open) => !open && setUsuarioEditando(null)}
      >
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Editar Usuario y Contraseña
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Actualiza los datos de identificación o asigna una nueva contraseña de acceso para{" "}
              <strong>{usuarioEditando?.nombre_completo || usuarioEditando?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGuardarEdicion} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Nombre Completo *</Label>
              <Input
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Documento (CC/TI)</Label>
                <Input
                  value={editDocumento}
                  onChange={(e) => setEditDocumento(e.target.value)}
                  placeholder="Ej. 1005847291"
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Teléfono / WhatsApp</Label>
                <Input
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  placeholder="Ej. 3154829102"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Rol en el Sistema</Label>
              <select
                value={editRol}
                onChange={(e) => setEditRol(e.target.value as UserRole)}
                disabled={Boolean(user && usuarioEditando?.id === user.id)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white font-medium disabled:opacity-60"
              >
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="editor">Editor de Contenido</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 space-y-1.5">
              <Label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-amber-700" />
                Restablecer Contraseña (Opcional)
              </Label>
              <Input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Dejar en blanco para conservar la actual"
                className="text-xs font-mono bg-white"
              />
              {editDocumento && (
                <button
                  type="button"
                  onClick={() => setEditPassword(editDocumento.trim())}
                  className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950"
                >
                  Usar número de documento ({editDocumento.trim()}) como nueva contraseña
                </button>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUsuarioEditando(null)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={guardandoEdicion}
                className="bg-brand-green hover:bg-brand-green-deep text-white text-xs font-semibold"
              >
                {guardandoEdicion && <Loader2 className="size-3.5 animate-spin mr-1" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
