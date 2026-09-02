import assert from "node:assert/strict";
import test from "node:test";
import { issueCreditNote } from "../src/application/accounting/issue-credit-note";
import type { TaxInvoice } from "../src/domain/accounting/tax-invoice";
import type { Receivable } from "../src/domain/accounting/receivable";

const invoice: TaxInvoice = {
  id: "inv-1", workspaceId: "ws-1", number: "1405-000001", customerId: "c-1",
  issuedAt: new Date("2026-09-01T00:00:00Z"), status: "ISSUED",
  lines: [{ id: "l-1", description: "خدمت", quantityMinorUnits: 1n, unitPrice: { currency: "IRR", minorUnits: 1_000_000n }, taxRateBasisPoints: 1000 }],
};
const receivable: Receivable = {
  id: "ar-1", workspaceId: "ws-1", customerId: "c-1", sourceDocumentId: "inv-1",
  issuedAt: invoice.issuedAt, dueAt: new Date("2026-09-30T00:00:00Z"),
  originalAmount: { currency: "IRR", minorUnits: 1_100_000n }, outstandingAmount: { currency: "IRR", minorUnits: 1_100_000n }, status: "OPEN",
};

test("partial credit reduces receivable and creates balanced reversal journal", () => {
  const result = issueCreditNote({
    invoice, receivable, previousCredits: [],
    creditNote: { id: "cn-1", workspaceId: "ws-1", originalInvoiceId: "inv-1", issuedAt: new Date("2026-09-02T00:00:00Z"), amount: { currency: "IRR", minorUnits: 550_000n }, reason: "اصلاح صورتحساب" },
    revenueAccountId: "revenue", receivableAccountId: "ar", taxPayableAccountId: "tax",
  });
  assert.equal(result.receivable.outstandingAmount.minorUnits, 550_000n);
  assert.equal(result.receivable.status, "PARTIALLY_PAID");
  const debit = result.journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = result.journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, credit);
});

test("full credit closes receivable and marks invoice credited", () => {
  const result = issueCreditNote({
    invoice, receivable, previousCredits: [],
    creditNote: { id: "cn-full", workspaceId: "ws-1", originalInvoiceId: "inv-1", issuedAt: new Date("2026-09-02T00:00:00Z"), amount: { currency: "IRR", minorUnits: 1_100_000n }, reason: "ابطال کامل" },
    revenueAccountId: "revenue", receivableAccountId: "ar", taxPayableAccountId: "tax",
  });
  assert.equal(result.receivable.outstandingAmount.minorUnits, 0n);
  assert.equal(result.receivable.status, "PAID");
  assert.equal(result.invoice.status, "CREDITED");
});

test("credit cannot exceed outstanding receivable", () => {
  assert.throws(() => issueCreditNote({
    invoice, receivable: { ...receivable, outstandingAmount: { currency: "IRR", minorUnits: 100_000n } }, previousCredits: [],
    creditNote: { id: "cn-2", workspaceId: "ws-1", originalInvoiceId: "inv-1", issuedAt: new Date("2026-09-02T00:00:00Z"), amount: { currency: "IRR", minorUnits: 200_000n }, reason: "اصلاح" },
    revenueAccountId: "revenue", receivableAccountId: "ar", taxPayableAccountId: "tax",
  }), /outstanding receivable/);
});
