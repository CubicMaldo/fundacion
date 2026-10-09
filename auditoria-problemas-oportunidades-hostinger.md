# Auditoría Exhaustiva del Proyecto FUNASF: Problemas, Dolores y Oportunidades de Mejora
**Entorno de Producción Objetivo:** Hosting Ilimitado de Hostinger (LiteSpeed / Apache / PHP / MySQL / Storage Compartido)

---

## 1. Resumen Ejecutivo y Diagnóstico Global

El proyecto de la **Fundación Internacional Amigos Sin Fronteras (FUNASF / EduFUNASF)** es una plataforma web completa que integra:
1. **Sitio Institucional Público:** Catálogo de programas técnicos laborales, sistema de becas (hasta el 90 %), blog de noticias, galería, sedes e información institucional.
2. **Módulo de Admisiones y Captación:** Formularios de inscripción a becas, donaciones y contacto directo con integración a WhatsApp.
3. **Portal Estudiantil / Intranet Académica:** Consulta de asignaturas matriculadas, calificaciones parciales y definitivas, entregas de trabajos prácticos, observaciones docentes y plataformas virtuales.
4. **Panel Administrativo (CMS/Backoffice):** Gestión de programas, artículos, galería, postulaciones a becas, mensajes de contacto, configuración centralizada y perfiles.

### Estado Técnico Actual vs. Despliegue en Hostinger
Actualmente, el proyecto está estructurado como una aplicación **TanStack Start (Vite 8 + Nitro 3 beta)** con configuración de **Cloudflare Workers** heredada de Lovable, pero con un script parche `scripts/postbuild.mjs` que busca compilarlo como SPA estática.

> [!CAUTION]
> **Desalineación Crítica de Arquitectura:** El hosting ilimitado de Hostinger es un entorno de alojamiento compartido basado en **LiteSpeed/Apache + PHP + MySQL**. **No es un entorno serverless para Cloudflare Workers ni un VPS con Node.js persistente**. Además, se han detectado **fallos de tipos que impiden la verificación de TypeScript (`tsc`)**, una **falla de seguridad en el login que permite acceso admin con credenciales erróneas**, y un **comportamiento de pérdida silenciosa de datos en los formularios de inscripción**.

---

## 2. Matriz de Priorización de Hallazgos (Impacto vs. Urgencia)

| ID | Hallazgo | Categoría | Severidad | Esfuerzo | Impacto |
|---|---|---|---|---|---|
| **SEC-01** | Falso login / Puerta de bypass en autenticación admin | Seguridad | 🔴 Crítico | Bajo | Alto |
| **DEP-01** | Conflicto de runtime Nitro/Cloudflare vs Hostinger LiteSpeed | Arquitectura/Deploy | 🔴 Crítico | Medio | Alto |
| **ENV-01** | Pérdida silenciosa de leads e inscripciones sin Supabase | Negocio/Datos | 🔴 Crítico | Bajo | Alto |
| **TYP-01** | 15 errores de compilación TypeScript (`tsc --noEmit`) | Calidad/Código | 🟠 Alto | Medio | Alto |
| **SEO-01** | Ausencia de SSR/OG dinámico en previews de WhatsApp/Redes | Marketing/SEO | 🟠 Alto | Medio | Alto |
| **SUB-01** | Desajuste de subdominios (`estudiantes.edufunasf.org`) en Hostinger | Hosting/DNS | 🟠 Alto | Medio | Medio |
| **NOT-01** | Ausencia de alertas inmediatas por correo (SMTP) al recibir inscripciones | Conversión | 🟡 Medio | Medio | Alto |
| **SPM-01** | Formularios desprotegidos contra bots y ataques de spam | Seguridad | 🟡 Medio | Bajo | Medio |
| **DAT-01** | Marcadores `PENDIENTE` en donaciones y configuración en LocalStorage | UX/Finanzas | 🟡 Medio | Bajo | Medio |
| **PERF-01**| Cargas estáticas sin compresión Brotli ni cache LiteSpeed avanzada | Rendimiento | 🟢 Menor | Bajo | Medio |

---

## 3. Desglose Exhaustivo de Problemas y Dolores

### 3.1. Arquitectura y Despliegue en Hostinger Plan Ilimitado

1. **Dependencia residual de Cloudflare Workers en Nitro:**
   - En `package.json` y `vite.config.ts`, el paquete `@lovable.dev/vite-tanstack-config` configura Nitro con el preset `cloudflare-module`.
   - Al ejecutar `npm run build`, se generan archivos en `dist/server/` (`wrangler.json`, `dist/server/index.mjs`, scripts Nitro) que **no tienen ninguna función en Hostinger** y consumen cuota de inodos (archivos permitidos) en el plan de hosting compartido.
2. **Inyección de Variables de Entorno en Hostinger:**
   - En un hosting compartido, el servidor web LiteSpeed solo sirve archivos estáticos (`index.html`, `.js`, `.css`). No existe un proceso Node.js en tiempo de ejecución leyendo archivos `.env`.
   - **Dolor:** Si el proyecto no se construye localmente con las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` ya quemadas en los scripts empaquetados por Vite, al subir el sitio a Hostinger la web cargará en blanco con una excepción irrecuperable: `Missing Supabase environment variable(s)`.
3. **Subdominios en Hostinger (`estudiantes.edufunasf.org`):**
   - El código en `src/lib/subdomain.ts` detecta el host y redirige la experiencia al portal estudiantil.
   - En Hostinger, crear un subdominio crea por defecto una carpeta separada en el disco (ej. `public_html/estudiantes`). Si los archivos de la aplicación no están en esa carpeta o si no se configura un alias/document root compartido mediante `.htaccess` o symlink, los estudiantes que ingresen al subdominio recibirán un error `403 Forbidden` o `404 Not Found`.
4. **Desconexión con la Infraestructura de Hostinger:**
   - El plan ilimitado de Hostinger incluye bases de datos MariaDB/MySQL ilimitadas, cuentas de correo profesionales con SMTP ilimitado y certificados SSL automáticos.
   - Toda la base de datos del proyecto se aloja actualmente en Supabase (externo). En el plan gratuito de Supabase, las bases de datos se pausan tras 7 días de inactividad, lo que apagaría el portal de notas y la recepción de inscripciones sin aviso previo.

---

### 3.2. Seguridad y Vulnerabilidades Críticas

1. **Bypass de Autenticación en `src/lib/auth-context.tsx`:**
   - En las líneas 185–215 de `src/lib/auth-context.tsx`, si Supabase no está configurado o si el usuario ingresa una contraseña incorrecta y el llamado a Supabase falla, el código cae en un bloque `catch` que crea un usuario de respaldo ficticio con rol `admin` (`"Administrador FUNASF"`) y lo guarda en `localStorage` (`funasf_auth_session`).
   - **Riesgo:** Cualquier usuario no autorizado puede acceder visualmente al panel administrativo en `/admin` simplemente ingresando credenciales aleatorias.
2. **Pérdida Silenciosa de Leads en `src/services/api.ts`:**
   - En `crearInscripcion` y `enviarMensajeContacto`:
     ```typescript
     if (!isSupabaseAvailable()) {
       console.log("[API Local] Inscripción recibida en modo local:", input);
       return { ok: true };
     }
     ```
   - Si la conexión a Supabase se interrumpe o falla la configuración, el formulario le muestra al visitante una pantalla de felicitaciones ("¡Tu inscripción ha sido registrada!"), pero la información se destruye en la memoria del navegador. Ningún orientador de FUNASF recibe el prospecto.
3. **Formularios Expuestos a Spam Masivo (Sin Turnstile / reCAPTCHA / Honeypot):**
   - Las rutas `/contacto` e `/inscripcion` no cuentan con validación anti-bot. Scripts automatizados pueden saturar la tabla `inscripciones` y agotar la cuota de la base de datos o el almacenamiento.

---

### 3.3. Errores de Código y Tipos TypeScript (`tsc --noEmit`)

El comando de validación de tipos detectó 15 errores formales que comprometen la estabilidad del build:

1. **`src/components/admin/AdminLayout.tsx` (Línea 29):** Error de tipos en navegación a `/admin/login` al omitir propiedades requeridas de búsqueda del enrutador.
2. **`src/components/site/portal-estudiantil/PortalEstudiantilView.tsx` (Líneas 90 y 349):**
   - El componente `PageHero` recibe `badge`, `badgeIcon` y `lead`, cuando su contrato espera `{ eyebrow, title, description }`.
   - Se invoca la propiedad `settings.contacto.whatsappLlamadas`, la cual no existe en la interfaz `SiteContactoConfig`.
3. **`src/components/site/portal-estudiantil/StudentPortalLayout.tsx` (Líneas 53 y 76):**
   - Acceso no verificado a array potencialmente indefinido (`settings.contacto.telefonos[0]`).
   - Invocación de propiedad inexistente `whatsappLlamadas`.
4. **`src/routes/inscripcion.tsx` (Línea 44):** Mismo error de props en `PageHero` que en el portal estudiantil.
5. **`src/routes/__root.tsx` (Línea 49):** `reportLovableError(error, "root error boundary")` entrega un string como segundo parámetro donde se exige un objeto `Record<string, unknown>`.
6. **`src/routes/admin/login.tsx` (Líneas 13-14):** Incompatibilidad con `noPropertyAccessFromIndexSignature` al acceder a `search.portal` y `search.redirect`.
7. **`src/components/admin/ArticuloForm.tsx`, `src/routes/blog/$slug.tsx` y `src/components/site/ModalInscripcion.tsx`:** Incompatibilidades con la regla de TypeScript `exactOptionalPropertyTypes: true` al pasar valores `undefined` explícitos.
8. **`vite.config.ts` (Línea 21):** La opción `prerender` no es reconocida por el plugin de nitro definido en `@lovable.dev/vite-tanstack-config`.

---

### 3.4. Dolores de Negocio, UX y Conversión

1. **Compartir en WhatsApp y Redes Sociales (Open Graph Ciego):**
   - Cuando un asesor comercial o un usuario comparte un enlace por WhatsApp (ej. `edufunasf.org/programas/auxiliar-enfermeria` o una convocatoria de becas), el bot de WhatsApp no ejecuta JavaScript.
   - Dado que Hostinger sirve la SPA estática mediante rewrite en `.htaccess`, WhatsApp lee las metaetiquetas estáticas generales del `index.html`. El prospecto ve el logo genérico de la fundación en lugar de la foto, título y descripción del programa de enfermería.
2. **Textos y Cuentas Incompletas:**
   - En `ModalDonacion.tsx`, el número de cuenta Bancolombia dice textualmente: `PENDIENTE (Añadir cuenta)`. Si un donante potencial abre el diálogo para apoyar la fundación, encuentra una cuenta vacía, dañando la confianza institucional.
3. **Desconexión en la Configuración del Sitio (`localStorage`):**
   - En `src/services/api.ts` y `/admin/configuracion`, los cambios en teléfonos, correos y beneficios de becas se guardan en el `localStorage` del administrador. Si otro administrador o un visitante accede desde otro dispositivo, no ve los cambios si Supabase no estuvo conectado en ese momento.
4. **Inmediatez de Respuesta a Prospectos de Becas:**
   - Actualmente no existe ningún webhook ni script de notificación por correo. Cuando un aspirante se postula a una beca del 90 %, el equipo comercial no recibe un aviso inmediato en sus teléfonos ni en sus correos corporativos.

---

## 4. Oportunidades de Mejora Aprovechando Hostinger Ilimitado

Hostinger Web Hosting no solo es un servidor de archivos estáticos; posee capacidades nativas que resuelven los problemas del proyecto a costo cero:

```mermaid
graph TD
    User["Visitante / Estudiante / Bot de WhatsApp"] --> LiteSpeed["Hostinger LiteSpeed Web Server"]
    LiteSpeed -->|Rutas SPA normales| HTML["SPA React compilada (dist estático)"]
    LiteSpeed -->|Bot detectado (WhatsApp/Facebook)| PHP_OG["Micro-script PHP (OpenGraph Dinámico)"]
    PHP_OG -->|Lee datos| Cache["JSON Cache / Supabase REST"]
    HTML -->|Consultas y Auth| Supabase["Supabase BaaS (BD, Auth, Storage)"]
    HTML -->|Envío de Formularios| PHP_Mail["Micro-endpoint PHP (Hostinger Mail / SMTP)"]
    PHP_Mail -->|Notificación instantánea| AdminMail["Correo Asesores FUNASF (info@edufunasf.org)"]
    PHP_Mail -->|Copia de bienvenida| StudentMail["Correo del Aspirante"]
```

### 1. Rescate de Open Graph para WhatsApp con un Micro-Script PHP
- En lugar de requerir un servidor Node.js costoso para Server-Side Rendering (SSR), se puede añadir una regla en `.htaccess` para que cuando el User-Agent sea un rastreador (`WhatsApp`, `facebookexternalhit`, `Twitterbot`), la petición sea procesada por un ligero script `og.php`.
- Este script inyecta el título, resumen e imagen del programa técnico o artículo antes de enviar la respuesta, logrando tarjetas visuales atractivas en WhatsApp sin cambiar la SPA.

### 2. Notificaciones Automáticas por Correo usando el SMTP de Hostinger
- El plan ilimitado de Hostinger incluye buzones de correo institucionales (`info@edufunasf.org`, `admisiones@edufunasf.org`).
- Implementar un endpoint PHP simple (`api/notificar-inscripcion.php`) que reciba los datos del formulario de inscripción y envíe de inmediato:
  - Una notificación al WhatsApp/correo del coordinador de admisiones con los datos del aspirante.
  - Un correo automático de confirmación al estudiante con los requisitos y pasos de la beca.

### 3. Pipeline de Despliegue Automatizado (CI/CD)
- Configurar un GitHub Action para que cada `git push` a `main`:
  1. Ejecute `npm run test` y `tsc --noEmit`.
  2. Compile el proyecto con las variables de producción.
  3. Despliegue automáticamente vía FTP/FTPS o Git a la carpeta `public_html` de Hostinger, eliminando la necesidad de subir archivos manualmente por cPanel/hPanel.

### 4. Aceleración con LiteSpeed Cache
- Ajustar `.htaccess` para aprovechar los módulos nativos de compresión Gzip/Brotli y cabeceras de cache inmutable (`Cache-Control: public, max-age=31536000, immutable`) para los chunks de Vite en `/assets/`.

---

## 5. Plan de Acción Recomendado (Fases de Implementación)

### Fase 1: Correcciones Críticas y Seguridad (Inmediato)
1. **Sanear la Autenticación Admin:** Eliminar el fallback que otorga rol `admin` ante credenciales erróneas en `src/lib/auth-context.tsx`. Si la autenticación falla, debe mostrar error de credenciales inválidas.
2. **Corregir los 15 Errores de TypeScript:** Resolver las discrepancias de tipos en `PageHero`, `AdminLayout`, `PortalEstudiantilView`, `StudentPortalLayout`, `ArticuloForm`, `InscripcionForm` y `login.tsx` para que `tsc --noEmit` pase con 0 errores.
3. **Blindar los Formularios:** En `src/services/api.ts`, reportar error real al usuario si Supabase no responde, impidiendo la falsa confirmación de recepción. Añadir validación honeypot anti-spam.

### Fase 2: Optimización para Hostinger y Subdominios
1. **Limpiar el Build de Nitro innecesario:** Optimizar el script de empaquetado para que el artefacto final sea una SPA 100% limpia y ligera para LiteSpeed, sin archivos basura de Cloudflare Workers.
2. **Configuración de Subdominio en Hostinger:** Definir en `.htaccess` o mediante configuración de Hostinger la ruta adecuada para que `estudiantes.edufunasf.org` sirva el Portal Estudiantil correctamente.
3. **Completar Datos Pendientes:** Reemplazar el marcador `PENDIENTE (Añadir cuenta)` en `ModalDonacion.tsx` con la información oficial de la fundación.

### Fase 3: Potenciación Comercial y Conversión
1. **Integrar Notificaciones Inmediatas por Correo (SMTP Hostinger):** Crear el conector PHP ligero para despachar alertas de nuevos aspirantes en tiempo real.
2. **Generador de OpenGraph Dinámico para WhatsApp:** Añadir el interceptor PHP para compartir programas y artículos con vista previa enriquecida.
3. **Configurar GitHub Actions para Despliegue Continuo a Hostinger.**
