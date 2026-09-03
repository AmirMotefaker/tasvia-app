const baseUrl = process.env.TASVIN_REHEARSAL_BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/", "/product", "/integrations", "/developers", "/demo", "/sign-in",
  "/app", "/app/sales", "/app/purchases", "/app/treasury", "/app/inventory",
  "/app/suppliers", "/app/settlements", "/app/cheques", "/app/reconciliation", "/app/reports/financial", "/app/fiscal-close", "/app/alerts",
  "/app/commercial-controls", "/app/operations-controls", "/app/platform-controls",
  "/accounting/simple", "/accounting/professional"
];

const failures = [];
for (const path of routes) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  const ok = response.status >= 200 && response.status < 500;
  console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${path}`);
  if (!ok) failures.push(`${path}:${response.status}`);
}

if (failures.length) {
  console.error(`Launch route smoke failed: ${failures.join(", ")}`);
  process.exit(1);
}

console.log(`Launch route smoke PASS (${routes.length} routes).`);
