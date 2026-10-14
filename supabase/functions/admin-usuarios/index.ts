// Edge Function: administración de cuentas académicas (solo administradores).
// Crea docentes/estudiantes con usuario + contraseña y permite restablecer contraseña,
// activar/desactivar y cambiar rol. Usa service_role, nunca expuesto al navegador.
import { createClient } from "npm:@supabase/supabase-js@2";

// Dominio sintético para cuentas que inician sesión con "usuario" en lugar de correo.
// Debe coincidir con LOGIN_EMAIL_DOMAIN en src/lib/auth-context.tsx
const LOGIN_EMAIL_DOMAIN = "usuarios.edufunasf.org";
const ROLES = ["admin", "editor", "docente", "estudiante"] as const;
type Rol = (typeof ROLES)[number];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const USUARIO_RE = /^[a-z0-9._-]{3,40}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validarPassword(p: unknown): string | null {
  if (typeof p !== "string" || p.length < 8 || p.length > 72) return "La contraseña debe tener entre 8 y 72 caracteres.";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Método no permitido" });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // 1. Autenticar al llamador y exigir rol admin activo
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return json(401, { error: "No autenticado" });
  const { data: caller, error: callerErr } = await admin.auth.getUser(token);
  if (callerErr || !caller.user) return json(401, { error: "Sesión inválida" });
  const { data: perfil } = await admin.from("perfiles").select("rol, activo").eq("id", caller.user.id).maybeSingle();
  if (!perfil || perfil.rol !== "admin" || !perfil.activo) return json(403, { error: "Solo administradores" });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "JSON inválido" });
  }

  try {
    if (body.accion === "crear") {
      const usuario = String(body.usuario ?? "").trim().toLowerCase();
      const nombre = String(body.nombre_completo ?? "").trim();
      const rol = body.rol as Rol;
      const correoContacto = body.correo ? String(body.correo).trim().toLowerCase() : null;
      const documento = body.documento ? String(body.documento).trim() : null;
      const telefono = body.telefono ? String(body.telefono).trim() : null;

      if (!USUARIO_RE.test(usuario)) return json(400, { error: "Usuario inválido: 3-40 caracteres (a-z, 0-9, . _ -)." });
      if (nombre.length < 3 || nombre.length > 150) return json(400, { error: "Nombre completo inválido." });
      if (!ROLES.includes(rol)) return json(400, { error: "Rol inválido." });
      if (correoContacto && !EMAIL_RE.test(correoContacto)) return json(400, { error: "Correo de contacto inválido." });
      const pErr = validarPassword(body.password);
      if (pErr) return json(400, { error: pErr });

      const { data: existe } = await admin.from("perfiles").select("id").ilike("usuario", usuario).maybeSingle();
      if (existe) return json(409, { error: "Ese nombre de usuario ya existe." });

      const { data, error } = await admin.auth.admin.createUser({
        email: `${usuario}@${LOGIN_EMAIL_DOMAIN}`,
        password: body.password as string,
        email_confirm: true,
        app_metadata: { rol, usuario },
        user_metadata: { nombre_completo: nombre, documento, telefono },
      });
      if (error || !data.user) return json(400, { error: error?.message ?? "No se pudo crear el usuario." });

      // El trigger crea el perfil; aseguramos datos de contacto y rol (idempotente).
      const { error: upErr } = await admin
        .from("perfiles")
        .upsert({
          id: data.user.id,
          email: correoContacto ?? data.user.email!,
          nombre_completo: nombre,
          rol,
          usuario,
          documento,
          telefono,
        });
      if (upErr) return json(500, { error: `Usuario creado pero el perfil falló: ${upErr.message}` });
      return json(200, { ok: true, id: data.user.id });
    }

    if (body.accion === "actualizar") {
      const id = String(body.id ?? "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json(400, { error: "Id inválido." });
      if (id === caller.user.id && (body.rol !== undefined || body.activo === false)) {
        return json(400, { error: "No puedes cambiar tu propio rol ni desactivarte." });
      }

      const authUpdate: Record<string, unknown> = {};
      const perfilUpdate: Record<string, unknown> = {};

      if (body.password !== undefined) {
        const pErr = validarPassword(body.password);
        if (pErr) return json(400, { error: pErr });
        authUpdate.password = body.password;
      }
      if (body.rol !== undefined) {
        if (!ROLES.includes(body.rol as Rol)) return json(400, { error: "Rol inválido." });
        perfilUpdate.rol = body.rol;
        authUpdate.app_metadata = { rol: body.rol };
      }
      if (body.activo !== undefined) {
        perfilUpdate.activo = Boolean(body.activo);
        authUpdate.ban_duration = body.activo ? "none" : "876000h";
      }
      if (body.nombre_completo !== undefined) {
        const n = String(body.nombre_completo).trim();
        if (n.length < 3 || n.length > 150) return json(400, { error: "Nombre completo inválido." });
        perfilUpdate.nombre_completo = n;
      }

      if (Object.keys(authUpdate).length) {
        const { error } = await admin.auth.admin.updateUserById(id, authUpdate);
        if (error) return json(400, { error: error.message });
      }
      if (Object.keys(perfilUpdate).length) {
        const { error } = await admin.from("perfiles").update(perfilUpdate).eq("id", id);
        if (error) return json(400, { error: error.message });
      }
      return json(200, { ok: true });
    }

    return json(400, { error: "Acción no soportada." });
  } catch (err) {
    console.error("[admin-usuarios]", err);
    return json(500, { error: "Error interno al procesar la solicitud." });
  }
});
