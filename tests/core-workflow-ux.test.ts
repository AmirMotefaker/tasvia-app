import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("core workflow pages expose intentional empty and status states", () => {
  const sales = readFileSync("app/app/sales/page.tsx", "utf8");
  const purchases = readFileSync("app/app/purchases/page.tsx", "utf8");
  const treasury = readFileSync("app/app/treasury/page.tsx", "utf8");

  assert.ok(sales.includes("هنوز فروشی ثبت نشده است"));
  assert.ok(sales.includes("چرخه پیش‌نویس تا وصول"));
  assert.ok(purchases.includes("هنوز خریدی ثبت نشده است"));
  assert.ok(treasury.includes("هنوز گردش خزانه‌ای ثبت نشده است"));
});
