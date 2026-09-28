import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "./PageHero";
import { Section } from "./Section";

export function PendingPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <span className="bg-brand-brown-soft text-brand-brown mx-auto flex size-12 items-center justify-center rounded-lg">
            <Clock3 aria-hidden className="size-5" />
          </span>
          <h2 className="text-foreground mt-6 text-3xl">Contenido en preparación</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Este espacio está reservado para la información oficial que FUNASF publicará próximamente.
          </p>
          <Button asChild className="mt-8" variant="outline">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}