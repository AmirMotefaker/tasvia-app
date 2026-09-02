import type { Journal } from "../../domain/accounting/journal";
import type { Receivable } from "../../domain/accounting/receivable";
import { assertCreditNoteAllowed, calculateTaxInvoice, type CreditNote, type TaxInvoice } from "../../domain/accounting/tax-invoice";

export interface IssueCreditNoteCommand {
  invoice: TaxInvoice;
  receivable: Receivable;
  previousCredits: CreditNote[];
  creditNote: CreditNote;
  revenueAccountId: string;
  receivableAccountId: string;
  taxPayableAccountId: string;
}

export interface IssueCreditNoteResult {
  creditNote: CreditNote;
  invoice: TaxInvoice;
  receivable: Receivable;
  journal: Journal;
}

export function issueCreditNote(command: IssueCreditNoteCommand): IssueCreditNoteResult {
  const { invoice, receivable, creditNote } = command;
  assertCreditNoteAllowed({ invoice, previousCredits: command.previousCredits, nextCredit: creditNote });
  if (receivable.workspaceId !== invoice.workspaceId || receivable.sourceDocumentId !== invoice.id) {
    throw new Error("Receivable does not belong to invoice");
  }
  if (creditNote.amount.minorUnits > receivable.outstandingAmount.minorUnits) {
    throw new Error("Credit note exceeds outstanding receivable");
  }
  if (new Set([command.revenueAccountId, command.receivableAccountId, command.taxPayableAccountId]).size !== 3) {
    throw new Error("Credit-note accounting accounts must differ");
  }

  const totals = calculateTaxInvoice(invoice);
  const taxPart = totals.grandTotal.minorUnits === 0n
    ? 0n
    : (creditNote.amount.minorUnits * totals.tax.minorUnits) / totals.grandTotal.minorUnits;
  const revenuePart = creditNote.amount.minorUnits - taxPart;
  const currency = creditNote.amount.currency;
  const nextOutstanding = receivable.outstandingAmount.minorUnits - creditNote.amount.minorUnits;
  const totalCredited = command.previousCredits.reduce((sum, credit) => sum + credit.amount.minorUnits, 0n) + creditNote.amount.minorUnits;

  return {
    creditNote,
    invoice: { ...invoice, status: totalCredited === totals.grandTotal.minorUnits ? "CREDITED" : invoice.status },
    receivable: {
      ...receivable,
      outstandingAmount: { currency, minorUnits: nextOutstanding },
      status: nextOutstanding === 0n ? "PAID" : "PARTIALLY_PAID",
    },
    journal: {
      id: `journal:${creditNote.id}`,
      workspaceId: invoice.workspaceId,
      occurredAt: creditNote.issuedAt,
      description: `برگشت از فروش ${invoice.number}: ${creditNote.reason}`,
      lines: [
        {
          accountId: command.revenueAccountId,
          debit: { currency, minorUnits: revenuePart },
          credit: { currency, minorUnits: 0n },
        },
        ...(taxPart > 0n ? [{
          accountId: command.taxPayableAccountId,
          debit: { currency, minorUnits: taxPart },
          credit: { currency, minorUnits: 0n },
        }] : []),
        {
          accountId: command.receivableAccountId,
          debit: { currency, minorUnits: 0n },
          credit: creditNote.amount,
        },
      ],
    },
  };
}
