import type { Money } from "../financial-safety/money";

export type TaxInvoiceStatus = "DRAFT" | "ISSUED" | "VOIDED" | "CREDITED";

export interface TaxInvoiceLine {
  id: string;
  itemId?: string;
  description: string;
  quantityMinorUnits: bigint;
  unitPrice: Money;
  lineDiscount?: Money;
  taxRateBasisPoints: number;
}

export interface TaxInvoice {
  id: string;
  workspaceId: string;
  number: string;
  customerId?: string;
  issuedAt: Date;
  status: TaxInvoiceStatus;
  lines: TaxInvoiceLine[];
  invoiceDiscount?: Money;
  sellerFiscalId?: string;
  buyerFiscalId?: string;
}

export interface InvoiceTotals {
  subtotal: Money;
  lineDiscounts: Money;
  invoiceDiscount: Money;
  taxableBase: Money;
  tax: Money;
  grandTotal: Money;
}

function zero(currency: Money["currency"]): Money {
  return { currency, minorUnits: 0n };
}

export function calculateTaxInvoice(invoice: TaxInvoice): InvoiceTotals {
  const currency = invoice.lines[0]?.unitPrice.currency ?? invoice.invoiceDiscount?.currency ?? "IRR";
  let subtotal = 0n;
  let lineDiscounts = 0n;
  let tax = 0n;

  for (const line of invoice.lines) {
    if (line.quantityMinorUnits <= 0n) throw new Error("Invoice line quantity must be positive");
    if (line.unitPrice.currency !== currency) throw new Error("Invoice currency mismatch");
    if (line.unitPrice.minorUnits < 0n) throw new Error("Unit price cannot be negative");
    if (!Number.isInteger(line.taxRateBasisPoints) || line.taxRateBasisPoints < 0) throw new Error("Tax rate must be a non-negative integer basis-point value");

    const gross = line.quantityMinorUnits * line.unitPrice.minorUnits;
    const discount = line.lineDiscount?.minorUnits ?? 0n;
    if (line.lineDiscount && line.lineDiscount.currency !== currency) throw new Error("Invoice discount currency mismatch");
    if (discount < 0n || discount > gross) throw new Error("Line discount exceeds line gross amount");
    const taxable = gross - discount;
    subtotal += gross;
    lineDiscounts += discount;
    tax += (taxable * BigInt(line.taxRateBasisPoints)) / 10_000n;
  }

  const invoiceDiscount = invoice.invoiceDiscount?.minorUnits ?? 0n;
  if (invoice.invoiceDiscount && invoice.invoiceDiscount.currency !== currency) throw new Error("Invoice discount currency mismatch");
  const afterLineDiscount = subtotal - lineDiscounts;
  if (invoiceDiscount < 0n || invoiceDiscount > afterLineDiscount) throw new Error("Invoice discount exceeds invoice amount");

  // Invoice-level discount reduces taxable base proportionally; to keep integer arithmetic deterministic,
  // tax already computed at line level is reduced by the same ratio using integer truncation.
  const adjustedTax = afterLineDiscount === 0n ? 0n : (tax * (afterLineDiscount - invoiceDiscount)) / afterLineDiscount;
  const taxableBase = afterLineDiscount - invoiceDiscount;
  return {
    subtotal: { currency, minorUnits: subtotal },
    lineDiscounts: { currency, minorUnits: lineDiscounts },
    invoiceDiscount: { currency, minorUnits: invoiceDiscount },
    taxableBase: { currency, minorUnits: taxableBase },
    tax: { currency, minorUnits: adjustedTax },
    grandTotal: { currency, minorUnits: taxableBase + adjustedTax },
  };
}

export interface CreditNote {
  id: string;
  workspaceId: string;
  originalInvoiceId: string;
  issuedAt: Date;
  amount: Money;
  reason: string;
}

export function assertCreditNoteAllowed(input: { invoice: TaxInvoice; previousCredits: CreditNote[]; nextCredit: CreditNote }): void {
  if (input.invoice.workspaceId !== input.nextCredit.workspaceId) throw new Error("Cross-workspace credit note is forbidden");
  if (input.invoice.id !== input.nextCredit.originalInvoiceId) throw new Error("Credit note must reference original invoice");
  if (input.invoice.status !== "ISSUED" && input.invoice.status !== "CREDITED") throw new Error("Only issued invoices can be credited");
  if (input.nextCredit.amount.minorUnits <= 0n) throw new Error("Credit amount must be positive");
  const total = calculateTaxInvoice(input.invoice).grandTotal;
  if (input.nextCredit.amount.currency !== total.currency) throw new Error("Credit currency mismatch");
  const previous = input.previousCredits
    .filter((credit) => credit.originalInvoiceId === input.invoice.id)
    .reduce((sum, credit) => sum + credit.amount.minorUnits, 0n);
  if (previous + input.nextCredit.amount.minorUnits > total.minorUnits) throw new Error("Credit notes exceed original invoice total");
}

export interface ElectronicInvoiceSubmission {
  invoiceId: string;
  workspaceId: string;
  provider: string;
  requestedAt: Date;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "FAILED";
  externalReference?: string;
  errorCode?: string;
  errorMessage?: string;
}

export function formatInvoiceNumber(input: { fiscalYear: string; sequence: number }): string {
  if (!/^\d{4}$/.test(input.fiscalYear)) throw new Error("Fiscal year must be four digits");
  if (!Number.isInteger(input.sequence) || input.sequence <= 0) throw new Error("Invoice sequence must be positive");
  return `${input.fiscalYear}-${String(input.sequence).padStart(6, "0")}`;
}
