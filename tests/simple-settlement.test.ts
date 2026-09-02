import test from "node:test";
import assert from "node:assert/strict";
import { irr } from "../src/domain/financial-safety/money";
import type { Receivable } from "../src/domain/accounting/receivable";
import type { Payable } from "../src/domain/accounting/payable";
import { recordCustomerReceipt, recordSupplierPayment } from "../src/application/accounting/simple-settlement";

const accounts = {
  cashAccountId: "cash",
  receivableAccountId: "ar",
  payableAccountId: "ap",
  revenueAccountId: "revenue",
  expenseAccountId: "expense",
};

const occurredAt = new Date("2026-09-01T09:00:00.000Z");

test("simple customer receipt fully settles a receivable and posts a balanced journal", () => {
  const receivable: Receivable = {
    id: "ar:1",
    workspaceId: "w1",
    customerId: "c1",
    sourceId: "sale:1",
    originalAmount: irr(1_000_000n),
    outstandingAmount: irr(1_000_000n),
    issuedAt: occurredAt,
    dueAt: new Date("2026-09-10T00:00:00.000Z"),
    status: "OPEN",
  };

  const result = recordCustomerReceipt({
    id: "receipt:1",
    workspaceId: "w1",
    actorId: "u1",
    customerId: "c1",
    amount: irr(1_000_000n),
    occurredAt,
    receivables: [receivable],
    allocations: [{ receivableId: receivable.id, amount: irr(1_000_000n) }],
    accounts,
  });

  assert.equal(result.receivables[0].outstandingAmount.minorUnits, 0n);
  assert.equal(result.receivables[0].status, "PAID");
  assert.equal(result.journalEntry.status, "POSTED");
  assert.equal(result.journalEntry.lines[0].direction, "DEBIT");
  assert.equal(result.journalEntry.lines[1].direction, "CREDIT");
});

test("simple customer receipt rejects an unallocated remainder", () => {
  const receivable: Receivable = {
    id: "ar:2",
    workspaceId: "w1",
    customerId: "c1",
    originalAmount: irr(1_000_000n),
    outstandingAmount: irr(1_000_000n),
    issuedAt: occurredAt,
    status: "OPEN",
  };

  assert.throws(() => recordCustomerReceipt({
    id: "receipt:2",
    workspaceId: "w1",
    actorId: "u1",
    customerId: "c1",
    amount: irr(1_000_000n),
    occurredAt,
    receivables: [receivable],
    allocations: [{ receivableId: receivable.id, amount: irr(500_000n) }],
    accounts,
  }), /fully allocated/);
});

test("simple supplier payment fully settles a payable and posts a balanced journal", () => {
  const payable: Payable = {
    id: "ap:1",
    workspaceId: "w1",
    supplierId: "s1",
    issuedAt: occurredAt,
    dueAt: new Date("2026-09-10T00:00:00.000Z"),
    originalAmount: irr(2_000_000n),
    outstandingAmount: irr(2_000_000n),
    status: "OPEN",
  };

  const result = recordSupplierPayment({
    id: "payment:1",
    workspaceId: "w1",
    actorId: "u1",
    supplierId: "s1",
    amount: irr(2_000_000n),
    occurredAt,
    payables: [payable],
    allocations: [{ payableId: payable.id, amount: irr(2_000_000n) }],
    accounts,
  });

  assert.equal(result.payables[0].outstandingAmount.minorUnits, 0n);
  assert.equal(result.payables[0].status, "PAID");
  assert.equal(result.journalEntry.status, "POSTED");
});
