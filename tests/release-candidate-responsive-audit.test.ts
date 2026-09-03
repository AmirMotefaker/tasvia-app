import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const shell = readFileSync("src/components/workspace/shell.tsx", "utf8");

const tablePages = [
  "app/app/sales/page.tsx",
  "app/app/purchases/page.tsx",
  "app/app/treasury/page.tsx",
  "app/app/inventory/page.tsx",
  "app/app/cheques/page.tsx",
  "app/app/reconciliation/page.tsx",
  "app/app/settlements/page.tsx",
];

test("release candidate has dedicated mobile primary navigation", () => {
  assert.ok(shell.includes("fixed inset-x-0 bottom-0"));
  assert.ok(shell.includes('aria-label="ناوبری اصلی موبایل"'));
  assert.ok(shell.includes("safe-area-inset-bottom"));
});

test("financial tables are horizontally safe on narrow screens", () => {
  for (const file of tablePages) {
    const source = readFileSync(file, "utf8");
    assert.ok(source.includes("overflow-x-auto"), `${file} lacks responsive table overflow`);
  }
});

test("release candidate core routes contain no known product placeholder phrases", () => {
  const files = [
    "app/app/page.tsx",
    "app/app/sales/page.tsx",
    "app/app/purchases/page.tsx",
    "app/app/treasury/page.tsx",
    "app/app/inventory/page.tsx",
    "app/app/cheques/page.tsx",
    "app/app/reconciliation/page.tsx",
    "app/app/settlements/page.tsx",
    "app/app/fiscal-close/page.tsx",
    "app/app/reports/financial/page.tsx",
  ];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.equal(source.includes("در انتظار داده"), false, `${file} still exposes placeholder data copy`);
    assert.equal(source.includes("در مرحله بعد"), false, `${file} still exposes roadmap copy`);
  }
});
