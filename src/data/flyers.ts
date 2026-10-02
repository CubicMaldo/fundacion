import construccion from "@/assets/flyers/construccion.jpg.asset.json";
import mercadeo from "@/assets/flyers/mercadeo.jpg.asset.json";
import sstVirtual from "@/assets/flyers/sst-virtual.jpg.asset.json";
import vigilancia from "@/assets/flyers/vigilancia.jpg.asset.json";
import enfermeria from "@/assets/flyers/enfermeria.jpg.asset.json";
import ingles from "@/assets/flyers/ingles.jpg.asset.json";
import sedes from "@/assets/flyers/sedes.jpg.asset.json";
import adminSalud from "@/assets/flyers/administracion-salud.jpg.asset.json";
import belleza from "@/assets/flyers/belleza.jpg.asset.json";
import adminSalud2 from "@/assets/flyers/administracion-salud-2.jpg.asset.json";
import sedePonedera from "@/assets/flyers/sede-ponedera.jpg.asset.json";
import secretariado from "@/assets/flyers/secretariado.jpg.asset.json";
import sst from "@/assets/flyers/sst.jpg.asset.json";
import primeraInfancia from "@/assets/flyers/primera-infancia.jpg.asset.json";
import primeraInfanciaTea from "@/assets/flyers/primera-infancia-tea.jpg.asset.json";
import electricidad from "@/assets/flyers/electricidad.jpg.asset.json";

/** Piezas oficiales de convocatoria suministradas por FUNASF. */
export const flyers = [
  { src: enfermeria.url, alt: "Convocatoria Auxiliar de Enfermería — beca del 90 %" },
  { src: adminSalud.url, alt: "Convocatoria Administración en Salud" },
  { src: adminSalud2.url, alt: "Administración en Salud — la educación transforma vidas" },
  { src: sst.url, alt: "Convocatoria Seguridad y Salud en el Trabajo" },
  { src: sstVirtual.url, alt: "Seguridad y Salud en el Trabajo de forma virtual" },
  { src: mercadeo.url, alt: "Convocatoria Mercadeo y Ventas" },
  { src: secretariado.url, alt: "Convocatoria Técnico Laboral en Secretariado Ejecutivo" },
  { src: primeraInfancia.url, alt: "Convocatoria Primera Infancia" },
  { src: primeraInfanciaTea.url, alt: "Primera Infancia con diplomado en niños con TEA y TDAH" },
  { src: construccion.url, alt: "Convocatoria Auxiliar de Construcción de Edificaciones" },
  { src: vigilancia.url, alt: "Convocatoria Curso de Vigilancia en 4 meses" },
  { src: belleza.url, alt: "Convocatoria Belleza Integral" },
  { src: ingles.url, alt: "Convocatoria Inglés Avanzado" },
  { src: electricidad.url, alt: "Convocatoria Auxiliar Laboral en Electricidad" },
  { src: sedes.url, alt: "Nuestras sedes: Santo Tomás, Ponedera, Sabanalarga, Soledad y próximamente Valledupar" },
  { src: sedePonedera.url, alt: "Sede Ponedera en el Colegio Agropecuario de la Candelaria, sábados y domingos" },
] as const;
