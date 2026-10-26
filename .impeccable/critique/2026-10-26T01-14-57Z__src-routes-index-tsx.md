---
target: src/routes/index.tsx
total_score: 24
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\Maldonado\\Documents\\Projects\\Paginas Venta\\fundacion\\src\\routes\\index.tsx"
target_fingerprint: "sha256:cf054d970931edbc922ee5ff852c6d6312cabe25f3ab1e2664620557bc08ef85"
target_path: "C:\\Users\\Maldonado\\Documents\\Projects\\Paginas Venta\\fundacion\\src\\routes\\index.tsx"
timestamp: 2026-10-26T01-14-57Z
slug: src-routes-index-tsx
closed: true
---
# Critique Snapshot: src/routes/index.tsx (FUNASF Homepage)
Date: 2026-10-25
Method: dual-agent (A: 3b8775b1-8294-4318-9fa9-059ff412c523 · B: 22f8aa92-c3d9-41b7-add9-5e604781a1b0)

## Design Health Score
Total Score: 24/36 (67%)
Applicable Max: 36 (Heuristic 9 n/a: Error Recovery not applicable to static landing)

| Heuristic | Score | Key Issue |
|---|---|---|
| 1. Visibility of System Status | 3/4 | Buena convocatoria 2026; CTA no anticipa si abre formulario o WhatsApp |
| 2. Match System / Real World | 4/4 | Vocabulario técnico y educativo colombiano preciso |
| 3. User Control and Freedom | 3/4 | Scroll móvil de 8000px sin saltos rápidos o anclas |
| 4. Consistency and Standards | 3/4 | TestimoniosVideoSection no tiene videos ni testimonios |
| 5. Error Prevention | 3/4 | Convivencia entre ruta interna de inscripción y Google Forms |
| 6. Recognition Rather Than Recall | 3/4 | Faltan rangos de inversión o duración visible en fichas |
| 7. Flexibility and Efficiency | 3/4 | Barra sticky móvil efectiva; penalizado por mezclar docentes con aspirantes |
| 8. Aesthetic and Minimalist Design | 2/4 | 20 tarjetas repetitivas en la segunda mitad ("Card Spam") |
| 9. Error Recovery | n/a | No aplicable a landing institucional |
| 10. Help and Documentation | 3/4 | FAQ oportuna y enlace directo a WhatsApp |

## Design Specificity Verdict
Híbrido prometedor con monotonía estructural en la segunda mitad.
La identidad visual huye con éxito de la plantilla SaaS genérica estadounidense ("AI template purple / dark mode glow"). La elección tipográfica de Fraunces + Karla con tonos verde monte (#285d3d), mostaza (#d69d30) y arena (#fbf5ea) confiere un arraigo institucional colombiano auténtico. Sin embargo, a partir de la mitad de la página sucumbe a 4 bloques consecutivos de tarjetas rectangulares idénticas (20 tarjetas en total), restándole dinamismo humano.
El escaneo determinista (15 archivos en src/components/site/home y src/routes/index.tsx) no arrojó infracciones de código de diseño slop.

## Priority Issues
- [P1] Erradicar el 'Card Spam' y fusionar las 4 secciones institucionales redundantes (/impeccable distill)
- [P1] Reubicar el 'Portal Docente' fuera de la superficie de conversión principal (/impeccable clarify)
- [P2] Incorporar la prueba social humana prometida (Rostros y Voces reales) (/impeccable bolder)
- [P3] Enfocar el bloque de cierre (CTA) con jerarquía según el perfil (/impeccable shape)

## Persona Red Flags
- Aspirante joven de bajos recursos: Incertidumbre sobre el costo del 10% restante tras la beca.
- Donante / Empresa aliada: Opciones de patrocinio diluidas en modales secundarios al fondo de la página.
- Usuario móvil en pantalla pequeña (360px): 8000px de scroll vertical continuo con 7 tarjetas de valores apiladas.
