import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const INTERNAL_DOMAIN = "usuarios.edufunasf.org";

function slugifyUsername(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 28);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configuradas.");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autorizado: falta encabezado Authorization." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const {
      data: { user: callerUser },
      error: authErr,
    } = await supabaseAdmin.auth.getUser(token);

    if (authErr || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Sesión inválida o expirada." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from("perfiles")
      .select("rol, activo")
      .eq("id", callerUser.id)
      .single();

    if (profileErr || !callerProfile || callerProfile.rol !== "admin" || !callerProfile.activo) {
      return new Response(
        JSON.stringify({ error: "Acceso denegado: se requieren permisos de Administrador activo." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const accion = body.accion ?? "crear";

    if (accion === "crear") {
      const nombreCompleto = String(body.nombre_completo ?? "").trim();
      const rol = String(body.rol ?? "estudiante").trim();
      const documento = String(body.documento ?? "").replace(/\s+/g, "").trim();
      const telefono = String(body.telefono ?? "").trim();
      const usuarioInput = String(body.usuario ?? "").trim();
      const passwordInput = String(body.password ?? "").trim();
      const cursoId = body.curso_id ? String(body.curso_id).trim() : "";
      const inscripcionId = body.inscripcion_id ? String(body.inscripcion_id).trim() : "";
      const reutilizarExistente = Boolean(body.reutilizar_existente);

      if (!nombreCompleto) {
        return new Response(
          JSON.stringify({ error: "El nombre completo es obligatorio." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (!["admin", "editor", "docente", "estudiante"].includes(rol)) {
        return new Response(
          JSON.stringify({ error: "Rol inválido." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if ((rol === "estudiante" || rol === "docente") && !documento) {
        return new Response(
          JSON.stringify({ error: "El número de documento es obligatorio para docentes y estudiantes." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Verificar si ya existe por documento
      if (documento) {
        const { data: existingDoc } = await supabaseAdmin
          .from("perfiles")
          .select("id, email, usuario, rol")
          .eq("documento", documento)
          .maybeSingle();

        if (existingDoc) {
          if (reutilizarExistente) {
            let matriculado = false;
            if (cursoId) {
              const { error: matErr } = await supabaseAdmin
                .from("matriculas")
                .upsert(
                  { estudiante_id: existingDoc.id, curso_id: cursoId, estado: "cursando" },
                  { onConflict: "estudiante_id,curso_id", ignoreDuplicates: true },
                );
              matriculado = !matErr;
            }
            if (inscripcionId) {
              await supabaseAdmin
                .from("inscripciones")
                .update({ estado: "admitido" })
                .eq("id", inscripcionId);
            }
            return new Response(
              JSON.stringify({
                ok: true,
                reutilizado: true,
                id: existingDoc.id,
                email: existingDoc.email,
                usuario: existingDoc.usuario,
                rol: existingDoc.rol,
                matriculado,
              }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({ error: `Ya existe un usuario registrado con el documento ${documento}.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

      const baseUsuario = slugifyUsername(usuarioInput || documento || nombreCompleto) || "usuario";
      let usuarioFinal = baseUsuario;
      let sufijo = 1;

      while (true) {
        const { data: existingUser } = await supabaseAdmin
          .from("perfiles")
          .select("id")
          .eq("usuario", usuarioFinal)
          .maybeSingle();

        if (!existingUser) break;
        sufijo += 1;
        usuarioFinal = `${baseUsuario}${sufijo}`;
      }

      const email = `${usuarioFinal}@${INTERNAL_DOMAIN}`;
      const password = passwordInput || documento || `${usuarioFinal}2026*`;

      if (password.length < 6) {
        return new Response(
          JSON.stringify({ error: "La contraseña o documento debe tener al menos 6 caracteres." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: createdAuth, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nombre_completo: nombreCompleto,
        },
        app_metadata: {
          rol,
          usuario: usuarioFinal,
          documento: documento || null,
          telefono: telefono || null,
        },
      });

      if (createErr || !createdAuth.user) {
        return new Response(
          JSON.stringify({ error: createErr?.message || "No se pudo crear el usuario en Auth." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error: upsertErr } = await supabaseAdmin.from("perfiles").upsert({
        id: createdAuth.user.id,
        email,
        nombre_completo: nombreCompleto,
        rol,
        usuario: usuarioFinal,
        documento: documento || null,
        telefono: telefono || null,
        activo: true,
      });

      if (upsertErr) {
        await supabaseAdmin.auth.admin.deleteUser(createdAuth.user.id);
        return new Response(
          JSON.stringify({ error: `Error guardando perfil: ${upsertErr.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      let matriculado = false;
      if (cursoId && rol === "estudiante") {
        const { error: matErr } = await supabaseAdmin
          .from("matriculas")
          .insert({
            estudiante_id: createdAuth.user.id,
            curso_id: cursoId,
            estado: "cursando",
          });
        matriculado = !matErr;
      }

      if (inscripcionId) {
        await supabaseAdmin
          .from("inscripciones")
          .update({ estado: "admitido" })
          .eq("id", inscripcionId);
      }

      return new Response(
        JSON.stringify({
          ok: true,
          id: createdAuth.user.id,
          email,
          usuario: usuarioFinal,
          documento: documento || null,
          password_temporal: password,
          rol,
          matriculado,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (accion === "actualizar") {
      const userId = String(body.id ?? "").trim();
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Falta el ID del usuario." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (body.documento !== undefined && body.documento !== null && String(body.documento).trim() !== "") {
        const cleanDoc = String(body.documento).replace(/\s+/g, "").trim();
        const { data: dupDoc } = await supabaseAdmin
          .from("perfiles")
          .select("id")
          .eq("documento", cleanDoc)
          .neq("id", userId)
          .maybeSingle();

        if (dupDoc) {
          return new Response(
            JSON.stringify({ error: `El documento ${cleanDoc} ya pertenece a otro usuario.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

      const authUpdates: Record<string, unknown> = {};
      if (body.password && String(body.password).trim().length >= 6) {
        authUpdates.password = String(body.password).trim();
      }
      if (typeof body.activo === "boolean") {
        authUpdates.ban_duration = body.activo ? "none" : "876000h";
      }

      const { data: currentAuth } = await supabaseAdmin.auth.admin.getUserById(userId);
      const currentAppMeta = currentAuth?.user?.app_metadata ?? {};
      const nextAppMeta: Record<string, unknown> = { ...currentAppMeta };
      let appMetaChanged = false;

      if (body.rol && ["admin", "editor", "docente", "estudiante"].includes(body.rol)) {
        nextAppMeta.rol = body.rol;
        appMetaChanged = true;
      }
      if (body.documento !== undefined) {
        nextAppMeta.documento = String(body.documento).replace(/\s+/g, "").trim() || null;
        appMetaChanged = true;
      }
      if (body.telefono !== undefined) {
        nextAppMeta.telefono = String(body.telefono).trim() || null;
        appMetaChanged = true;
      }
      if (appMetaChanged) {
        authUpdates.app_metadata = nextAppMeta;
      }
      if (body.nombre_completo !== undefined) {
        authUpdates.user_metadata = {
          ...(currentAuth?.user?.user_metadata ?? {}),
          nombre_completo: String(body.nombre_completo).trim(),
        };
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authUpdateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdates);
        if (authUpdateErr) {
          return new Response(
            JSON.stringify({ error: authUpdateErr.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

      const perfilUpdates: Record<string, unknown> = {};
      if (body.nombre_completo !== undefined) perfilUpdates.nombre_completo = String(body.nombre_completo).trim();
      if (body.rol !== undefined) perfilUpdates.rol = body.rol;
      if (body.documento !== undefined) perfilUpdates.documento = String(body.documento).replace(/\s+/g, "").trim() || null;
      if (body.telefono !== undefined) perfilUpdates.telefono = String(body.telefono).trim() || null;
      if (typeof body.activo === "boolean") perfilUpdates.activo = body.activo;

      if (Object.keys(perfilUpdates).length > 0) {
        const { error: dbErr } = await supabaseAdmin
          .from("perfiles")
          .update(perfilUpdates)
          .eq("id", userId);

        if (dbErr) {
          return new Response(
            JSON.stringify({ error: dbErr.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: `Acción desconocida: ${accion}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
