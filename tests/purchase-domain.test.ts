import test from "node:test";
import assert from "node:assert/strict";
import { assertPurchaseTransition, calculatePurchaseLine, calculatePurchaseTotals } from "../src/domain/purchases/purchase";

test("purchase totals preserve gross, discount, tax and final total", () => {
  const totals = calculatePurchaseTotals([
    { itemId: "a", quantityMinorUnits: 2n, unitPrice: 1000n, discount: 100n, tax: 90n },
    { itemId: "b", quantityMinorUnits: 1n, unitPrice: 500n },
  ]);
  assert.deepEqual(totals, { subtotal: 2500n, discount: 100n, tax: 90n, total: 2490n });
});

test("purchase line rejects invalid quantity and over-discount", () => {
  assert.throws(() => calculatePurchaseLine({ itemId: "a", quantityMinorUnits: 0n, unitPrice: 100n }), /PURCHASE_QUANTITY_MUST_BE_POSITIVE/);
  assert.throws(() => calculatePurchaseLine({ itemId: "a", quantityMinorUnits: 1n, unitPrice: 100n, discount: 101n }), /PURCHASE_DISCOUNT_EXCEEDS_GROSS/);
});

test("purchase workflow only allows controlled status transitions", () => {
  assert.doesNotThrow(() => assertPurchaseTransition("DRAFT", "SUBMITTED"));
  assert.doesNotThrow(() => assertPurchaseTransition("SUBMITTED", "APPROVED"));
  assert.doesNotThrow(() => assertPurchaseTransition("APPROVED", "POSTED"));
  assert.doesNotThrow(() => assertPurchaseTransition("POSTED", "PAID"));
  assert.throws(() => assertPurchaseTransition("DRAFT", "POSTED"), /INVALID_PURCHASE_TRANSITION/);
  assert.throws(() => assertPurchaseTransition("POSTED", "CANCELLED"), /INVALID_PURCHASE_TRANSITION/);
});
