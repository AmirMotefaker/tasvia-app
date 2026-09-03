import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePurchaseTotals,
  assertPurchaseTransition,
} from "../src/domain/purchases/purchase";
import {
  calculateSalesTotals,
  assertSalesTransition,
} from "../src/domain/sales/sale";
import { nextSettlementStatus } from "../src/domain/settlements/settlement";
import { transitionCheque } from "../src/domain/accounting/cheque";

const purchase = calculatePurchaseTotals([
  {
    itemId: "coffee",
    quantityMinorUnits: 10n,
    unitPrice: 100_000n,
    discount: 0n,
    tax: 100_000n,
  },
]);

const sale = calculateSalesTotals([
  {
    itemId: "coffee",
    quantityMinorUnits: 4n,
    unitPrice: 180_000n,
    discount: 20_000n,
    tax: 70_000n,
  },
]);

test("release candidate rehearses purchase to sale to settlement lifecycle", () => {
  assert.equal(purchase.total, 1_100_000n);
  assert.doesNotThrow(() => assertPurchaseTransition("DRAFT", "SUBMITTED"));
  assert.doesNotThrow(() => assertPurchaseTransition("SUBMITTED", "APPROVED"));
  assert.doesNotThrow(() => assertPurchaseTransition("APPROVED", "POSTED"));

  assert.equal(sale.total, 770_000n);
  assert.doesNotThrow(() => assertSalesTransition("DRAFT", "SUBMITTED"));
  assert.doesNotThrow(() => assertSalesTransition("SUBMITTED", "APPROVED"));
  assert.doesNotThrow(() => assertSalesTransition("APPROVED", "POSTED"));

  const partialReceipt = nextSettlementStatus(sale.total, 300_000n);
  assert.deepEqual(partialReceipt, {
    outstandingAfter: 470_000n,
    status: "PARTIALLY_PAID",
  });

  const finalReceipt = nextSettlementStatus(
    partialReceipt.outstandingAfter,
    470_000n,
  );
  assert.deepEqual(finalReceipt, {
    outstandingAfter: 0n,
    status: "PAID",
  });

  const partialSupplierPayment = nextSettlementStatus(
    purchase.total,
    600_000n,
  );
  assert.equal(partialSupplierPayment.outstandingAfter, 500_000n);
  assert.equal(partialSupplierPayment.status, "PARTIALLY_PAID");
});

test("release candidate rehearses cheque lifecycle without illegal terminal mutation", () => {
  const cheque = {
    id: "rc-cheque",
    workspaceId: "rc-workspace",
    counterpartyId: "rc-customer",
    direction: "RECEIVED" as const,
    chequeNumber: "RC-1001",
    amount: { currency: "IRR" as const, minorUnits: 470_000n },
    issuedAt: new Date("2026-09-01"),
    dueAt: new Date("2026-09-03"),
    status: "DUE" as const,
  };

  const cleared = transitionCheque(cheque, "CLEARED");
  assert.equal(cleared.status, "CLEARED");
  assert.throws(
    () => transitionCheque(cleared, "BOUNCED"),
    /Invalid cheque transition/,
  );
});
