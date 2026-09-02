import test from "node:test";
import assert from "node:assert/strict";
import { irr } from "../src/domain/financial-safety/money";
import { totalCredits, totalDebits } from "../src/domain/journal/journal-entry";
import {
  createPurchase,
  createReceiptJournal,
  createSale,
  createSupplierPaymentJournal,
} from "../src/application/accounting/simple-accounting";

const accounts = {
  cashAccountId: "cash",
  receivableAccountId: "ar",
  payableAccountId: "ap",
  revenueAccountId: "revenue",
  expenseAccountId: "expense",
};

const base = {
  workspaceId: "workspace-1",
  actorId: "user-1",
  occurredAt: new Date("2026-09-01T08:00:00.000Z"),
  accounts,
};

function assertBalanced(entry: ReturnType<typeof createReceiptJournal>) {
  assert.equal(totalDebits(entry).minorUnits, totalCredits(entry).minorUnits);
  assert.equal(entry.status, "POSTED");
}

test("simple sale creates receivable and balanced revenue journal", () => {
  const result = createSale({
    ...base,
    id: "sale-1",
    customerId: "customer-1",
    amount: irr(12_000_000n),
    dueAt: new Date("2026-09-15T00:00:00.000Z"),
  });
  assert.equal(result.receivable.outstandingAmount.minorUnits, 12_000_000n);
  assert.equal(result.receivable.workspaceId, "workspace-1");
  assertBalanced(result.journalEntry);
  assert.equal(result.journalEntry.lines[0]?.accountId, "ar");
  assert.equal(result.journalEntry.lines[1]?.accountId, "revenue");
});

test("simple purchase creates payable and balanced expense journal", () => {
  const result = createPurchase({
    ...base,
    id: "purchase-1",
    supplierId: "supplier-1",
    amount: irr(7_500_000n),
    dueAt: new Date("2026-09-20T00:00:00.000Z"),
  });
  assert.equal(result.payable.outstandingAmount.minorUnits, 7_500_000n);
  assert.equal(result.payable.supplierId, "supplier-1");
  assertBalanced(result.journalEntry);
  assert.equal(result.journalEntry.lines[0]?.accountId, "expense");
  assert.equal(result.journalEntry.lines[1]?.accountId, "ap");
});

test("receipt and supplier payment journals mirror AR/AP settlement", () => {
  const receipt = createReceiptJournal({ ...base, id: "receipt-1", amount: irr(2_000_000n) });
  assertBalanced(receipt);
  assert.equal(receipt.lines[0]?.accountId, "cash");
  assert.equal(receipt.lines[1]?.accountId, "ar");

  const payment = createSupplierPaymentJournal({ ...base, id: "payment-1", amount: irr(1_500_000n) });
  assertBalanced(payment);
  assert.equal(payment.lines[0]?.accountId, "ap");
  assert.equal(payment.lines[1]?.accountId, "cash");
});

test("simple accounting commands reject zero amounts", () => {
  assert.throws(() => createSale({ ...base, id: "sale-zero", customerId: "c", amount: irr(0n) }), /positive/);
  assert.throws(() => createReceiptJournal({ ...base, id: "receipt-zero", amount: irr(0n) }), /positive/);
});
