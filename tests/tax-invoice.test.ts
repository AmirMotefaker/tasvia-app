import assert from "node:assert/strict";
import test from "node:test";
import { assertCreditNoteAllowed, calculateTaxInvoice, formatInvoiceNumber, type TaxInvoice } from "../src/domain/accounting/tax-invoice";

const invoice: TaxInvoice = {
  id: "inv1",
  workspaceId: "ws1",
  number: "1405-000001",
  issuedAt: new Date("2026-09-01"),
  status: "ISSUED",
  lines: [
    { id: "l1", description: "کالا", quantityMinorUnits: 2n, unitPrice: { currency: "IRR", minorUnits: 100_000n }, lineDiscount: { currency: "IRR", minorUnits: 20_000n }, taxRateBasisPoints: 1_000 },
  ],
  invoiceDiscount: { currency: "IRR", minorUnits: 10_000n },
};

test("tax invoice calculates exact integer totals", () => {
  const totals = calculateTaxInvoice(invoice);
  assert.equal(totals.subtotal.minorUnits, 200_000n);
  assert.equal(totals.lineDiscounts.minorUnits, 20_000n);
  assert.equal(totals.taxableBase.minorUnits, 170_000n);
  assert.equal(totals.tax.minorUnits, 17_000n);
  assert.equal(totals.grandTotal.minorUnits, 187_000n);
});

test("tax invoice rejects excessive line discount", () => {
  assert.throws(() => calculateTaxInvoice({ ...invoice, lines: [{ ...invoice.lines[0]!, lineDiscount: { currency: "IRR", minorUnits: 300_000n } }] }), /exceeds line gross/);
});

test("credit notes cannot exceed invoice total", () => {
  assert.throws(() => assertCreditNoteAllowed({ invoice, previousCredits: [], nextCredit: { id: "c1", workspaceId: "ws1", originalInvoiceId: "inv1", issuedAt: new Date(), amount: { currency: "IRR", minorUnits: 200_000n }, reason: "اصلاح" } }), /exceed original invoice/);
});

test("invoice numbering is deterministic", () => {
  assert.equal(formatInvoiceNumber({ fiscalYear: "1405", sequence: 42 }), "1405-000042");
});
