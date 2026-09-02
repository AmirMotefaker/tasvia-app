import assert from "node:assert/strict";
import test from "node:test";
import {
  applyDiscount,
  applyPriceLevel,
  buildEqualInstallments,
  calculateCommission,
  convertMoney,
  validateBarcode,
} from "../src/domain/parity/commerce";

test("price levels apply basis-point multipliers without floating point", () => {
  assert.equal(applyPriceLevel(1_000_000n, { id: "vip", name: "ویژه", multiplierBps: 9000, active: true }), 900_000n);
});

test("discount rules combine percentage and fixed discount and never go below zero", () => {
  const net = applyDiscount(1_000_000n, { id: "campaign", active: true, percentageBps: 1000, fixedAmount: 50_000n });
  assert.equal(net, 850_000n);
  assert.equal(applyDiscount(100n, { id: "full", active: true, fixedAmount: 500n }), 0n);
});

test("installment schedule preserves the exact total including remainder", () => {
  const due = new Date("2026-09-01T00:00:00.000Z");
  const schedule = buildEqualInstallments(1_000n, 3, due, 30);
  assert.deepEqual(schedule.map((item) => item.amount), [333n, 333n, 334n]);
  assert.equal(schedule.reduce((sum, item) => sum + item.amount, 0n), 1_000n);
});

test("commissions can use post-discount basis", () => {
  assert.equal(calculateCommission({ subtotal: 1_000_000n, netAfterDiscount: 800_000n, rule: { salespersonId: "s1", rateBps: 500, appliesAfterDiscount: true } }), 40_000n);
});

test("currency conversion uses explicit integer rate contract", () => {
  assert.deepEqual(convertMoney({ amount: 10n, currency: "USD" }, "IRR", 600_000n), { amount: 6_000_000n, currency: "IRR" });
});

test("barcode validation rejects unsafe identifiers", () => {
  assert.equal(validateBarcode(" SKU_1234 "), "SKU_1234");
  assert.throws(() => validateBarcode("a b"));
});
