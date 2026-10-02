import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  interpolateHex,
  interpolatePalettes,
  getContrastRatio,
  getWcagBadge,
  deriveExtendedPalette,
  generateCssVariablesCode,
  generateSimilarPalette,
} from "./color-utils";
import { PALETA_ACTUAL, PALETA_SOLICITADA } from "./palette-types";

describe("Color Math & Conversions", () => {
  it("converts hex to RGB correctly for requested palette colors", () => {
    expect(hexToRgb("#667339")).toEqual([102, 115, 57]);
    expect(hexToRgb("#F2F2EB")).toEqual([242, 242, 235]);
    expect(hexToRgb("#F2BD1D")).toEqual([242, 189, 29]);
    expect(hexToRgb("#733119")).toEqual([115, 49, 25]);
    expect(hexToRgb("#F23827")).toEqual([242, 56, 39]);
  });

  it("converts RGB back to hex correctly", () => {
    expect(rgbToHex(102, 115, 57).toLowerCase()).toBe("#667339");
    expect(rgbToHex(242, 242, 235).toLowerCase()).toBe("#f2f2eb");
  });

  it("converts hex to HSL and back with minimal rounding error", () => {
    const [h, s, l] = hexToHsl("#667339");
    expect(h).toBeGreaterThanOrEqual(70);
    expect(h).toBeLessThanOrEqual(75);
    const backToHex = hslToHex(h, s, l);
    const [r1, g1, b1] = hexToRgb("#667339");
    const [r2, g2, b2] = hexToRgb(backToHex);
    expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(2);
    expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(2);
    expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(2);
  });
});

describe("Palette Interpolation (Morphing)", () => {
  it("returns exact source palette at t = 0", () => {
    const interpolated = interpolatePalettes(PALETA_ACTUAL.colors, PALETA_SOLICITADA.colors, 0);
    expect(interpolated.green.toLowerCase()).toBe(PALETA_ACTUAL.colors.green.toLowerCase());
    expect(interpolated.background.toLowerCase()).toBe(
      PALETA_ACTUAL.colors.background.toLowerCase(),
    );
  });

  it("returns exact target palette at t = 1", () => {
    const interpolated = interpolatePalettes(PALETA_ACTUAL.colors, PALETA_SOLICITADA.colors, 1);
    expect(interpolated.green.toLowerCase()).toBe(PALETA_SOLICITADA.colors.green.toLowerCase());
    expect(interpolated.background.toLowerCase()).toBe(
      PALETA_SOLICITADA.colors.background.toLowerCase(),
    );
    expect(interpolated.gold.toLowerCase()).toBe(PALETA_SOLICITADA.colors.gold.toLowerCase());
    expect(interpolated.brown.toLowerCase()).toBe(PALETA_SOLICITADA.colors.brown.toLowerCase());
    expect(interpolated.destructive.toLowerCase()).toBe(
      PALETA_SOLICITADA.colors.destructive.toLowerCase(),
    );
  });

  it("smoothly blends colors at t = 0.5", () => {
    const midGreen = interpolateHex(
      PALETA_ACTUAL.colors.green,
      PALETA_SOLICITADA.colors.green,
      0.5,
    );
    const [rMid] = hexToRgb(midGreen);
    const [rActual] = hexToRgb(PALETA_ACTUAL.colors.green);
    const [rTarget] = hexToRgb(PALETA_SOLICITADA.colors.green);
    expect(rMid).toBe(Math.round((rActual + rTarget) / 2));
  });
});

describe("Token Derivation & WCAG Contrast", () => {
  it("derives all required design tokens from requested core palette", () => {
    const tokens = deriveExtendedPalette(PALETA_SOLICITADA.colors);

    expect(tokens.primary.toLowerCase()).toBe("#667339");
    expect(tokens.brandGreen.toLowerCase()).toBe("#667339");
    expect(tokens.background.toLowerCase()).toBe("#f2f2eb");
    expect(tokens.brandGold.toLowerCase()).toBe("#f2bd1d");
    expect(tokens.brandBrown.toLowerCase()).toBe("#733119");
    expect(tokens.destructive.toLowerCase()).toBe("#f23827");

    // Derived tokens exist and are valid hex/gradients
    expect(tokens.brandGreenDeep).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.brandGreenSoft).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.brandBrownSoft).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.gradientHero).toContain("linear-gradient");
    expect(tokens.gradientSoft).toContain("linear-gradient");
  });

  it("calculates contrast ratio and ensures high readability", () => {
    const tokens = deriveExtendedPalette(PALETA_SOLICITADA.colors);
    const ratio = getContrastRatio(tokens.foreground, tokens.background);
    expect(ratio).toBeGreaterThan(7); // Must pass WCAG AAA (7:1)
    const badge = getWcagBadge(ratio);
    expect(badge.passes).toBe(true);
    expect(badge.label).toBe("AAA");
  });

  it("generates valid CSS variable code", () => {
    const tokens = deriveExtendedPalette(PALETA_SOLICITADA.colors);
    const css = generateCssVariablesCode(tokens, PALETA_SOLICITADA.colors, "Test Palette");
    expect(css).toContain("--primary: #667339");
    expect(css).toContain("--background: #F2F2EB");
    expect(css).toContain("--brand-gold: #F2BD1D");
    expect(css).toContain("--brand-brown: #733119");
    expect(css).toContain("--destructive: #F23827");
    expect(css).toContain("--gradient-hero:");
  });

  it("generates harmonic variations preserving format", () => {
    const variation = generateSimilarPalette(PALETA_SOLICITADA.colors);
    expect(variation.green).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(variation.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(variation.gold).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(variation.brown).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(variation.destructive).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
