<?php
/**
 * Endpoint de Respaldo de Notificaciones y Solicitudes FUNASF
 * Diseñado para Hostinger Shared Hosting (PHP 8.x nativo + Apache/LiteSpeed)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido. Solo se acepta POST.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Formato JSON inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Detección Anti-Spam por Honeypot
if (!empty($data['website_empresa'])) {
    // Es un bot automatizado que llenó el campo trampa oculto
    echo json_encode(['ok' => true, 'mensaje' => 'Solicitud procesada con éxito.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$tipo = isset($data['tipo']) && is_string($data['tipo']) ? trim($data['tipo']) : 'inscripcion';
$correoDestino = 'info@edufunasf.org';
$fecha = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';

// 2. Asegurar directorio de logs con seguridad denegada
$logsDir = __DIR__ . '/logs';
if (!is_dir($logsDir)) {
    @mkdir($logsDir, 0750, true);
    @file_put_contents($logsDir . '/.htaccess', "Order Deny,Allow\nDeny from all\n<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>");
}

// 3. Registrar lead en log de disco seguro
$logEntry = [
    'timestamp' => $fecha,
    'tipo' => $tipo,
    'ip' => $ip,
    'payload' => $data,
];
@file_put_contents(
    $logsDir . '/solicitudes-' . date('Y-m') . '.jsonl',
    json_encode($logEntry, JSON_UNESCAPED_UNICODE) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

// 4. Construir y enviar notificación por Correo Institucional Hostinger
if ($tipo === 'inscripcion') {
    $nombre = htmlspecialchars(trim((string)($data['nombreCompleto'] ?? 'No especificado')), ENT_QUOTES, 'UTF-8');
    $docTipo = htmlspecialchars(trim((string)($data['documentoTipo'] ?? 'CC')), ENT_QUOTES, 'UTF-8');
    $docNum = htmlspecialchars(trim((string)($data['documentoNumero'] ?? 'No especificado')), ENT_QUOTES, 'UTF-8');
    $telefono = htmlspecialchars(trim((string)($data['telefono'] ?? 'No especificado')), ENT_QUOTES, 'UTF-8');
    $correoRaw = trim((string)($data['correo'] ?? ''));
    $correo = filter_var($correoRaw, FILTER_VALIDATE_EMAIL) ? $correoRaw : '';
    $ciudad = htmlspecialchars(trim((string)($data['ciudad'] ?? 'No especificada')), ENT_QUOTES, 'UTF-8');
    $programa = htmlspecialchars(trim((string)($data['programaNombre'] ?? 'Programa General')), ENT_QUOTES, 'UTF-8');

    $asunto = "=?UTF-8?B?" . base64_encode("Nueva Postulación / Inscripción: {$programa} - {$nombre}") . "?=";

    $cuerpoHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background-color: #17422d; padding: 24px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">Nueva Solicitud de Inscripción / Beca</h2>
      <p style="margin: 5px 0 0; color: #d4a373; font-size: 14px;">Fundación Internacional Amigos Sin Fronteras (FUNASF)</p>
    </div>
    <div style="padding: 24px;">
      <p>Se ha recibido una nueva postulación a través del portal institucional:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">Programa:</td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #17422d; font-weight: bold;">{$programa}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Aspirante:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{$nombre}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Documento:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{$docTipo} {$docNum}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">WhatsApp / Tel:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="https://wa.me/57{$telefono}" style="color: #16a34a; font-weight: bold;">{$telefono}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Correo:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:{$correo}">{$correo}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Ciudad / Municipio:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{$ciudad}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Fecha de registro:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{$fecha}</td></tr>
      </table>
      <div style="margin-top: 25px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a;">
        <p style="margin: 0; font-size: 13px; color: #166534;">
          <strong>Acción recomendada:</strong> Contactar al aspirante de inmediato por WhatsApp para formalizar la asignación del cupo becado.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
HTML;

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: FUNASF Notificaciones <no-reply@edufunasf.org>',
        "Reply-To: {$nombre} <{$correo}>",
        'X-Mailer: PHP/' . phpversion(),
    ];
    @mail($correoDestino, $asunto, $cuerpoHtml, implode("\r\n", $headers));

    // Confirmación automática por correo al estudiante
    if (!empty($correo)) {
        $asuntoEstudiante = "=?UTF-8?B?" . base64_encode("¡Postulación recibida con éxito! - FUNASF Colombia") . "?=";
        $cuerpoEstudianteHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background-color: #17422d; padding: 24px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">¡Hemos recibido tu postulación!</h2>
      <p style="margin: 5px 0 0; color: #d4a373; font-size: 14px;">Fundación Internacional Amigos Sin Fronteras (FUNASF)</p>
    </div>
    <div style="padding: 24px;">
      <p>Hola <strong>{$nombre}</strong>,</p>
      <p>Confirmamos que tu solicitud de ingreso y postulación a la beca institucional para el programa <strong>{$programa}</strong> ha sido registrada con éxito en nuestro sistema.</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin: 0 0 8px; color: #166534; font-size: 15px;">Próximos pasos:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #15803d;">
          <li>Un orientador académico de FUNASF se comunicará contigo vía WhatsApp o llamada telefónica.</li>
          <li>Te indicaremos los documentos requeridos (copia de documento de identidad y certificado de estudios).</li>
          <li>Te presentaremos las opciones de horario y modalidad (presencial o virtual).</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748b;">
        Si deseas agilizar tu matrícula o tienes alguna consulta urgente, puedes comunicarte directamente a nuestro WhatsApp oficial: <strong>+57 313 577 9384</strong>.
      </p>
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://wa.me/573135779384?text=Hola%20FUNASF,%20acabo%20de%20postularme%20al%20programa%20{$programa}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">Contactar a Admisiones por WhatsApp</a>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
      FUNASF — Porque la educación no tiene fronteras.<br>
      Cali, Valle del Cauca — Colombia | www.edufunasf.org
    </div>
  </div>
</body>
</html>
HTML;
        $headersEstudiante = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: Admisiones FUNASF <info@edufunasf.org>',
            'Reply-To: FUNASF <info@edufunasf.org>',
            'X-Mailer: PHP/' . phpversion(),
        ];
        @mail($correo, $asuntoEstudiante, $cuerpoEstudianteHtml, implode("\r\n", $headersEstudiante));
    }

} else {
    // Formulario de Contacto general
    $nombre = htmlspecialchars(trim((string)($data['nombre'] ?? 'Remitente')), ENT_QUOTES, 'UTF-8');
    $correoRaw = trim((string)($data['correo'] ?? ''));
    $correo = filter_var($correoRaw, FILTER_VALIDATE_EMAIL) ? $correoRaw : 'no-reply@edufunasf.org';
    $telefono = htmlspecialchars(trim((string)($data['telefono'] ?? 'No especificado')), ENT_QUOTES, 'UTF-8');
    $asuntoTema = htmlspecialchars(trim((string)($data['asunto'] ?? 'Consulta general')), ENT_QUOTES, 'UTF-8');
    $mensaje = nl2br(htmlspecialchars(trim((string)($data['mensaje'] ?? '')), ENT_QUOTES, 'UTF-8'));

    $asunto = "=?UTF-8?B?" . base64_encode("Mensaje de Contacto: {$asuntoTema} - {$nombre}") . "?=";

    $cuerpoHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background-color: #17422d; padding: 24px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">Nuevo Mensaje de Contacto Web</h2>
      <p style="margin: 5px 0 0; color: #d4a373; font-size: 14px;">FUNASF Colombia</p>
    </div>
    <div style="padding: 24px;">
      <p><strong>De:</strong> {$nombre} (&lt;{$correo}&gt;)</p>
      <p><strong>Teléfono:</strong> {$telefono}</p>
      <p><strong>Asunto:</strong> {$asuntoTema}</p>
      <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
        {$mensaje}
      </div>
    </div>
  </div>
</body>
</html>
HTML;

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: FUNASF Notificaciones <no-reply@edufunasf.org>',
        "Reply-To: {$nombre} <{$correo}>",
        'X-Mailer: PHP/' . phpversion(),
    ];
    @mail($correoDestino, $asunto, $cuerpoHtml, implode("\r\n", $headers));
}

echo json_encode([
    'ok' => true,
    'mensaje' => 'Solicitud recibida y notificada con éxito.',
], JSON_UNESCAPED_UNICODE);
