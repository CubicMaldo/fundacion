# Guía de Despliegue en VPS (Producción)

Esta rama (`production`) está optimizada y limpia de archivos de desarrollo, borradores o herramientas internas.

---

## 1. Requisitos Previos en el VPS

- **Node.js**: v20.x o superior
- **NPM**: v10.x o superior
- **Servidor Web**: Nginx, Caddy o PM2 (según la opción que elijas).

---

## 2. Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto en tu VPS tomando como referencia `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica-anon
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_PUBLISHABLE_KEY=tu-clave-publica-anon
```

> **Nota**: Las variables `VITE_*` se inyectan en el momento de la compilación (`npm run build`). Si cambias tus credenciales de Supabase, vuelve a ejecutar `npm run build`.

---

## 3. Instalación y Compilación

En el VPS ejecuta:

```bash
# 1. Asegurarte de estar en la rama de producción
git checkout production

# 2. Instalar dependencias de producción
npm install

# 3. Compilar el proyecto (genera los archivos pre-renderizados en ./dist/)
npm run build
```

---

## 4. Opciones de Ejecución en el VPS

### Opción A: Servir con Nginx (Recomendada - Máximo Rendimiento)
Al ser una aplicación pre-renderizada (SSG + SPA reactiva con Supabase), Nginx puede servir directamente los archivos estáticos de la carpeta `dist/` sin consumir memoria de procesos Node.

Ejemplo de configuración de Nginx (`/etc/nginx/sites-available/funasf`):

```nginx
server {
    listen 80;
    server_name edufunasf.org www.edufunasf.org;

    root /var/www/fundacion/dist;
    index index.html;

    # Ocultar versión de Nginx (Seguridad)
    server_tokens off;

    # Encabezados HTTP de Seguridad (OWASP)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Compresión gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Cache agresivo para assets versionados (JS, CSS, imágenes)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enrutamiento TanStack Router (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Luego habilita el sitio y recarga Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/funasf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Configuración de Certificado SSL/HTTPS Gratuito (Let's Encrypt)

Para cifrar todo el tráfico y activar HTTPS de forma obligatoria:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d edufunasf.org -d www.edufunasf.org
```
Certbot configurará automáticamente la renovación automática y la redirección de HTTP a HTTPS.

---

### Opción B: Ejecutar con PM2 (Servidor Node)

Si prefieres ejecutar el servidor mediante Node.js:

```bash
# Iniciar con PM2 en el puerto 3000
pm2 start npm --name "funasf-web" -- run start

# Guardar la lista de procesos de PM2
pm2 save
pm2 startup
```

---

## 5. Script de Actualización Automática

Para actualizar el proyecto cada vez que hagas cambios:

```bash
#!/bin/bash
set -e
cd /var/www/fundacion
git pull origin production
npm install
npm run build
# Si usas PM2:
# pm2 restart funasf-web
# Si usas Nginx:
# sudo systemctl reload nginx
echo "✅ Despliegue de FUNASF completado exitosamente."
```

---

## 6. Buenas Prácticas y Endurecimiento de Seguridad (Security Hardening)

### A. Gestión Segura de Claves (API Keys)
- En el archivo `.env` del VPS **solo** deben colocarse las claves públicas (`VITE_SUPABASE_PUBLISHABLE_KEY` o `anon`).
- **NUNCA** coloques la clave `service_role` (clave secreta de servicio) en el VPS ni en ningún archivo accesible por el cliente, ya que esta clave tiene permisos totales sobre la base de datos sin pasar por RLS.

### B. Restricción de Orígenes CORS en Supabase
Para evitar que sitios externos no autorizados interactúen con la base de datos:
1. En el panel de Supabase ve a **Project Settings > API**.
2. En la sección **Additional Allowed Origins**, añade exclusivamente tus dominios de producción:
   - `https://edufunasf.org`
   - `https://www.edufunasf.org`

### C. Fortalecimiento de Autenticación y Contraseñas
1. En **Authentication > Providers > Email**:
   - Ajusta la longitud mínima de contraseña a **10 o 12 caracteres**.
2. Activa **MFA (Autenticación Multifactor - TOTP)** para las cuentas con privilegios de administrador.
3. Asegúrate de que las cuentas administrativas tengan correo institucional `@edufunasf.org`.

### D. Regla RLS Reforzada para Perfiles de Usuario
Para evitar que usuarios autenticados ordinarios listen los datos de administradores, puedes ejecutar esta consulta en el **SQL Editor** de Supabase:

```sql
DROP POLICY IF EXISTS "Perfiles visibles para usuarios autenticados" ON public.perfiles;

CREATE POLICY "Perfiles visibles solo para dueño o administradores"
  ON public.perfiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());
```
