import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("workspace shell exposes final core product routes", () => {
  const shell = readFileSync("src/components/workspace/shell.tsx", "utf8");
  for (const route of [
    "/app/sales",
    "/app/purchases",
    "/app/treasury",
    "/app/inventory",
    "/app/settlements",
    "/app/cheques",
    "/app/reconciliation",
    "/app/reports/financial",
    "/app/fiscal-close",
  ]) {
    assert.ok(shell.includes(route), `missing final workspace route: ${route}`);
  }
});

test("dashboard quick actions use final product modules", () => {
  const dashboard = readFileSync("app/app/page.tsx", "utf8");
  assert.ok(dashboard.includes('"/app/sales"'));
  assert.ok(dashboard.includes('"/app/purchases"'));
  assert.ok(dashboard.includes('"/app/treasury"'));
  assert.ok(dashboard.includes('"/app/cheques"'));
  assert.equal(dashboard.includes('"/accounting/simple/sale"'), false);
});
