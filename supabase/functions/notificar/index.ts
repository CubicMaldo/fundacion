// Edge Function: notificación por correo de nuevas inscripciones y mensajes de contacto.
// Seguridad: el cliente solo envía { tipo, id }. La función relee el registro con service_role,
// solo notifica registros reales creados hace < 15 min y marca notificado_at (idempotente),
// por lo que no puede usarse para enviar correos arbitrarios.
//
// Secrets requeridos (supabase secrets set ...):
//   RESEND_API_KEY   API key de https://resend.com
//   NOTIFY_FROM      Remitente verificado, ej: "FUNASF <notificaciones@edufunasf.org>"
// Opcional:
//   NOTIFY_TO        Destinatario interno. Si falta, usa configuracion.contacto.correo
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function plantilla(titulo: string, filas: [string, unknown][], pie = "") {
  const tr = filas
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:35%">${esc(k)}</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
<div style="background:#17422d;padding:24px;text-align:center;color:#fff"><h2 style="margin:0;font-size:20px">${esc(titulo)}</h2>
<p style="margin:5px 0 0;color:#d4a373;font-size:14px">Fundación Internacional Amigos Sin Fronteras (FUNASF)</p></div>
<div style="padding:24px"><table style="width:100%;border-collapse:collapse">${tr}</table>${pie}</div></div></body></html>`;
}

async function enviar(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Método no permitido" });

  let body: { tipo?: string; id?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "JSON inválido" });
  }
  const { tipo, id } = body;
  if ((tipo !== "inscripcion" && tipo !== "contacto") || !id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return json(400, { error: "Parámetros inválidos" });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("NOTIFY_FROM");
  if (!apiKey || !from) {
    console.error("[notificar] Falta RESEND_API_KEY o NOTIFY_FROM");
    return json(503, { error: "Servicio de correo no configurado" });
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const tabla = tipo === "inscripcion" ? "inscripciones" : "mensajes_contacto";
  const limite = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  // Reclamar el registro de forma atómica (evita dobles envíos).
  const { data: fila, error } = await admin
    .from(tabla)
    .update({ notificado_at: new Date().toISOString() })
    .eq("id", id)
    .is("notificado_at", null)
    .gte("created_at", limite)
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("[notificar] Error leyendo registro", error);
    return json(500, { error: "Error interno" });
  }
  if (!fila) return json(200, { ok: true, omitido: true });

  let destino = Deno.env.get("NOTIFY_TO");
  if (!destino) {
    const { data: cfg } = await admin.from("configuracion").select("valor").eq("clave", "contacto").maybeSingle();
    destino = (cfg?.valor as { correo?: string } | null)?.correo;
  }
  if (!destino) {
    await admin.from(tabla).update({ notificado_at: null }).eq("id", id);
    return json(503, { error: "Sin destinatario configurado" });
  }

  try {
    if (tipo === "inscripcion") {
      await enviar(apiKey, {
        from,
        to: [destino],
        reply_to: fila.correo,
        subject: `Nueva inscripción: ${fila.programa_nombre} - ${fila.nombre_completo}`,
        html: plantilla("Nueva solicitud de inscripción", [
          ["Programa", fila.programa_nombre],
          ["Modalidad", fila.modalidad],
          ["Aspirante", fila.nombre_completo],
          ["Documento", `${fila.documento_tipo} ${fila.documento_numero}`],
          ["Teléfono / WhatsApp", fila.telefono],
          ["Correo", fila.correo],
          ["Ciudad / Municipio", fila.ciudad],
          ["Mensaje", fila.mensaje],
          ["Fecha", new Date(fila.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" })],
        ]),
      });
      // Confirmación al aspirante (no bloqueante si falla)
      await enviar(apiKey, {
        from,
        to: [fila.correo],
        reply_to: destino,
        subject: "Recibimos tu solicitud de inscripción - FUNASF",
        html: plantilla(
          "¡Hemos recibido tu solicitud!",
          [
            ["Nombre", fila.nombre_completo],
            ["Programa", fila.programa_nombre],
          ],
          `<p style="margin-top:20px">Un asesor de FUNASF se comunicará contigo para continuar el proceso de matrícula.</p>`,
        ),
      }).catch((e) => console.error("[notificar] Confirmación al aspirante falló", e));
    } else {
      await enviar(apiKey, {
        from,
        to: [destino],
        reply_to: fila.correo,
        subject: `Mensaje de contacto: ${fila.asunto} - ${fila.nombre}`,
        html: plantilla("Nuevo mensaje de contacto", [
          ["Nombre", fila.nombre],
          ["Correo", fila.correo],
          ["Teléfono", fila.telefono],
          ["Asunto", fila.asunto],
          ["Mensaje", fila.mensaje],
        ]),
      });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("[notificar] Envío falló", err);
    // Liberar para reintento
    await admin.from(tabla).update({ notificado_at: null }).eq("id", id);
    return json(502, { error: "No se pudo enviar la notificación" });
  }
});
