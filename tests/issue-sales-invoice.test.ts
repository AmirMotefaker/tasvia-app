import assert from "node:assert/strict";
import test from "node:test";
import { issueSalesInvoice } from "../src/application/accounting/issue-sales-invoice";
import type { TaxInvoice } from "../src/domain/accounting/tax-invoice";

const invoice: TaxInvoice = {
  id: "inv-1",
  workspaceId: "ws-1",
  number: "1405-000001",
  customerId: "customer-1",
  issuedAt: new Date("2026-09-01T00:00:00Z"),
  status: "DRAFT",
  lines: [{
    id: "line-1",
    description: "خدمت نمونه",
    quantityMinorUnits: 2n,
    unitPrice: { currency: "IRR", minorUnits: 1_000_000n },
    taxRateBasisPoints: 1000,
  }],
};

test("issuing a sales invoice creates receivable and balanced revenue/tax journal", () => {
  const result = issueSalesInvoice({
    invoice,
    dueAt: new Date("2026-09-30T00:00:00Z"),
    revenueAccountId: "revenue",
    receivableAccountId: "ar",
    taxPayableAccountId: "tax",
  });

  assert.equal(result.invoice.status, "ISSUED");
  assert.equal(result.totals.taxableBase.minorUnits, 2_000_000n);
  assert.equal(result.totals.tax.minorUnits, 200_000n);
  assert.equal(result.totals.grandTotal.minorUnits, 2_200_000n);
  assert.equal(result.receivable.outstandingAmount.minorUnits, 2_200_000n);

  const debit = result.journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = result.journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, credit);
});

test("invoice issuance rejects missing customer and invalid due date", () => {
  assert.throws(() => issueSalesInvoice({
    invoice: { ...invoice, customerId: undefined },
    dueAt: new Date("2026-09-30T00:00:00Z"),
    revenueAccountId: "revenue",
    receivableAccountId: "ar",
    taxPayableAccountId: "tax",
  }), /requires a customer/);

  assert.throws(() => issueSalesInvoice({
    invoice,
    dueAt: new Date("2026-08-31T00:00:00Z"),
    revenueAccountId: "revenue",
    receivableAccountId: "ar",
    taxPayableAccountId: "tax",
  }), /Due date/);
});
