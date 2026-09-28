import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/programas/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/programas/"!</div>;
}
