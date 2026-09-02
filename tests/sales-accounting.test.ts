import test from "node:test";
import assert from "node:assert/strict";
import { createCustomer } from "../src/domain/sales/customer";
import { agingBucket, deriveReceivableStatus, outstandingAmount, type Receivable } from "../src/domain/sales/receivable";
import { buildSaleJournal, postJournal } from "../src/domain/sales/sales-posting";
import { irr } from "../src/domain/financial-safety/money";
import { validateDoubleEntry } from "../src/domain/journal/journal-validation";

test("simple sale creates a balanced receivable/revenue journal", () => {
  const journal = buildSaleJournal({
    id: "sale-1",
    reference: "INV-1001",
    description: "فروش نمونه",
    amount: irr(1_500_000),
    createdAt: new Date("2026-09-01T08:00:00Z"),
    accounts: {
      receivablesAccountId: "1103",
      revenueAccountId: "4101",
    },
  });

  assert.equal(journal.status, "DRAFT");
  assert.equal(journal.lines[0]?.direction, "DEBIT");
  assert.equal(journal.lines[1]?.direction, "CREDIT");
  assert.equal(validateDoubleEntry(journal), true);
  assert.equal(postJournal(journal).status, "POSTED");
});

test("receivable derives outstanding balance and overdue aging", () => {
  const receivable: Receivable = {
    id: "ar-1",
    workspaceId: "w-1",
    customerId: "c-1",
    invoiceId: "i-1",
    originalAmount: irr(2_000_000),
    paidAmount: irr(500_000),
    dueAt: new Date("2026-07-01T00:00:00Z"),
    status: "OPEN",
  };

  assert.equal(outstandingAmount(receivable).minorUnits, BigInt(1_500_000));
  assert.equal(deriveReceivableStatus(receivable, new Date("2026-09-01T00:00:00Z")), "OVERDUE");
  assert.equal(agingBucket(receivable, new Date("2026-09-01T00:00:00Z")), "61_90");
});

test("customer creation normalizes required fields", () => {
  const customer = createCustomer({
    id: "c-1",
    workspaceId: "w-1",
    code: "  C100  ",
    name: "  مشتری نمونه  ",
  });

  assert.equal(customer.code, "C100");
  assert.equal(customer.name, "مشتری نمونه");
  assert.equal(customer.active, true);
});
