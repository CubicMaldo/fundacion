# FUNASF — AI Development Guidelines & System Directives

## 1. Project Context & Stack
- **Project**: FUNASF (Fundación Internacional Amigos Sin Fronteras) — portal institucional, programas académicos, admisiones y portal estudiantil.
- **Framework**: TanStack Start (SSR con Nitro) + TanStack Router (file-based en `src/routes/`).
- **Data & State**: TanStack React Query + Supabase.
- **Styling**: Tailwind CSS v4 + Radix UI + Lucide React + Sonner.
- **Language & Runtime**: TypeScript (strict), React 19, Vite / Vitest.

---

## 2. Core Architecture & Preservation Rules
- **Route Stability**: Mantén la estructura de rutas existente en `src/routes/` (`__root.tsx`, `programas/`, `blog/`, `admin/`, etc.). No modifiques rutas públicas sin solicitud explícita para no romper SEO ni URLs indexadas.
- **SEO & Metadata**: Utiliza siempre los helpers centralizados de SEO y preserva el site shell compartido y datos de fallback locales (`src/data/`).
- **SSR & Hydration Safety**: Al ejecutarse en TanStack Start con renderizado del lado del servidor (SSR):
  - Nunca accedas directamente a `window`, `document` o `localStorage` durante el render inicial.
  - Envuelve APIs del navegador dentro de `useEffect` o valida `typeof window !== 'undefined'`.

---

## 3. Anti-Slop Web Design Protocol (Obligatorio)

### Protocolo Pre-Código
1. **NUNCA generar vistas o componentes complejos desde el vacío**: Exige o acuerda una referencia visual real (Mobbin, Stripe, Cursor, Linear o capturas proporcionadas por el usuario) antes de maquetar.
2. **Definir tokens antes de codificar**: Comunica al usuario la selección tipográfica, paleta de color y espaciado simétrico.

### Reglas de Estilo
- **Tipografía**: Prohibido usar Inter o Geist por defecto. Emplea familias con personalidad (ej. serif refinadas para editorial o grotesk con carácter para interfaces modernas). Mantén jerarquía clara con `text-wrap: balance` en títulos.
- **Color**: Cero gradientes morados/púrpuras difusos o resplandores neón ("AI template purple"). Prioriza tonos tierra, off-white cálidos (`#FAF8F5`, `#F7F7F8`) y pasteles desaturados.
- **Espaciado Uniforme ($X = X$)**: El espaciado debe ser simétrico y matemático. Si el padding superior de un contenedor es $X$, el padding horizontal debe responder a una escala equilibrada y consistente en todos los elementos.
- **Imágenes Reales y Contextuales**: Prohibidas las ilustraciones planas genéricas ("Corporate Memphis") y fotos de stock abstractas. Prioriza fotografías reales de la fundación, estudiantes o capturas contextualizadas.

### Diccionario Anti-Slop para Refinamiento
- **`"Selected state lazy"`**: Reemplazar bordes o tabs flotantes desalineados por indicadores de estado limpios y continuos.
- **`"Eyebrow oversized"`**: Mantener subtítulos en mayúsculas pequeños, discretos y con tracking moderado.
- **`"Random glow lights"`**: Eliminar brillos o halos difusos innecesarios en el fondo; usar bordes y capas limpias.
- **`"Status pills"`**: Eliminar píldoras decorativas ("New", "AI") que no tengan utilidad funcional.
- **`"Card spam"`**: Evitar meter todo en tarjetas idénticas; combinar listas, tipografía y contrastes de fondo.

---

## 4. Estándares de Código y Flujo de Trabajo
- **Shortest Working Diff (Ponytail)**: No introduzcas dependencias ni abstracciones innecesarias. Resuelve en la causa raíz, no en los síntomas.
- **Verificación**:
  - `npm run build`: Compilación de producción (Vite + TanStack Start + Nitro).
  - `npm test`: Suite de tests unitarios (Vitest).
  - `npm run lint`: Chequeo de sintaxis y reglas de ESLint.
- **Commits**: Formato Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `chore:`).
