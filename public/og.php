<?php
/**
 * Dynamic OpenGraph Micro-Bridge para WhatsApp, Facebook, Telegram, Twitter y Bots
 * Diseñado para Hostinger Shared Hosting (Apache/LiteSpeed + PHP 8.x)
 */

declare(strict_types=1);

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$catalogFile = __DIR__ . '/metadata-catalog.json';

$defaultMeta = [
    'title' => 'FUNASF Colombia | Fundación Internacional Amigos Sin Fronteras — EduFUNASF',
    'description' => 'Portal oficial de FUNASF en Colombia. Programas de formación técnica y becas de hasta el 90 % en alianza con instituciones educativas.',
    'image' => 'https://edufunasf.org/og-image.png',
    'url' => 'https://edufunasf.org' . $requestUri,
    'type' => 'website',
];

$matchedMeta = $defaultMeta;

if (file_exists($catalogFile)) {
    $catalogRaw = file_get_contents($catalogFile);
    $catalog = json_decode($catalogRaw, true);

    if (is_array($catalog) && isset($catalog[$requestUri])) {
        $item = $catalog[$requestUri];
        $matchedMeta['title'] = $item['title'] ?? $defaultMeta['title'];
        $matchedMeta['description'] = $item['description'] ?? $defaultMeta['description'];
        $matchedMeta['image'] = !empty($item['image'])
            ? (str_starts_with($item['image'], 'http') ? $item['image'] : 'https://edufunasf.org' . $item['image'])
            : $defaultMeta['image'];
        $matchedMeta['type'] = $item['type'] ?? 'article';
    }
}

// User-Agent detection: si es un bot/crawler social, servir el HTML estático con meta tags
$userAgent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$isCrawler = (bool)preg_match(
    '/(whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot)/i',
    $userAgent
);

// Si NO es crawler y es un navegador humano normal que llegó aquí por error, redirigir a index.html
if (!$isCrawler && file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= htmlspecialchars($matchedMeta['title'], ENT_QUOTES, 'UTF-8') ?></title>
  <meta name="description" content="<?= htmlspecialchars($matchedMeta['description'], ENT_QUOTES, 'UTF-8') ?>" />
  
  <!-- OpenGraph / Facebook / WhatsApp -->
  <meta property="og:type" content="<?= htmlspecialchars($matchedMeta['type'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:site_name" content="EduFUNASF | FUNASF Colombia" />
  <meta property="og:title" content="<?= htmlspecialchars($matchedMeta['title'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:description" content="<?= htmlspecialchars($matchedMeta['description'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:url" content="<?= htmlspecialchars($matchedMeta['url'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:image" content="<?= htmlspecialchars($matchedMeta['image'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= htmlspecialchars($matchedMeta['title'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta name="twitter:description" content="<?= htmlspecialchars($matchedMeta['description'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta name="twitter:image" content="<?= htmlspecialchars($matchedMeta['image'], ENT_QUOTES, 'UTF-8') ?>" />

  <link rel="canonical" href="<?= htmlspecialchars($matchedMeta['url'], ENT_QUOTES, 'UTF-8') ?>" />
  <meta http-equiv="refresh" content="0;url=<?= htmlspecialchars($requestUri, ENT_QUOTES, 'UTF-8') ?>" />
  <script>window.location.replace(<?= json_encode($requestUri) ?>);</script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 2rem; text-align: center; color: #333;">
  <h1><?= htmlspecialchars($matchedMeta['title'], ENT_QUOTES, 'UTF-8') ?></h1>
  <p><?= htmlspecialchars($matchedMeta['description'], ENT_QUOTES, 'UTF-8') ?></p>
  <p><a href="<?= htmlspecialchars($requestUri, ENT_QUOTES, 'UTF-8') ?>">Haga clic aquí para continuar al portal de FUNASF</a></p>
</body>
</html>
