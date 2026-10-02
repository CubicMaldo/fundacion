import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Palette,
  RotateCcw,
  Sliders,
  Copy,
  Check,
  Eye,
  X,
  Sparkles,
  SlidersHorizontal,
  Contrast,
  Code2,
  BookmarkCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  PALETA_ACTUAL,
  PALETA_SOLICITADA,
  PALETAS_VARIACIONES,
  type CorePaletteColors,
  type PresetPalette,
} from "./palette-types";
import {
  deriveExtendedPalette,
  applyPaletteToCss,
  clearPaletteFromCss,
  interpolatePalettes,
  generateCssVariablesCode,
  generateSimilarPalette,
  getContrastRatio,
  getWcagBadge,
} from "./color-utils";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const STORAGE_KEY = "funasf_dev_palette_state_v1";

interface SavedPaletteState {
  activePresetId: string;
  morphPercent: number;
  coreColors: CorePaletteColors;
  isCustomized: boolean;
  isOpen: boolean;
}

export function DevPaletteStudio() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"morph" | "presets" | "custom" | "export">("morph");
  const [activePresetId, setActivePresetId] = useState<string>("solicitada");
  const [morphPercent, setMorphPercent] = useState<number>(100);
  const [coreColors, setCoreColors] = useState<CorePaletteColors>(PALETA_SOLICITADA.colors);
  const [isCustomized, setIsCustomized] = useState(false);
  const [isComparingOriginal, setIsComparingOriginal] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Derivación de los tokens extendidos
  const extendedTokens = useMemo(() => {
    return deriveExtendedPalette(coreColors);
  }, [coreColors]);

  // Aplicar colores al DOM cuando cambian
  useEffect(() => {
    if (!mounted) return;
    if (isComparingOriginal) {
      clearPaletteFromCss();
    } else {
      applyPaletteToCss(extendedTokens);
    }
  }, [extendedTokens, isComparingOriginal, mounted]);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: SavedPaletteState = JSON.parse(raw);
        if (parsed.coreColors) {
          setCoreColors(parsed.coreColors);
          setActivePresetId(parsed.activePresetId || "solicitada");
          setMorphPercent(typeof parsed.morphPercent === "number" ? parsed.morphPercent : 100);
          setIsCustomized(Boolean(parsed.isCustomized));
          setIsOpen(Boolean(parsed.isOpen));
          applyPaletteToCss(deriveExtendedPalette(parsed.coreColors));
          return;
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar la paleta guardada de dev:", e);
    }

    // Por defecto en la primera carga en dev: aplicamos la paleta solicitada para que el usuario la vea de inmediato
    applyPaletteToCss(deriveExtendedPalette(PALETA_SOLICITADA.colors));
  }, []);

  // Guardar en localStorage al cambiar estado
  useEffect(() => {
    if (!mounted) return;
    try {
      const stateToSave: SavedPaletteState = {
        activePresetId,
        morphPercent,
        coreColors,
        isCustomized,
        isOpen,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignorar errores de quota en localStorage
    }
  }, [activePresetId, morphPercent, coreColors, isCustomized, isOpen, mounted]);

  // Atajo de teclado: Alt + P para alternar el panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Manejar cambio en el slider Morph (A <-> B)
  const handleMorphChange = useCallback((value: number[]) => {
    const pct = value[0] ?? 0;
    setMorphPercent(pct);
    const interpolated = interpolatePalettes(
      PALETA_ACTUAL.colors,
      PALETA_SOLICITADA.colors,
      pct / 100,
    );
    setCoreColors(interpolated);
    setIsCustomized(pct > 0 && pct < 100);
    if (pct === 0) {
      setActivePresetId("actual");
    } else if (pct === 100) {
      setActivePresetId("solicitada");
    } else {
      setActivePresetId("morph");
    }
  }, []);

  // Aplicar un preset predefinido
  const handleSelectPreset = useCallback((preset: PresetPalette) => {
    setActivePresetId(preset.id);
    setCoreColors(preset.colors);
    setIsCustomized(false);
    if (preset.id === "actual") {
      setMorphPercent(0);
    } else if (preset.id === "solicitada") {
      setMorphPercent(100);
    }
    toast.success(`Paleta "${preset.name}" aplicada`);
  }, []);

  // Cambiar un color específico manualmente
  const handleCustomColorChange = useCallback((key: keyof CorePaletteColors, value: string) => {
    setCoreColors((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsCustomized(true);
    setActivePresetId("custom");
  }, []);

  // Generar una variación aleatoria armónica
  const handleGenerateSimilar = useCallback(() => {
    const similar = generateSimilarPalette(coreColors);
    setCoreColors(similar);
    setIsCustomized(true);
    setActivePresetId("custom-similar");
    toast.info("Variación armónica generada");
  }, [coreColors]);

  // Restablecer al original
  const handleResetToOriginal = useCallback(() => {
    clearPaletteFromCss();
    setCoreColors(PALETA_ACTUAL.colors);
    setActivePresetId("actual");
    setMorphPercent(0);
    setIsCustomized(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_ignored) {
      // Ignorar errores al acceder a localStorage
    }
    toast.success("Restablecido al diseño original de FUNASF");
  }, []);

  // Copiar CSS al portapapeles
  const handleCopyCss = useCallback(() => {
    const currentName =
      PALETAS_VARIACIONES.find((p) => p.id === activePresetId)?.name ||
      (activePresetId === "morph"
        ? `Transición al ${morphPercent}%`
        : isCustomized
          ? "Paleta Personalizada"
          : "Paleta Solicitada");
    const code = generateCssVariablesCode(extendedTokens, coreColors, currentName);
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCss(true);
      toast.success("Código CSS copiado al portapapeles");
      setTimeout(() => setCopiedCss(false), 2200);
    });
  }, [extendedTokens, coreColors, activePresetId, morphPercent, isCustomized]);

  // Copiar JSON
  const handleCopyJson = useCallback(() => {
    const json = JSON.stringify(coreColors, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopiedJson(true);
      toast.success("Valores JSON copiados al portapapeles");
      setTimeout(() => setCopiedJson(false), 2200);
    });
  }, [coreColors]);

  // Ratios de accesibilidad
  const contrastTextBg = useMemo(
    () => getContrastRatio(extendedTokens.foreground, extendedTokens.background),
    [extendedTokens.foreground, extendedTokens.background],
  );
  const wcagTextBg = useMemo(() => getWcagBadge(contrastTextBg), [contrastTextBg]);

  const contrastBtnText = useMemo(
    () => getContrastRatio(extendedTokens.primaryForeground, extendedTokens.primary),
    [extendedTokens.primaryForeground, extendedTokens.primary],
  );
  const wcagBtnText = useMemo(() => getWcagBadge(contrastBtnText), [contrastBtnText]);

  if (!mounted) return null;

  return (
    <>
      {/* Botón flotante minimizado */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            title="Abrir Iterador de Paleta (Alt + P)"
            className="group flex items-center gap-2.5 rounded-full border border-zinc-300/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-zinc-800 shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-zinc-400 hover:shadow-2xl dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-100"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Palette className="size-3.5 transition-transform group-hover:rotate-12" />
            </span>
            <span className="font-medium">
              {activePresetId === "solicitada"
                ? "Paleta Solicitada (#667339)"
                : activePresetId === "actual"
                  ? "Paleta Actual"
                  : activePresetId === "morph"
                    ? `Morph ${morphPercent}%`
                    : "Paleta Personalizada"}
            </span>
            <div className="flex items-center -space-x-1 pl-1">
              <span
                className="size-3 rounded-full ring-1 ring-white/80 shadow-xs"
                style={{ backgroundColor: coreColors.green }}
              />
              <span
                className="size-3 rounded-full ring-1 ring-white/80 shadow-xs"
                style={{ backgroundColor: coreColors.gold }}
              />
              <span
                className="size-3 rounded-full ring-1 ring-white/80 shadow-xs"
                style={{ backgroundColor: coreColors.brown }}
              />
              <span
                className="size-3 rounded-full ring-1 ring-white/80 shadow-xs"
                style={{ backgroundColor: coreColors.destructive }}
              />
            </div>
            <kbd className="hidden rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 sm:inline dark:bg-zinc-800 dark:text-zinc-400">
              Alt+P
            </kbd>
          </button>
        </div>
      )}

      {/* Modal / Estudio de Paletas Flotante */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Herramienta de desarrollo de paleta de colores"
          className="fixed bottom-4 right-4 z-[9999] flex w-[calc(100vw-2rem)] sm:w-[500px] max-h-[88vh] flex-col overflow-hidden rounded-2xl border border-zinc-300/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 text-zinc-900 dark:text-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Barra superior / Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400">
                <Palette className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold leading-none tracking-tight flex items-center gap-1.5">
                  Estudio de Paletas (Dev)
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                    En vivo
                  </span>
                </h2>
                <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Previsualiza y afina la nueva gama de color en tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Botón ver original temporalmente */}
              <button
                type="button"
                onMouseDown={() => setIsComparingOriginal(true)}
                onMouseUp={() => setIsComparingOriginal(false)}
                onTouchStart={() => setIsComparingOriginal(true)}
                onTouchEnd={() => setIsComparingOriginal(false)}
                title="Mantén presionado para ver la paleta original"
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  isComparingOriginal
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Eye className="size-3.5" />
                <span className="text-[11px]">Original</span>
              </button>

              {/* Botón restablecer */}
              <button
                type="button"
                onClick={handleResetToOriginal}
                title="Restablecer a la paleta original y borrar memoria"
                className="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <RotateCcw className="size-3.5" />
              </button>

              {/* Botón cerrar / minimizar */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimizar (Alt + P)"
                className="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Muestrario de los 5 colores activos */}
          <div className="border-b border-zinc-200/70 px-4 py-2.5 dark:border-zinc-800/80 bg-zinc-100/40 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span>Colores activos en el sitio:</span>
              <span className="font-mono text-[10px] text-zinc-400">
                {isComparingOriginal ? "Viendo Original..." : activePresetId}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="size-7 w-full rounded-md shadow-xs ring-1 ring-black/10"
                  style={{ backgroundColor: coreColors.green }}
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  {coreColors.green}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Verde</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="size-7 w-full rounded-md shadow-xs ring-1 ring-black/10"
                  style={{ backgroundColor: coreColors.background }}
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  {coreColors.background}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Fondo</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="size-7 w-full rounded-md shadow-xs ring-1 ring-black/10"
                  style={{ backgroundColor: coreColors.gold }}
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  {coreColors.gold}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Dorado</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="size-7 w-full rounded-md shadow-xs ring-1 ring-black/10"
                  style={{ backgroundColor: coreColors.brown }}
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  {coreColors.brown}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Marrón</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="size-7 w-full rounded-md shadow-xs ring-1 ring-black/10"
                  style={{ backgroundColor: coreColors.destructive }}
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  {coreColors.destructive}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Bermejo</span>
              </div>
            </div>
          </div>

          {/* Pestañas principales */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "morph" | "presets" | "custom" | "export")}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="px-4 pt-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70">
              <TabsList className="grid grid-cols-4 w-full h-8 bg-zinc-200/60 dark:bg-zinc-900/90 p-0.5">
                <TabsTrigger
                  value="morph"
                  className="text-xs gap-1 py-1 data-[state=active]:font-bold"
                >
                  <Sliders className="size-3" /> Morph
                </TabsTrigger>
                <TabsTrigger
                  value="presets"
                  className="text-xs gap-1 py-1 data-[state=active]:font-bold"
                >
                  <Palette className="size-3" /> Paletas
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="text-xs gap-1 py-1 data-[state=active]:font-bold"
                >
                  <SlidersHorizontal className="size-3" /> Ajustes
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="text-xs gap-1 py-1 data-[state=active]:font-bold"
                >
                  <Code2 className="size-3" /> Exportar
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Contenedor scrolleable del contenido */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
              {/* TAB 1: MORPH (Interpolación suave Actual <-> Solicitada) */}
              <TabsContent value="morph" className="m-0 space-y-4 focus-visible:outline-none">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Transición suave: Actual ↔ Solicitada
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {morphPercent}%
                    </span>
                  </div>

                  {/* Slider interactivo */}
                  <div className="py-2">
                    <Slider
                      value={[morphPercent]}
                      onValueChange={handleMorphChange}
                      min={0}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Barra de degradado de referencia */}
                  <div className="mt-2 h-3 w-full rounded-full ring-1 ring-black/10 overflow-hidden flex">
                    <div
                      className="h-full flex-1"
                      style={{
                        background: `linear-gradient(to right, ${PALETA_ACTUAL.colors.green}, ${PALETA_SOLICITADA.colors.green})`,
                      }}
                    />
                  </div>

                  {/* Botones de porcentaje rápido */}
                  <div className="mt-3 flex items-center justify-between gap-1.5">
                    {[
                      { label: "0% Actual", val: 0 },
                      { label: "25%", val: 25 },
                      { label: "50% Mitad", val: 50 },
                      { label: "75%", val: 75 },
                      { label: "100% Solicitada", val: 100 },
                    ].map((step) => (
                      <button
                        key={step.val}
                        onClick={() => handleMorphChange([step.val])}
                        className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                          morphPercent === step.val
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                            : "bg-white text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comparación directa de las dos paletas */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Paleta Actual */}
                  <div
                    onClick={() => handleMorphChange([0])}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      morphPercent === 0
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        Actual FUNASF
                      </span>
                      {morphPercent === 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Activa
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mb-2">
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_ACTUAL.colors.green }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_ACTUAL.colors.background }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_ACTUAL.colors.gold }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_ACTUAL.colors.brown }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_ACTUAL.colors.destructive }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Verde esmeralda y marrón oscuro original.
                    </p>
                  </div>

                  {/* Paleta Solicitada */}
                  <div
                    onClick={() => handleMorphChange([100])}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      morphPercent === 100
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Solicitada</span>
                      {morphPercent === 100 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Activa
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mb-2">
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_SOLICITADA.colors.green }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_SOLICITADA.colors.background }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_SOLICITADA.colors.gold }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_SOLICITADA.colors.brown }}
                      />
                      <span
                        className="size-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: PALETA_SOLICITADA.colors.destructive }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      #667339 oliva, #F2F2EB crema, terracota #733119.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <Info className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Mueve el slider para explorar cualquier gradación intermedia entre el sitio
                    actual y la nueva propuesta.
                  </span>
                </div>
              </TabsContent>

              {/* TAB 2: PALETAS PREDISEÑADAS (Presets con tonos parecidos) */}
              <TabsContent value="presets" className="m-0 space-y-2.5 focus-visible:outline-none">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 pb-1">
                  Selecciona cualquiera de las paletas curadas con tonos cálidos y botánicos:
                </div>

                <div className="grid gap-2">
                  {PALETAS_VARIACIONES.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500 shadow-sm"
                            : "border-zinc-200 hover:border-zinc-300 bg-white/70 dark:bg-zinc-900/60 dark:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {preset.name}
                            </span>
                            {preset.badge && (
                              <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {preset.badge}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <BookmarkCheck className="size-3.5" /> Activa
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {preset.subtitle}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between">
                          {/* Muestras de los 5 colores */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="size-5 rounded-full shadow-xs ring-1 ring-black/10"
                              title={`Verde: ${preset.colors.green}`}
                              style={{ backgroundColor: preset.colors.green }}
                            />
                            <span
                              className="size-5 rounded-full shadow-xs ring-1 ring-black/10"
                              title={`Fondo: ${preset.colors.background}`}
                              style={{ backgroundColor: preset.colors.background }}
                            />
                            <span
                              className="size-5 rounded-full shadow-xs ring-1 ring-black/10"
                              title={`Dorado: ${preset.colors.gold}`}
                              style={{ backgroundColor: preset.colors.gold }}
                            />
                            <span
                              className="size-5 rounded-full shadow-xs ring-1 ring-black/10"
                              title={`Marrón: ${preset.colors.brown}`}
                              style={{ backgroundColor: preset.colors.brown }}
                            />
                            <span
                              className="size-5 rounded-full shadow-xs ring-1 ring-black/10"
                              title={`Bermejo: ${preset.colors.destructive}`}
                              style={{ backgroundColor: preset.colors.destructive }}
                            />
                          </div>

                          <span className="text-[11px] font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 dark:text-emerald-400">
                            Aplicar <ChevronRight className="size-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* TAB 3: AJUSTE FINO (Color Pickers) */}
              <TabsContent value="custom" className="m-0 space-y-4 focus-visible:outline-none">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Edita individualmente cualquiera de los 5 colores:
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateSimilar}
                    className="flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Sparkles className="size-3 text-amber-500" /> Variación armónica
                  </button>
                </div>

                {/* 5 inputs de color */}
                <div className="space-y-2.5">
                  {[
                    {
                      key: "green" as const,
                      label: "Verde Principal (Brand Green / Primary)",
                      desc: "Encabezados, botones principales, logos y acentos",
                    },
                    {
                      key: "background" as const,
                      label: "Fondo Base (Background / Sand)",
                      desc: "Superficie de la página, tarjetas secundarias y contraste",
                    },
                    {
                      key: "gold" as const,
                      label: "Dorado / Mostaza (Brand Gold)",
                      desc: "Etiquetas de becas, highlights y botones con variante gold",
                    },
                    {
                      key: "brown" as const,
                      label: "Terracota / Marrón (Brand Brown / Accent)",
                      desc: "Eyebrows, citas, detalles artesanales y bordes suaves",
                    },
                    {
                      key: "destructive" as const,
                      label: "Bermejo / Coral (Destructive / Hero CTA)",
                      desc: "Botones de alerta, llamadas de alta visibilidad y tags de cupos",
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <label className="relative flex size-8 cursor-pointer items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700 overflow-hidden shadow-xs">
                          <input
                            type="color"
                            value={coreColors[field.key]}
                            onChange={(e) => handleCustomColorChange(field.key, e.target.value)}
                            className="absolute -inset-2 size-12 cursor-pointer opacity-0"
                          />
                          <span
                            className="size-full rounded-md"
                            style={{ backgroundColor: coreColors[field.key] }}
                          />
                        </label>
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {field.label}
                          </div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {field.desc}
                          </div>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={coreColors[field.key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v.startsWith("#") && v.length <= 7) {
                            handleCustomColorChange(field.key, v);
                          }
                        }}
                        className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  ))}
                </div>

                {/* Medidor de contraste y accesibilidad WCAG */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    <Contrast className="size-3.5" />
                    <span>Verificación de Contraste WCAG 2.1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white p-2.5 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Texto vs Fondo
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono font-bold">{wcagTextBg.score}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            wcagTextBg.passes
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {wcagTextBg.label}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-white p-2.5 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Botón Verde vs Texto
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono font-bold">{wcagBtnText.score}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            wcagBtnText.passes
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {wcagBtnText.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: EXPORTAR CSS */}
              <TabsContent value="export" className="m-0 space-y-3.5 focus-visible:outline-none">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Copia el código CSS con todas las variables calculadas para guardarlo
                  definitivamente en <code className="font-mono font-semibold">src/styles.css</code>
                  :
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCss}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 px-3 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    {copiedCss ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copiedCss ? "¡Copiado a styles.css!" : "Copiar bloque CSS"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 py-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {copiedJson ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>JSON</span>
                  </button>
                </div>

                <div className="relative rounded-xl border border-zinc-200 bg-zinc-950 p-3 text-[11px] font-mono text-zinc-200 max-h-48 overflow-y-auto dark:border-zinc-800">
                  <pre className="whitespace-pre">
                    {generateCssVariablesCode(
                      extendedTokens,
                      coreColors,
                      PALETAS_VARIACIONES.find((p) => p.id === activePresetId)?.name ||
                        "Paleta Personalizada",
                    )}
                  </pre>
                </div>
              </TabsContent>
            </div>

            {/* Barra de pie con atajo y estado */}
            <div className="border-t border-zinc-200/70 px-4 py-2 text-[10px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-900/60 flex items-center justify-between">
              <span>Solo visible en entorno de desarrollo</span>
              <span>
                Presiona <kbd className="font-mono font-semibold">Alt + P</kbd> para minimizar
              </span>
            </div>
          </Tabs>
        </aside>
      )}
    </>
  );
}
