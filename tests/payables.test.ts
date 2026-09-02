import test from "node:test";
import assert from "node:assert/strict";
import { irr } from "../src/domain/financial-safety/money";
import { payableAgingBucket, type Payable } from "../src/domain/accounting/payable";
import {
  allocateSupplierPayment,
  applySupplierPaymentAllocations,
  unallocatedSupplierPaymentAmount,
  type SupplierPayment,
} from "../src/domain/accounting/supplier-payment-allocation";
import { buildSupplierStatement, summarizePayablesAging } from "../src/domain/accounting/payables-reporting";

function samplePayable(overrides: Partial<Payable> = {}): Payable {
  return {
    id: "payable-1",
    workspaceId: "workspace-1",
    supplierId: "supplier-1",
    issuedAt: new Date("2026-07-01T00:00:00Z"),
    dueAt: new Date("2026-07-31T00:00:00Z"),
    originalAmount: irr(1_000_000n),
    outstandingAmount: irr(1_000_000n),
    status: "OPEN",
    ...overrides,
  };
}

function samplePayment(overrides: Partial<SupplierPayment> = {}): SupplierPayment {
  return {
    id: "payment-1",
    workspaceId: "workspace-1",
    supplierId: "supplier-1",
    amount: irr(600_000n),
    paidAt: new Date("2026-08-10T00:00:00Z"),
    ...overrides,
  };
}

test("supplier payment can partially settle a payable", () => {
  const payable = samplePayable();
  const payment = samplePayment();
  const allocations = allocateSupplierPayment(payment, [payable], [{ payableId: payable.id, amount: irr(600_000n) }]);
  const updated = applySupplierPaymentAllocations([payable], allocations, new Date("2026-08-10T00:00:00Z"));

  assert.equal(updated[0].outstandingAmount.minorUnits, 400_000n);
  assert.equal(updated[0].status, "PARTIALLY_PAID");
  assert.equal(unallocatedSupplierPaymentAmount(payment, allocations).minorUnits, 0n);
});

test("supplier allocation rejects overpayment and cross-supplier usage", () => {
  const payable = samplePayable();
  assert.throws(() =>
    allocateSupplierPayment(samplePayment({ amount: irr(2_000_000n) }), [payable], [
      { payableId: payable.id, amount: irr(1_500_000n) },
    ]),
  );

  assert.throws(() =>
    allocateSupplierPayment(samplePayment({ supplierId: "supplier-2" }), [payable], [
      { payableId: payable.id, amount: irr(100_000n) },
    ]),
  );
});

test("payables aging classifies overdue balances", () => {
  const payable = samplePayable();
  assert.equal(payableAgingBucket(payable, new Date("2026-09-15T00:00:00Z")), "31_60");
  const summary = summarizePayablesAging([payable], new Date("2026-09-15T00:00:00Z"));
  assert.equal(summary["31_60"].minorUnits, 1_000_000n);
});

test("supplier statement projects bills and payments into a running balance", () => {
  const payable = samplePayable();
  const payment = samplePayment();
  const statement = buildSupplierStatement("supplier-1", [payable], [payment]);
  assert.equal(statement.length, 2);
  assert.equal(statement[0].balance.minorUnits, 1_000_000n);
  assert.equal(statement[1].balance.minorUnits, 400_000n);
});
