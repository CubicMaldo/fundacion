import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/programas/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/programas/$slug"!</div>;
}
