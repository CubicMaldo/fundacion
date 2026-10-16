import { describe, it, expect } from "vitest";
import {
  validarRangoNota,
  validarMallaPorcentajes,
  calcularNotaDefinitiva,
  type ComponenteEvaluacion,
} from "./academico";

describe("Validación y Cálculos del Sistema Académico FUNASF", () => {
  describe("validarRangoNota", () => {
    it("debe aceptar notas válidas en la escala colombiana de 0.0 a 5.0", () => {
      expect(validarRangoNota(0.0)).toBe(true);
      expect(validarRangoNota(3.0)).toBe(true);
      expect(validarRangoNota(4.5)).toBe(true);
      expect(validarRangoNota(5.0)).toBe(true);
    });

    it("debe rechazar notas fuera del rango o inválidas", () => {
      expect(validarRangoNota(-0.1)).toBe(false);
      expect(validarRangoNota(5.1)).toBe(false);
      expect(validarRangoNota(10)).toBe(false);
      expect(validarRangoNota(NaN)).toBe(false);
    });
  });

  describe("validarMallaPorcentajes", () => {
    it("debe validar correctamente mallas que suman exactamente 100%", () => {
      const componentes = [
        { porcentaje: 30 },
        { porcentaje: 30 },
        { porcentaje: 40 },
      ];
      const resultado = validarMallaPorcentajes(componentes);
      expect(resultado.esValida).toBe(true);
      expect(resultado.suma).toBe(100);
      expect(resultado.falta).toBe(0);
    });

    it("debe indicar cuánto porcentaje falta si suma menos de 100%", () => {
      const componentes = [
        { porcentaje: 25 },
        { porcentaje: 35 },
      ];
      const resultado = validarMallaPorcentajes(componentes);
      expect(resultado.esValida).toBe(false);
      expect(resultado.suma).toBe(60);
      expect(resultado.falta).toBe(40);
    });

    it("debe indicar exceso si los porcentajes superan 100%", () => {
      const componentes = [
        { porcentaje: 60 },
        { porcentaje: 50 },
      ];
      const resultado = validarMallaPorcentajes(componentes);
      expect(resultado.esValida).toBe(false);
      expect(resultado.suma).toBe(110);
      expect(resultado.falta).toBe(-10);
    });
  });

  describe("calcularNotaDefinitiva", () => {
    const malla: ComponenteEvaluacion[] = [
      { id: "c1", cursoId: "curso-1", nombre: "Parcial 1", porcentaje: 30, orden: 1 },
      { id: "c2", cursoId: "curso-1", nombre: "Talleres y Prácticas", porcentaje: 30, orden: 2 },
      { id: "c3", cursoId: "curso-1", nombre: "Examen Final", porcentaje: 40, orden: 3 },
    ];

    it("debe calcular la nota definitiva ponderada con todas las notas asentadas", () => {
      // 4.0 * 30% = 1.2
      // 5.0 * 30% = 1.5
      // 3.5 * 40% = 1.4
      // Total = 4.1
      const calificaciones = {
        c1: 4.0,
        c2: 5.0,
        c3: 3.5,
      };

      const res = calcularNotaDefinitiva(malla, calificaciones);
      expect(res.definitiva).toBe(4.1);
      expect(res.porcentajeEvaluado).toBe(100);
      expect(res.esCompleto).toBe(true);
    });

    it("debe calcular el acumulado parcial si faltan notas por asentar", () => {
      // Solo c1 (4.0 * 30% = 1.2)
      const calificaciones = {
        c1: 4.0,
      };

      const res = calcularNotaDefinitiva(malla, calificaciones);
      expect(res.definitiva).toBe(1.2);
      expect(res.porcentajeEvaluado).toBe(30);
      expect(res.esCompleto).toBe(false);
    });

    it("debe ignorar notas inválidas o fuera de rango", () => {
      const calificaciones = {
        c1: 4.0,
        c2: -1.0, // Inválida, se ignora
        c3: 4.0,
      };

      const res = calcularNotaDefinitiva(malla, calificaciones);
      // c1: 1.2 + c3: 1.6 = 2.8
      expect(res.definitiva).toBe(2.8);
      expect(res.porcentajeEvaluado).toBe(70);
      expect(res.esCompleto).toBe(false);
    });
  });

  describe("Validaciones de frontera en servicios de calificación", () => {
    it("guardarCalificacion rechaza notas fuera de rango antes de tocar red", async () => {
      const { guardarCalificacion } = await import("./academico");
      const resNeg = await guardarCalificacion({
        componenteId: "comp-1",
        matriculaId: "mat-1",
        nota: -0.5,
      });
      expect(resNeg.ok).toBe(false);
      expect(resNeg.error).toContain("0.0 y 5.0");

      const resMayor = await guardarCalificacion({
        componenteId: "comp-1",
        matriculaId: "mat-1",
        nota: 5.5,
      });
      expect(resMayor.ok).toBe(false);
      expect(resMayor.error).toContain("0.0 y 5.0");
    });

    it("calificarEntrega rechaza notas fuera de rango antes de tocar red", async () => {
      const { calificarEntrega } = await import("./academico");
      const res = await calificarEntrega({
        entregaId: "ent-1",
        nota: 6.0,
      });
      expect(res.ok).toBe(false);
      expect(res.error).toContain("0.0 y 5.0");
    });
  });
});
