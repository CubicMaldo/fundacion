export interface CorePaletteColors {
  /** Verde principal de la marca / Primary (ej. #667339) */
  green: string;
  /** Fondo base cálido de la web / Background (ej. #F2F2EB) */
  background: string;
  /** Dorado / Mostaza / Resaltador de becas y tags (ej. #F2BD1D) */
  gold: string;
  /** Terracota / Marrón noble institucional / Accent (ej. #733119) */
  brown: string;
  /** Bermejo / Acento coral vivo / Destructive / Llamadas a la acción (ej. #F23827) */
  destructive: string;
}

export interface ExtendedPaletteTokens {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;

  /* Tokens de marca FUNASF */
  brandGreen: string;
  brandGreenDeep: string;
  brandGreenSoft: string;
  brandBrown: string;
  brandBrownSoft: string;
  brandSand: string;
  brandGold: string;
  surface: string;
  surfaceStrong: string;

  /* Gradientes */
  gradientHero: string;
  gradientSoft: string;

  /* Gráficos y Sidebar */
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface PresetPalette {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  colors: CorePaletteColors;
  badge?: string;
}

export const PALETA_ACTUAL: PresetPalette = {
  id: "actual",
  name: "Actual FUNASF",
  subtitle: "Esmeralda bosque & fondo marfil",
  description: "La paleta institucional base configurada originalmente en el sistema de diseño.",
  badge: "Original",
  colors: {
    green: "#235D3A",
    background: "#FAF8F5",
    gold: "#D79E2C",
    brown: "#6C4228",
    destructive: "#CA3A25",
  },
};

export const PALETA_SOLICITADA: PresetPalette = {
  id: "solicitada",
  name: "Paleta Solicitada",
  subtitle: "Oliva natural, terracota & crema cálido",
  description:
    "La paleta objetivo (#667339, #F2F2EB, #F2BD1D, #733119, #F23827) con armonía orgánica y editorial.",
  badge: "Objetivo",
  colors: {
    green: "#667339",
    background: "#F2F2EB",
    gold: "#F2BD1D",
    brown: "#733119",
    destructive: "#F23827",
  },
};

export const PALETAS_VARIACIONES: PresetPalette[] = [
  PALETA_ACTUAL,
  PALETA_SOLICITADA,
  {
    id: "tierra-silvestre",
    name: "Tierra Silvestre",
    subtitle: "Oliva musgo & arcilla tostada",
    description: "Tonos más profundos de vegetación nativa con acento óxido terroso.",
    colors: {
      green: "#566930",
      background: "#F4F3EA",
      gold: "#EAA816",
      brown: "#823719",
      destructive: "#E2371F",
    },
  },
  {
    id: "mediterraneo-rustico",
    name: "Mediterráneo Rústico",
    subtitle: "Olivo cenizo & teja antigua",
    description: "Un verde olivo más suave y desaturado con fondo cálido luminoso y teja colonial.",
    colors: {
      green: "#727E47",
      background: "#F5F4EE",
      gold: "#F5B822",
      brown: "#7A361E",
      destructive: "#ED4532",
    },
  },
  {
    id: "herbario-otono",
    name: "Herbario de Otoño",
    subtitle: "Salvia seca & ámbar profundo",
    description: "Equilibrio entre verde hierba seca, marrón nogal y notas de miel pura.",
    colors: {
      green: "#5D6C38",
      background: "#F0EFE6",
      gold: "#F8C82B",
      brown: "#662A14",
      destructive: "#EA301D",
    },
  },
  {
    id: "bosque-andino",
    name: "Bosque Andino",
    subtitle: "Laurel profundo & caoba tierra",
    description: "Mayor contraste institucional con verde laurel denso y fondo lino limpio.",
    colors: {
      green: "#4E5E2A",
      background: "#F7F6F1",
      gold: "#F2BF26",
      brown: "#6D2E16",
      destructive: "#DF321E",
    },
  },
  {
    id: "sol-y-trigo",
    name: "Sol & Trigo",
    subtitle: "Oliva dorado & canela cálida",
    description: "Toque más soleado con presencia luminosa del dorado mostaza y marrón canela.",
    colors: {
      green: "#6E7736",
      background: "#FAF9F2",
      gold: "#E9A312",
      brown: "#893F21",
      destructive: "#F34D35",
    },
  },
  {
    id: "enebro-editorial",
    name: "Enebro Editorial",
    subtitle: "Verde mate & ocre sofisticado",
    description: "Estilo revista académica internacional: tono mate muy legible y balanceado.",
    colors: {
      green: "#58653A",
      background: "#EEEDE4",
      gold: "#F6BD1B",
      brown: "#783318",
      destructive: "#EE3A25",
    },
  },
];
