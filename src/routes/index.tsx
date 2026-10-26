import { useState, useEffect } from "react";
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
import { AuthorityMetrics } from "@/components/site/home/AuthorityMetrics";
import { PortalesHubSection } from "@/components/site/home/PortalesHubSection";
import { TestimoniosVideoSection } from "@/components/site/home/TestimoniosVideoSection";
import { QuienesSomosSection } from "@/components/site/home/QuienesSomosSection";
import { PropositoSection } from "@/components/site/home/PropositoSection";
import { ProgramasSection } from "@/components/site/home/ProgramasSection";
import { BecasSection } from "@/components/site/home/BecasSection";
import { ValoresSection } from "@/components/site/home/ValoresSection";
import { BlogSection } from "@/components/site/home/BlogSection";
import { FaqSection } from "@/components/site/home/FaqSection";
import { CtaSection } from "@/components/site/home/CtaSection";

import { createSeoMeta, getFaqSchema } from "@/lib/seo";
import { isStudentSubdomain } from "@/lib/subdomain";
import { PortalEstudiantilView } from "@/components/site/portal-estudiantil/PortalEstudiantilView";

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

type HomeData = Awaited<ReturnType<typeof getHomeData>>;

function MainWebsiteView({ data }: { data: HomeData }) {
  const {
    org,
    quienesSomos,
    proposito,
    becas,
    categoriasProgramas,
    programas,
    faq,
    llamadoAccion,
    valores,
    articulos,
  } = data;

  return (
    <>
      <HeroSection org={org} quienesSomos={quienesSomos} />
      <AuthorityMetrics />
      <PortalesHubSection />
      <ProgramasSection categoriasProgramas={categoriasProgramas} programas={programas} />
      <BecasSection becas={becas} />
      <TestimoniosVideoSection />
      <QuienesSomosSection quienesSomos={quienesSomos} />
      <PropositoSection proposito={proposito} />
      <ValoresSection valores={valores} />
      <BlogSection articulos={articulos} />
      <FaqSection faq={faq} />
      <CtaSection llamadoAccion={llamadoAccion} org={org} />
    </>
  );
}

function Inicio() {
  const data = Route.useLoaderData();
  const [isStudentSub, setIsStudentSub] = useState(false);

  useEffect(() => {
    setIsStudentSub(isStudentSubdomain());
  }, []);

  if (isStudentSub) {
    return <PortalEstudiantilView />;
  }

  return <MainWebsiteView data={data} />;
}
