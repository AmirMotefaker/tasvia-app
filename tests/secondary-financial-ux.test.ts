import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("secondary financial modules no longer expose known placeholder copy", () => {
  const settlements = readFileSync("app/app/settlements/page.tsx", "utf8");
  const inventory = readFileSync("app/app/inventory/page.tsx", "utf8");

  assert.equal(settlements.includes("در انتظار داده"), false);
  assert.equal(settlements.includes("از Audit"), false);
  assert.equal(inventory.includes("تعریف کالا و انبار در مرحله بعد"), false);
});

test("secondary modules expose intentional empty states", () => {
  const settlements = readFileSync("app/app/settlements/page.tsx", "utf8");
  const cheques = readFileSync("app/app/cheques/page.tsx", "utf8");
  const reconciliation = readFileSync("app/app/reconciliation/page.tsx", "utf8");
  const fiscal = readFileSync("app/app/fiscal-close/page.tsx", "utf8");

  assert.ok(settlements.includes("مانده بازی برای تسویه وجود ندارد"));
  assert.ok(cheques.includes("هنوز چکی ثبت نشده است"));
  assert.ok(reconciliation.includes("هنوز شاهد بانکی ثبت نشده است"));
  assert.ok(fiscal.includes("هنوز دوره مالی برای این فضای کاری تعریف نشده است"));
});
