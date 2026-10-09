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
  <meta property="og:url" content="https://edufunasf.org" />
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
  <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
  <link rel="shortcut icon" href="/favicon.ico" />
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

// 5. Ensure Hostinger / Apache files (.htaccess, og.php, api/) are copied to dist/ root
const filesToCopy = [
  { src: path.join(rootDir, "public", ".htaccess"), dest: path.join(distDir, ".htaccess") },
  { src: path.join(rootDir, "public", "og.php"), dest: path.join(distDir, "og.php") },
];

for (const { src, dest } of filesToCopy) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

const apiSrcDir = path.join(rootDir, "public", "api");
const apiDestDir = path.join(distDir, "api");
if (fs.existsSync(apiSrcDir)) {
  fs.cpSync(apiSrcDir, apiDestDir, { recursive: true, force: true });
}

// 6. Generate metadata-catalog.json for dynamic OpenGraph crawler bridge (og.php)
const metadataCatalog = {
  "/": {
    title: "FUNASF Colombia | Fundación Internacional Amigos Sin Fronteras — EduFUNASF",
    description: "Portal oficial de FUNASF en Colombia. Programas de formación técnica y becas de hasta el 90 % en alianza con instituciones educativas.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
  "/estudia": {
    title: "Convocatoria de Becas del 90% y Programas Técnicos | FUNASF Colombia",
    description: "Accede a formación técnica laboral de alta demanda con becas de hasta el 90%. Sedes en Cali y Atlántico con modalidad virtual y presencial.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
  "/inscripcion": {
    title: "Postulación a Becas de hasta el 90% | FUNASF Colombia",
    description: "Diligencia tu solicitud en línea para asegurar tu cupo becado en programas de salud, administración, SST y educación.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
  "/quienes-somos": {
    title: "Quiénes Somos — Nuestra Historia, Misión y Visión | FUNASF Colombia",
    description: "Conoce el propósito social y la trayectoria de la Fundación Internacional Amigos Sin Fronteras transformando vidas a través de la educación.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
  "/contacto": {
    title: "Contacto Oficial y Sede Cali | FUNASF Colombia",
    description: "Líneas de atención WhatsApp (+57 313 577 9384), correo info@edufunasf.org y ubicación física de nuestra sede principal en Cali.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
  "/portal-estudiantil": {
    title: "Portal Estudiantil | FUNASF Colombia — Calificaciones y Aula",
    description: "Acceso exclusivo para estudiantes activos de FUNASF: consulta de notas, cronogramas académicos y aulas virtuales.",
    image: "https://edufunasf.org/og-image.png",
    type: "website",
  },
};

// Parse Programas Académicos con imagen enriquecida
try {
  const programasFile = fs.readFileSync(path.join(rootDir, "src", "data", "programas.ts"), "utf8");
  const progBlocks = programasFile.split(/\{\s*slug:\s*"/);
  for (const block of progBlocks.slice(1)) {
    const slugMatch = block.match(/^([^"]+)"/);
    const nombreMatch = block.match(/nombre:\s*"([^"]+)"/);
    const imgMatch = block.match(/imagenUrl:\s*"([^"]+)"/);
    const descMatch = block.match(/descripcion:\s*"([^"]+)"/);

    if (slugMatch && nombreMatch) {
      const slug = slugMatch[1];
      const nombre = nombreMatch[1];
      const desc = descMatch ? descMatch[1] : `Programa de formación laboral en ${nombre} con becas institucionales de hasta 90%.`;
      const img = imgMatch ? imgMatch[1] : "https://edufunasf.org/og-image.png";

      metadataCatalog[`/programas/${slug}`] = {
        title: `${nombre} | Programa Académico FUNASF — EduFUNASF`,
        description: desc.slice(0, 190) + "...",
        image: img.startsWith("http") ? img : `https://edufunasf.org${img}`,
        type: "article",
      };
    }
  }
} catch (err) {
  console.warn("[postbuild] Advertencia procesando programas para metadata-catalog:", err);
}

// Parse Artículos de Blog con imagen de portada enriquecida
try {
  const apiFile = fs.readFileSync(path.join(rootDir, "src", "services", "api.ts"), "utf8");
  const postBlocks = apiFile.split(/\{\s*id:\s*"post-/);
  for (const block of postBlocks.slice(1)) {
    const slugMatch = block.match(/slug:\s*"([^"]+)"/);
    const tituloMatch = block.match(/titulo:\s*"([^"]+)"/);
    const resumenMatch = block.match(/resumen:\s*"([^"]+)"/);
    const imgMatch = block.match(/imagenPortada:\s*"([^"]+)"/);

    if (slugMatch && tituloMatch) {
      const slug = slugMatch[1];
      const titulo = tituloMatch[1];
      const desc = resumenMatch ? resumenMatch[1] : "";
      const img = imgMatch ? imgMatch[1] : "/og-image.png";

      metadataCatalog[`/blog/${slug}`] = {
        title: `${titulo} | Blog FUNASF`,
        description: desc.slice(0, 190),
        image: img.startsWith("http") ? img : `https://edufunasf.org${img}`,
        type: "article",
      };
    }
  }
} catch (err) {
  console.warn("[postbuild] Advertencia procesando blog para metadata-catalog:", err);
}

fs.writeFileSync(
  path.join(distDir, "metadata-catalog.json"),
  JSON.stringify(metadataCatalog, null, 2),
  "utf8"
);
console.log(`[postbuild] metadata-catalog.json generado con ${Object.keys(metadataCatalog).length} rutas.`);

// 7. Generate Subdomain directory for Hostinger subcarpeta estudiantes.edufunasf.org
const estudiantesDir = path.join(distDir, "estudiantes");
if (!fs.existsSync(estudiantesDir)) {
  fs.mkdirSync(estudiantesDir, { recursive: true });
}
fs.writeFileSync(path.join(estudiantesDir, "index.html"), indexHtmlContent, "utf8");
fs.writeFileSync(
  path.join(estudiantesDir, ".htaccess"),
  `<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteCond %{REQUEST_FILENAME} -f [OR]\n  RewriteCond %{REQUEST_FILENAME} -d\n  RewriteRule ^ - [L]\n  RewriteRule ^ index.html [L]\n</IfModule>\n`,
  "utf8"
);
console.log("[postbuild] Soporte para subdominio estudiantes.edufunasf.org configurado en dist/estudiantes/.");

// 8. Cleanup Cloudflare Nitro Server artifacts to save Hostinger inodes & storage
const serverDir = path.join(distDir, "server");
if (fs.existsSync(serverDir)) {
  fs.rmSync(serverDir, { recursive: true, force: true });
}

const unneededFiles = [
  path.join(distDir, "wrangler.json"),
  path.join(distDir, "nitro.json"),
  path.join(distDir, "_headers"),
  path.join(distDir, "public"),
];

for (const filePath of unneededFiles) {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
  }
}

console.log("[postbuild] Paquete optimizado exitosamente para Hostinger Shared Web Hosting.");
