import type { CorePaletteColors, ExtendedPaletteTokens } from "./palette-types";

export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [r, g, b]
      .map((x) => clamp(x).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  h /= 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

/** Interpolación suave entre dos colores hex en espacio sRGB ponderado */
export function interpolateHex(hexA: string, hexB: string, t: number): string {
  const clampedT = Math.max(0, Math.min(1, t));
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const r = Math.round(r1 + (r2 - r1) * clampedT);
  const g = Math.round(g1 + (g2 - g1) * clampedT);
  const b = Math.round(b1 + (b2 - b1) * clampedT);
  return rgbToHex(r, g, b);
}

/** Interpola entre dos paletas completas para el slider morph (0 = paleta A, 1 = paleta B) */
export function interpolatePalettes(
  paletteA: CorePaletteColors,
  paletteB: CorePaletteColors,
  t: number,
): CorePaletteColors {
  return {
    green: interpolateHex(paletteA.green, paletteB.green, t),
    background: interpolateHex(paletteA.background, paletteB.background, t),
    gold: interpolateHex(paletteA.gold, paletteB.gold, t),
    brown: interpolateHex(paletteA.brown, paletteB.brown, t),
    destructive: interpolateHex(paletteA.destructive, paletteB.destructive, t),
  };
}

/** Luminancia relativa según especificación WCAG 2.1 */
export function getLuminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste entre dos colores (ej. 4.5:1) */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWcagBadge(ratio: number): {
  label: "AAA" | "AA" | "AA (Texto grande)" | "Bajo";
  passes: boolean;
  score: string;
} {
  const formatted = ratio.toFixed(2) + ":1";
  if (ratio >= 7.0) {
    return { label: "AAA", passes: true, score: formatted };
  }
  if (ratio >= 4.5) {
    return { label: "AA", passes: true, score: formatted };
  }
  if (ratio >= 3.0) {
    return { label: "AA (Texto grande)", passes: true, score: formatted };
  }
  return { label: "Bajo", passes: false, score: formatted };
}

/** Deriva todo el sistema de tokens de diseño institucional a partir de los 5 colores base */
export function deriveExtendedPalette(core: CorePaletteColors): ExtendedPaletteTokens {
  const [gh, gs, gl] = hexToHsl(core.green);
  const [bh, bs, bl] = hexToHsl(core.background);
  const [rh, rs] = hexToHsl(core.brown);

  // Variantes del verde
  const brandGreen = core.green;
  const brandGreenDeep = hslToHex(gh, Math.min(100, gs + 6), Math.max(12, Math.round(gl * 0.52)));
  const brandGreenSoft = hslToHex(gh, Math.min(32, Math.round(gs * 0.65)), 95);

  // Variantes del marrón / terracota
  const brandBrown = core.brown;
  const brandBrownSoft = hslToHex(rh, Math.min(35, Math.round(rs * 0.55)), 94);

  // Superficies y bordes
  const background = core.background;
  const brandSand = core.background;
  const brandGold = core.gold;

  // Texto foreground sobre el fondo base (asegura contraste superior a 10:1)
  const foreground = hslToHex(
    bh,
    Math.min(35, Math.round(bs * 1.2)),
    Math.max(8, Math.min(16, 100 - bl * 0.9)),
  );
  const card = "#FFFFFF";
  const cardForeground = foreground;
  const popover = "#FFFFFF";
  const popoverForeground = foreground;

  // Contraste para primary
  const primaryLightText = "#FAF8F5";
  const primaryDarkText = "#1A2211";
  const primaryForeground =
    getContrastRatio(core.green, primaryLightText) >= 4.2 ? primaryLightText : primaryDarkText;

  // Secundario y acento
  const secondary = hslToHex(bh, Math.min(28, bs), Math.max(88, bl - 4));
  const secondaryForeground = hslToHex(rh, Math.min(65, rs), 26);
  const muted = hslToHex(bh, Math.min(25, bs), Math.max(90, bl - 3));
  const mutedForeground = hslToHex(bh, Math.min(25, bs), 38);

  const accent = core.brown;
  const accentForeground = "#FAF8F5";

  const destructive = core.destructive;
  const destructiveForeground = "#FFFFFF";

  const border = hslToHex(bh, Math.min(25, bs), Math.max(82, bl - 8));
  const input = border;
  const ring = core.green;

  const surface = hslToHex(bh, Math.min(25, bs), Math.max(92, bl - 2));
  const surfaceStrong = hslToHex(bh, Math.min(28, bs), Math.max(88, bl - 5));

  // Gradientes institucionales
  const gradientHero = `linear-gradient(135deg, ${brandGreenDeep} 0%, ${brandGreen} 62%, ${brandBrown} 100%)`;
  const gradientSoft = `linear-gradient(160deg, ${background} 0%, ${brandGreenSoft} 100%)`;

  return {
    primary: brandGreen,
    primaryForeground,
    secondary,
    secondaryForeground,
    background,
    foreground,
    card,
    cardForeground,
    popover,
    popoverForeground,
    muted,
    mutedForeground,
    accent,
    accentForeground,
    destructive,
    destructiveForeground,
    border,
    input,
    ring,

    brandGreen,
    brandGreenDeep,
    brandGreenSoft,
    brandBrown,
    brandBrownSoft,
    brandSand,
    brandGold,
    surface,
    surfaceStrong,

    gradientHero,
    gradientSoft,

    chart1: brandGreen,
    chart2: brandBrown,
    chart3: brandGold,
    chart4: brandGreenDeep,
    chart5: destructive,

    sidebar: surface,
    sidebarForeground: foreground,
    sidebarPrimary: brandGreen,
    sidebarPrimaryForeground: primaryForeground,
    sidebarAccent: brandGreenSoft,
    sidebarAccentForeground: brandGreenDeep,
    sidebarBorder: border,
    sidebarRing: ring,
  };
}

/** Mapa de nombres de CSS custom properties que se inyectan en document.documentElement */
export const CSS_VARIABLE_MAP: Array<{ key: keyof ExtendedPaletteTokens; cssVar: string }> = [
  { key: "background", cssVar: "--background" },
  { key: "foreground", cssVar: "--foreground" },
  { key: "card", cssVar: "--card" },
  { key: "cardForeground", cssVar: "--card-foreground" },
  { key: "popover", cssVar: "--popover" },
  { key: "popoverForeground", cssVar: "--popover-foreground" },
  { key: "primary", cssVar: "--primary" },
  { key: "primaryForeground", cssVar: "--primary-foreground" },
  { key: "secondary", cssVar: "--secondary" },
  { key: "secondaryForeground", cssVar: "--secondary-foreground" },
  { key: "muted", cssVar: "--muted" },
  { key: "mutedForeground", cssVar: "--muted-foreground" },
  { key: "accent", cssVar: "--accent" },
  { key: "accentForeground", cssVar: "--accent-foreground" },
  { key: "destructive", cssVar: "--destructive" },
  { key: "destructiveForeground", cssVar: "--destructive-foreground" },
  { key: "border", cssVar: "--border" },
  { key: "input", cssVar: "--input" },
  { key: "ring", cssVar: "--ring" },

  /* Marca FUNASF */
  { key: "brandGreen", cssVar: "--brand-green" },
  { key: "brandGreenDeep", cssVar: "--brand-green-deep" },
  { key: "brandGreenSoft", cssVar: "--brand-green-soft" },
  { key: "brandBrown", cssVar: "--brand-brown" },
  { key: "brandBrownSoft", cssVar: "--brand-brown-soft" },
  { key: "brandSand", cssVar: "--brand-sand" },
  { key: "brandGold", cssVar: "--brand-gold" },
  { key: "surface", cssVar: "--surface" },
  { key: "surfaceStrong", cssVar: "--surface-strong" },

  /* Gradientes */
  { key: "gradientHero", cssVar: "--gradient-hero" },
  { key: "gradientSoft", cssVar: "--gradient-soft" },

  /* Charts y Sidebar */
  { key: "chart1", cssVar: "--chart-1" },
  { key: "chart2", cssVar: "--chart-2" },
  { key: "chart3", cssVar: "--chart-3" },
  { key: "chart4", cssVar: "--chart-4" },
  { key: "chart5", cssVar: "--chart-5" },
  { key: "sidebar", cssVar: "--sidebar" },
  { key: "sidebarForeground", cssVar: "--sidebar-foreground" },
  { key: "sidebarPrimary", cssVar: "--sidebar-primary" },
  { key: "sidebarPrimaryForeground", cssVar: "--sidebar-primary-foreground" },
  { key: "sidebarAccent", cssVar: "--sidebar-accent" },
  { key: "sidebarAccentForeground", cssVar: "--sidebar-accent-foreground" },
  { key: "sidebarBorder", cssVar: "--sidebar-border" },
  { key: "sidebarRing", cssVar: "--sidebar-ring" },
];

/** Aplica los tokens directamente al elemento raíz del documento */
export function applyPaletteToCss(tokens: ExtendedPaletteTokens): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const { key, cssVar } of CSS_VARIABLE_MAP) {
    const val = tokens[key];
    if (val) {
      root.style.setProperty(cssVar, val);
    }
  }
}

/** Limpia las variables personalizadas devolviendo los estilos por defecto del archivo styles.css */
export function clearPaletteFromCss(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const { cssVar } of CSS_VARIABLE_MAP) {
    root.style.removeProperty(cssVar);
  }
}

/** Genera el bloque CSS para pegar en styles.css */
export function generateCssVariablesCode(
  tokens: ExtendedPaletteTokens,
  core: CorePaletteColors,
  paletteTitle: string = "Paleta Personalizada",
): string {
  return `/* =========================================================================
 * FUNASF — ${paletteTitle}
 * Paleta clave:
 *   - Verde principal:   ${core.green}
 *   - Fondo cálido:       ${core.background}
 *   - Dorado / Mostaza:   ${core.gold}
 *   - Terracota / Marrón: ${core.brown}
 *   - Bermejo / Acento:   ${core.destructive}
 * ========================================================================= */

:root {
  --radius: 0.5rem;

  --background: ${tokens.background};
  --foreground: ${tokens.foreground};

  --card: ${tokens.card};
  --card-foreground: ${tokens.cardForeground};
  --popover: ${tokens.popover};
  --popover-foreground: ${tokens.popoverForeground};

  --primary: ${tokens.primary};
  --primary-foreground: ${tokens.primaryForeground};

  --secondary: ${tokens.secondary};
  --secondary-foreground: ${tokens.secondaryForeground};

  --muted: ${tokens.muted};
  --muted-foreground: ${tokens.mutedForeground};

  --accent: ${tokens.accent};
  --accent-foreground: ${tokens.accentForeground};

  --destructive: ${tokens.destructive};
  --destructive-foreground: ${tokens.destructiveForeground};

  --border: ${tokens.border};
  --input: ${tokens.input};
  --ring: ${tokens.ring};

  /* Marca FUNASF */
  --brand-green: ${tokens.brandGreen};
  --brand-green-deep: ${tokens.brandGreenDeep};
  --brand-green-soft: ${tokens.brandGreenSoft};
  --brand-brown: ${tokens.brandBrown};
  --brand-brown-soft: ${tokens.brandBrownSoft};
  --brand-sand: ${tokens.brandSand};
  --brand-gold: ${tokens.brandGold};
  --surface: ${tokens.surface};
  --surface-strong: ${tokens.surfaceStrong};

  --gradient-hero: ${tokens.gradientHero};
  --gradient-soft: ${tokens.gradientSoft};

  --chart-1: ${tokens.chart1};
  --chart-2: ${tokens.chart2};
  --chart-3: ${tokens.chart3};
  --chart-4: ${tokens.chart4};
  --chart-5: ${tokens.chart5};

  --sidebar: ${tokens.sidebar};
  --sidebar-foreground: ${tokens.sidebarForeground};
  --sidebar-primary: ${tokens.sidebarPrimary};
  --sidebar-primary-foreground: ${tokens.sidebarPrimaryForeground};
  --sidebar-accent: ${tokens.sidebarAccent};
  --sidebar-accent-foreground: ${tokens.sidebarAccentForeground};
  --sidebar-border: ${tokens.sidebarBorder};
  --sidebar-ring: ${tokens.sidebarRing};
}`;
}

/** Genera una variación aleatoria armónica similar alrededor de la paleta dada */
export function generateSimilarPalette(base: CorePaletteColors): CorePaletteColors {
  const shiftHue = (
    hex: string,
    deltaDeg: number,
    deltaSat: number = 0,
    deltaLight: number = 0,
  ) => {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(
      (h + deltaDeg + 360) % 360,
      Math.max(10, Math.min(100, s + deltaSat)),
      Math.max(10, Math.min(96, l + deltaLight)),
    );
  };

  const rnd = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

  // Variaciones sutiles que mantienen la identidad estética cálida, botánica y terrosa
  const greenShiftH = rnd(-10, 10);
  const greenShiftS = rnd(-8, 8);
  const brownShiftH = rnd(-8, 8);
  const goldShiftH = rnd(-6, 6);

  return {
    green: shiftHue(base.green, greenShiftH, greenShiftS, rnd(-3, 3)),
    background: shiftHue(base.background, rnd(-4, 4), rnd(-3, 3), rnd(-2, 1)),
    gold: shiftHue(base.gold, goldShiftH, rnd(-5, 5), rnd(-3, 3)),
    brown: shiftHue(base.brown, brownShiftH, rnd(-6, 6), rnd(-3, 3)),
    destructive: shiftHue(base.destructive, rnd(-6, 6), rnd(-5, 5), rnd(-3, 3)),
  };
}
