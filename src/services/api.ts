import * as funasfData from "@/data/funasf";
import type {
  Organization,
  QuienesSomos,
  Proposito,
  Beca,
  CategoriaProgramas,
  ProgramaSocial,
  FAQ,
  LlamadoAccion,
  Alcance,
  Valor,
} from "@/models/schema";

/**
 * Simulación de retraso de red para preparar UI para estados de carga
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getOrganizationData(): Promise<Organization> {
  await delay(100);
  // Aquí se reemplazará con un fetch al CMS
  return funasfData.org as Organization;
}

export async function getQuienesSomos(): Promise<QuienesSomos> {
  await delay(100);
  return funasfData.quienesSomos as QuienesSomos;
}

export async function getProposito(): Promise<Proposito> {
  await delay(100);
  return funasfData.proposito as Proposito;
}

export async function getBecas(): Promise<Beca> {
  await delay(100);
  return funasfData.becas as Beca;
}

export async function getCategoriasProgramas(): Promise<CategoriaProgramas[]> {
  await delay(100);
  return funasfData.categoriasProgramas as CategoriaProgramas[];
}

export async function getProgramasSociales(): Promise<ProgramaSocial[]> {
  await delay(100);
  return funasfData.programasSociales as ProgramaSocial[];
}

export async function getAlcance(): Promise<Alcance> {
  await delay(100);
  return funasfData.alcance as Alcance;
}

export async function getValores(): Promise<Valor[]> {
  await delay(100);
  return funasfData.valores as Valor[];
}

export async function getFaqs(): Promise<FAQ[]> {
  await delay(100);
  return funasfData.faq as FAQ[];
}

export async function getLlamadoAccion(): Promise<LlamadoAccion> {
  await delay(100);
  return funasfData.llamadoAccion as LlamadoAccion;
}

export async function getHomeData() {
  await delay(300);
  return {
    org: funasfData.org,
    quienesSomos: funasfData.quienesSomos,
    proposito: funasfData.proposito,
    becas: funasfData.becas,
    categoriasProgramas: funasfData.categoriasProgramas,
    programasSociales: funasfData.programasSociales,
    alcance: funasfData.alcance,
    faq: funasfData.faq,
    llamadoAccion: funasfData.llamadoAccion,
    valores: funasfData.valores,
  };
}
