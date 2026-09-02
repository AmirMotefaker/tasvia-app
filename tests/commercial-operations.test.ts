import test from "node:test";
import assert from "node:assert/strict";
import {
  aggregateJournalLines,
  calculateBomCost,
  evaluateFiscalYearClose,
  normalizeCommerceOrder,
  validateArchivedDocument,
  validateCustomForm,
  validateNotificationRequest,
} from "../src/domain/commercial/operations";

test("archived documents require immutable content hash", () => {
  assert.equal(validateArchivedDocument({
    id: "d1", workspaceId: "w1", kind: "INVOICE", title: "فاکتور فروش",
    storageKey: "w1/invoices/d1.pdf", sha256: "a".repeat(64), createdAt: new Date(),
  }).id, "d1");
  assert.throws(() => validateArchivedDocument({
    id: "d2", workspaceId: "w1", kind: "OTHER", title: "x", storageKey: "x", sha256: "bad", createdAt: new Date(),
  }), /invalid-document-hash/);
});

test("notification requests are scoped and idempotent", () => {
  assert.equal(validateNotificationRequest({
    workspaceId: "w1", recipientId: "u1", channel: "SMS", intent: "DUE_REMINDER",
    templateKey: "receivable-due-v1", idempotencyKey: "due:u1:2026-09-02",
  }).channel, "SMS");
});

test("custom forms reject duplicate fields and empty select options", () => {
  assert.equal(validateCustomForm([{ key: "branch_code", label: "کد شعبه", type: "TEXT" }]).length, 1);
  assert.throws(() => validateCustomForm([
    { key: "status", label: "وضعیت", type: "SELECT", options: ["a"] },
    { key: "status", label: "وضعیت دوم", type: "TEXT" },
  ]), /duplicate-field-key/);
});

test("fiscal year close fails closed while accounting blockers exist", () => {
  const blocked = evaluateFiscalYearClose({ fiscalPeriodId: "fy1", unpostedJournalCount: 2, unreconciledCriticalCount: 1 });
  assert.equal(blocked.ready, false);
  const ready = evaluateFiscalYearClose({
    fiscalPeriodId: "fy1", unpostedJournalCount: 0, unreconciledCriticalCount: 0, retainedEarningsAccountId: "re",
  });
  assert.deepEqual(ready, { ready: true });
});

test("journal aggregation preserves debit and credit totals by account", () => {
  const result = aggregateJournalLines([
    { journalId: "j1", accountId: "cash", debit: 100n, credit: 0n },
    { journalId: "j2", accountId: "cash", debit: 50n, credit: 0n },
    { journalId: "j1", accountId: "sales", debit: 0n, credit: 150n },
  ]);
  assert.deepEqual(result.find((row) => row.accountId === "cash"), { accountId: "cash", debit: 150n, credit: 0n });
});

test("BOM cost and commerce order normalization use exact minor units", () => {
  assert.equal(calculateBomCost({ productSku: "P", outputQuantity: 1, components: [
    { sku: "A", quantity: 2, unitCostMinor: 500n },
    { sku: "B", quantity: 1.5, unitCostMinor: 200n },
  ] }), 1300n);
  assert.equal(normalizeCommerceOrder({
    connector: "WOOCOMMERCE", externalOrderId: "1001", workspaceId: "w1", currency: "IRR", totalMinor: 9000n, occurredAt: new Date(),
  }).connector, "WOOCOMMERCE");
});
