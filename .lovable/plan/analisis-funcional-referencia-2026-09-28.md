# Análisis funcional del sitio de referencia (elyonyirehbarranquilla.edu.co)

Fecha: 2026-09-28
Propósito: Extraer patrones de arquitectura, navegación, jerarquía y conversión para la oferta académica de FUNASF sin copiar contenidos protegidos, tarifas ni activos de marca.

---

## 1. Arquitectura general
- Sitio web institucional con menú de navegación fijo persistente en todas las páginas.
- Estructura base: Corporación · Oferta académica · Servicios · Contacto · Educación virtual.
- Footer institucional con canales de atención segmentados por dependencia (dirección física, teléfonos fijos, WhatsApp, correos por área y redes sociales).

## 2. Jerarquía de navegación (Nivel 1 → Nivel 3)
```
Home (/)
├── Quiénes somos (/quienes-somos/)
├── Programas técnicos (/programas-tecnicos/) → Hub con listado de programas
│   ├── /enfermeria/
│   ├── /cocina/
│   ├── /auxiliar-administrativo/
│   └── [Páginas individuales con slug propio por cada programa]
├── Conocimientos académicos en inglés
├── Validación por ciclos (/validacion/) → Oferta diferenciada (Ciclo 1 a 5)
├── Servicios
├── Contáctanos
├── Trabaja con nosotros
├── Radio institucional
└── Educación virtual (LMS externo / Moodle / Q10)
```

## 3. Patrón estructural de página individual de programa
Cada ficha de curso replica una estructura modular estandarizada:
1. **Encabezado**: Tipo de titulación + Nombre oficial del programa.
2. **Bloque de valor / precios**: Costo de matrícula, facilidades de financiación / beca.
3. **Plan de estudios**: Módulos y asignaturas.
4. **Modalidad y duración**: Presencial / virtual / semipresencial y tiempo estimado.
5. **Formación / Perfil de egreso**: Propósito formativo y competencias desarrolladas.
6. **Campo laboral**: Salidas ocupacionales y sectores donde puede desempeñarse.
7. **Requisitos de ingreso**: Requisitos documentales y académicos.
8. **Bloque "Recuerda"**: Avisos legales, certificaciones y validez institucional.
9. **CTAs finales**: Canal de inscripción / WhatsApp directo + Enlace a plataforma.

## 4. Patrones de conversión y CTAs
- **CTA primario**: Conversión inmediata por WhatsApp con mensaje prellenado por contexto (`https://wa.me/...&text=Hola,%20necesito%20información...`).
- **CTA secundario persistente**: Acceso al campus o sistema académico de estudiantes.
- **Canales segmentados**: Teléfonos de atención, WhatsApp directo, correo específico por área institucional y formulario de inscripción.

---

## 5. Matriz de aplicación para FUNASF

| Componente de Referencia | Aplicación en FUNASF | Restricción / Límite de Propiedad Intelectual |
|---|---|---|
| **Arquitectura de menú** | Menú persistente en [Header.tsx](file:///c:/Users/Maldonado/Documents/Projects/Paginas%20Venta/fundacion/src/components/site/Header.tsx) con acceso a `/estudia` y CTA a WhatsApp y formulario | Respetar las rutas y estética definidas para FUNASF |
| **Hub de oferta académica** | Página `/estudia` enriquecida con filtrado por áreas temáticas y buscador | Solo incluir los 19 programas oficiales de FUNASF |
| **Páginas individuales (`/programas/$slug`)** | Fichas individuales con el patrón modular (perfil, requisitos, becas, aviso legal) | **No copiar textos ni planes de estudio de Elyon Yireh**. Redacción original con datos oficiales FUNASF |
| **Precios y cuotas** | En FUNASF se comunican **Becas de hasta el 90 %** y gratuidad de matrícula en convocatorias aplicables | **Prohibido copiar tarifas de Elyon Yireh**. Valores sujetos a convocatoria oficial |
| **Bloque "Recuerda" (Marco legal)** | Declaración explícita de que la formación, certificación y títulos corresponden a la **institución educativa aliada** | No usurpar reconocimientos que FUNASF no posea directamente |
| **Validación por ciclos** | Ficha dedicada para Validación de Bachillerato por Ciclos | Basada en el convenio o términos que FUNASF defina |
| **Datos pendientes** | Marcar explícitamente con `[PENDIENTE]` duraciones, horarios o requisitos específicos no suministrados | Prohibido inventar datos o completar con información de terceros |
