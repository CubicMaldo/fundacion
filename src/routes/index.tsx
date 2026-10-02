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
import { BlogSection } from "@/components/site/home/BlogSection";
import { FaqSection } from "@/components/site/home/FaqSection";
import { CtaSection } from "@/components/site/home/CtaSection";

import { createSeoMeta, getFaqSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    createSeoMeta({
      title: "FUNASF Colombia | Fundación Internacional Amigos Sin Fronteras — EduFUNASF",
      description:
        "Portal oficial de FUNASF en Colombia (EduFUNASF). Programas de formación técnica y laboral en alianza, becas de hasta el 90 %, emprendimiento y acción social en Cali y el Atlántico.",
      canonicalPath: "/",
      keywords:
        "FUNASF, EduFUNASF, FUNASF Colombia, Fundación Internacional Amigos Sin Fronteras, becas FUNASF, formación técnica Colombia, becas hasta 90, FUNASF Cali, FUNASF Atlántico",
      jsonLd: getFaqSchema(),
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
    programas,
    programasSociales,
    alcance,
    faq,
    llamadoAccion,
    valores,
    articulos,
  } = Route.useLoaderData();

  return (
    <>
      <HeroSection org={org} quienesSomos={quienesSomos} />
      <ProgramasSection categoriasProgramas={categoriasProgramas} programas={programas} />
      <BecasSection becas={becas} />
      <AlcanceSection alcance={alcance} />
      <QuienesSomosSection quienesSomos={quienesSomos} />
      <PropositoSection proposito={proposito} iconos={iconos} />
      <ProgramasSocialesSection programasSociales={programasSociales} iconos={iconos} />
      <ValoresSection valores={valores} />
      <BlogSection articulos={articulos} />
      <FaqSection faq={faq} />
      <CtaSection llamadoAccion={llamadoAccion} org={org} />
    </>
  );
}
