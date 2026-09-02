export interface RehearsalRoute {
  path: string;
  category: "public" | "workspace" | "accounting";
  expectation: "renders" | "auth-guarded";
}

export const rehearsalRoutes: RehearsalRoute[] = [
  { path: "/", category: "public", expectation: "renders" },
  { path: "/product", category: "public", expectation: "renders" },
  { path: "/integrations", category: "public", expectation: "renders" },
  { path: "/developers", category: "public", expectation: "renders" },
  { path: "/demo", category: "public", expectation: "renders" },
  { path: "/app", category: "workspace", expectation: "renders" },
  { path: "/app/sales", category: "workspace", expectation: "renders" },
  { path: "/app/purchases", category: "workspace", expectation: "renders" },
  { path: "/app/treasury", category: "workspace", expectation: "renders" },
  { path: "/app/inventory", category: "workspace", expectation: "renders" },
  { path: "/app/suppliers", category: "workspace", expectation: "renders" },
  { path: "/app/settlements", category: "workspace", expectation: "renders" },
  { path: "/app/reconciliation", category: "workspace", expectation: "renders" },
  { path: "/app/reports/financial", category: "workspace", expectation: "renders" },
  { path: "/app/commercial-controls", category: "workspace", expectation: "renders" },
  { path: "/app/operations-controls", category: "workspace", expectation: "renders" },
  { path: "/app/platform-controls", category: "workspace", expectation: "renders" },
  { path: "/accounting/simple", category: "accounting", expectation: "renders" },
  { path: "/accounting/professional", category: "accounting", expectation: "renders" },
  { path: "/sign-in", category: "public", expectation: "renders" },
];

export function validateRouteManifest(routes = rehearsalRoutes): void {
  const seen = new Set<string>();
  for (const route of routes) {
    if (!route.path.startsWith("/")) throw new Error(`Invalid route: ${route.path}`);
    if (seen.has(route.path)) throw new Error(`Duplicate route: ${route.path}`);
    seen.add(route.path);
  }
}
