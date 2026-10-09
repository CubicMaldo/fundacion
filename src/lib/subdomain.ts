/**
 * Subdomain detection and routing helpers for FUNASF Student Portal
 * Supports:
 * - Production: estudiantes.edufunasf.org, portal.edufunasf.org
 * - Local development: estudiantes.localhost:8080, portal.localhost:8080
 * - Query param override: ?subdomain=estudiantes (great for previewing directly)
 */

export function isStudentSubdomain(hostname?: string, search?: string): boolean {
  if (typeof window === "undefined") {
    if (!hostname) return false;
    const lower = hostname.toLowerCase();
    return (
      lower.startsWith("estudiantes.") ||
      lower.startsWith("portal.") ||
      lower.startsWith("estudiante.") ||
      lower.startsWith("alumnos.")
    );
  }

  // 1. Check query parameter override if provided or from window.location.search
  const currentSearch = search ?? window.location.search;
  if (currentSearch) {
    const params = new URLSearchParams(currentSearch);
    const subParam = params.get("subdomain");
    if (subParam === "estudiantes" || subParam === "portal" || subParam === "estudiante") {
      return true;
    }
    if (subParam === "principal" || subParam === "main") {
      return false;
    }
  }

  // 2. Check hostname
  const host = (hostname ?? window.location.hostname).toLowerCase();
  return (
    host.startsWith("estudiantes.") ||
    host.startsWith("portal.") ||
    host.startsWith("estudiante.") ||
    host.startsWith("alumnos.")
  );
}

/**
 * Returns the URL pointing to the Student Portal (subdomain)
 */
export function getStudentPortalUrl(): string {
  if (typeof window === "undefined") return "/portal-estudiantil";

  const host = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // Already on student subdomain
  if (isStudentSubdomain(host)) {
    return `${protocol}//${window.location.host}/`;
  }

  // Localhost development: use estudiantes.localhost:port
  if (host === "localhost" || host === "127.0.0.1") {
    return `http://estudiantes.localhost${port}/`;
  }

  // Production domain: prepend estudiantes.
  const cleanHost = host.replace(/^www\./, "");
  return `${protocol}//estudiantes.${cleanHost}${port}/`;
}

/**
 * Returns the URL pointing to the Main Institutional Site
 */
export function getMainSiteUrl(): string {
  if (typeof window === "undefined") return "/";

  const host = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // If query override was used on localhost, clear it
  if (window.location.search.includes("subdomain=estudiantes")) {
    return `${protocol}//${window.location.host}/?subdomain=principal`;
  }

  // Not on subdomain -> regular root
  if (!isStudentSubdomain(host)) {
    return "/";
  }

  // Localhost subdomain: estudiantes.localhost -> localhost:port
  if (host.includes("localhost")) {
    return `http://localhost${port}/`;
  }

  // Production: strip subdomain prefix
  const mainHost = host
    .replace(/^estudiantes\./i, "")
    .replace(/^portal\./i, "")
    .replace(/^estudiante\./i, "")
    .replace(/^alumnos\./i, "");
  return `${protocol}//${mainHost}${port}/`;
}
