import { z } from "zod";

export const OrganizationSchema = z.object({
  nombre: z.string(),
  sigla: z.string(),
  razonSocial: z.string(),
  eslogan: z.string(),
  esloganSecundario: z.string(),
  frases: z.array(z.string()),
  nit: z.string().optional(),
  formularioInscripcion: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
});

export const QuienesSomosSchema = z.object({
  intro: z.string(),
  parrafos: z.array(z.string()),
  compromiso: z.string(),
  destacado: z.string(),
});

export const PropositoEjeSchema = z.object({
  nombre: z.string(),
  icono: z.string(),
  texto: z.string(),
});

export const PropositoSchema = z.object({
  titulo: z.string(),
  intro: z.string(),
  ejes: z.array(PropositoEjeSchema),
});

export const ProgramaSocialSchema = z.object({
  nombre: z.string(),
  icono: z.string(),
  texto: z.string(),
});

export const CategoriaProgramasSchema = z.object({
  id: z.string(),
  categoria: z.string(),
  programas: z.array(z.string()),
});

export const FAQSchema = z.object({
  pregunta: z.string(),
  respuesta: z.string(),
});

export const BecaSchema = z.object({
  titulo: z.string(),
  intro: z.string(),
  proposito: z.string(),
  beneficios: z.array(z.string()),
  aclaracion: z.string(),
  destacado: z.string(),
});

export const LlamadoAccionBloqueSchema = z.object({
  titulo: z.string(),
  texto: z.string(),
});

export const LlamadoAccionSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  bloques: z.array(LlamadoAccionBloqueSchema),
});

export const AlcanceSchema = z.object({
  intro: z.string(),
  destacado: z.string(),
  presencia: z.array(z.string()),
  proyeccion: z.array(z.string()),
});

export const ValorSchema = z.object({
  nombre: z.string(),
  texto: z.string(),
});

// Infered types
export type Organization = z.infer<typeof OrganizationSchema>;
export type QuienesSomos = z.infer<typeof QuienesSomosSchema>;
export type Proposito = z.infer<typeof PropositoSchema>;
export type ProgramaSocial = z.infer<typeof ProgramaSocialSchema>;
export type CategoriaProgramas = z.infer<typeof CategoriaProgramasSchema>;
export type FAQ = z.infer<typeof FAQSchema>;
export type Beca = z.infer<typeof BecaSchema>;
export type LlamadoAccion = z.infer<typeof LlamadoAccionSchema>;
export type Alcance = z.infer<typeof AlcanceSchema>;
export type Valor = z.infer<typeof ValorSchema>;
