import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Leaf,
  Sprout,
  Stethoscope,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getHomeData } from "@/services/api";

import { HeroSection } from "@/components/site/home/HeroSection";
import { QuienesSomosSection } from "@/components/site/home/QuienesSomosSection";
import { PropositoSection } from "@/components/site/home/PropositoSection";
import { ProgramasSection } from "@/components/site/home/ProgramasSection";
import { BecasSection } from "@/components/site/home/BecasSection";
import { ProgramasSocialesSection } from "@/components/site/home/ProgramasSocialesSection";
import { AlcanceSection } from "@/components/site/home/AlcanceSection";
import { ValoresSection } from "@/components/site/home/ValoresSection";
import { FaqSection } from "@/components/site/home/FaqSection";
import { CtaSection } from "@/components/site/home/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUNASF — Porque la educación no tiene fronteras" },
      {
        name: "description",
        content:
          "Fundación Internacional Amigos Sin Fronteras. Programas de formación técnica, becas de hasta el 90 %, emprendimiento, salud y acción comunitaria.",
      },
      { property: "og:title", content: "FUNASF — Porque la educación no tiene fronteras" },
      {
        property: "og:description",
        content:
          "Formación técnica, becas de hasta el 90 %, emprendimiento y programas sociales para las comunidades.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    return await getHomeData();
  },
  component: Inicio,
});

const iconos: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  HandHeart,
  BookOpen,
  Stethoscope,
  Leaf,
  Store,
  Briefcase,
};

function Inicio() {
  const {
    org,
    quienesSomos,
    proposito,
    becas,
    categoriasProgramas,
    programasSociales,
    alcance,
    faq,
    llamadoAccion,
    valores,
  } = Route.useLoaderData();

  return (
    <>
      <HeroSection org={org} quienesSomos={quienesSomos} />
      <QuienesSomosSection quienesSomos={quienesSomos} />
      <PropositoSection proposito={proposito} iconos={iconos} />
      <ProgramasSection categoriasProgramas={categoriasProgramas} />
      <BecasSection becas={becas} />
      <ProgramasSocialesSection programasSociales={programasSociales} iconos={iconos} />
      <AlcanceSection alcance={alcance} />
      <ValoresSection valores={valores} />
      <FaqSection faq={faq} />
      <CtaSection llamadoAccion={llamadoAccion} org={org} />
    </>
  );
}
