import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(distDir, "public");

// 1. Ensure dist and dist/public exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. If dist/public exists, copy all files and folders to dist/ root
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true, force: true });
}

// 3. Find compiled CSS and main JS entry in dist/assets
const assetsDir = path.join(distDir, "assets");
let cssFileName = "";
let indexJsFileName = "";
let clientJsFileName = "";

if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  for (const file of assetFiles) {
    if (file.startsWith("styles-") && file.endsWith(".css")) {
      cssFileName = file;
    }
    if (file.startsWith("index-") && file.endsWith(".js")) {
      indexJsFileName = file;
    }
    if (file.startsWith("client-") && file.endsWith(".js")) {
      clientJsFileName = file;
    }
  }
}

const cssLink = cssFileName ? `<link rel="stylesheet" href="/assets/${cssFileName}" />` : "";
const scriptTag = indexJsFileName
  ? `<script type="module" src="/assets/${indexJsFileName}"></script>`
  : clientJsFileName
    ? `<script type="module" src="/assets/${clientJsFileName}"></script>`
    : "";

// 4. Generate clean static index.html
const indexHtmlContent = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FUNASF Colombia | Fundación Internacional Amigos Sin Fronteras — EduFUNASF</title>
  <meta name="description" content="Fundación Internacional Amigos Sin Fronteras – FUNASF Colombia (EduFUNASF): educación, formación técnica laboral, becas de hasta el 90 %, emprendimiento y acción comunitaria." />
  <meta name="author" content="FUNASF Colombia — EduFUNASF" />
  <meta property="og:site_name" content="EduFUNASF | FUNASF Colombia" />
  <meta property="og:title" content="FUNASF Colombia | Fundación Internacional Amigos Sin Fronteras — EduFUNASF" />
  <meta property="og:description" content="Portal oficial de FUNASF en Colombia. Programas de formación técnica y becas de hasta el 90 % en alianza con instituciones educativas." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_CO" />
  <meta property="og:url" content="https://funasf.org" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="FUNASF — Porque la educación no tiene fronteras" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  ${cssLink}
</head>
<body>
  <div id="root"></div>
  <script>window.$_TSR={h:()=>{}};</script>
  ${scriptTag}
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), indexHtmlContent, "utf8");
fs.writeFileSync(path.join(distDir, "200.html"), indexHtmlContent, "utf8");
fs.writeFileSync(path.join(distDir, "404.html"), indexHtmlContent, "utf8");

if (fs.existsSync(publicDir)) {
  fs.writeFileSync(path.join(publicDir, "index.html"), indexHtmlContent, "utf8");
}

// 5. Ensure .htaccess is copied to dist root for Hostinger / Apache
const htaccessSrc = path.join(rootDir, "public", ".htaccess");
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, path.join(distDir, ".htaccess"));
  console.log("[postbuild] .htaccess successfully copied to dist/.");
}

console.log("[postbuild] dist artifacts successfully prepared for deployment.");
