import type { Journal } from "../../domain/accounting/journal";
import type { Receivable } from "../../domain/accounting/receivable";
import { calculateTaxInvoice, type InvoiceTotals, type TaxInvoice } from "../../domain/accounting/tax-invoice";

export interface IssueSalesInvoiceCommand {
  invoice: TaxInvoice;
  dueAt: Date;
  revenueAccountId: string;
  receivableAccountId: string;
  taxPayableAccountId: string;
}

export interface IssueSalesInvoiceResult {
  invoice: TaxInvoice;
  totals: InvoiceTotals;
  receivable: Receivable;
  journal: Journal;
}

export function issueSalesInvoice(command: IssueSalesInvoiceCommand): IssueSalesInvoiceResult {
  const { invoice } = command;
  if (invoice.status !== "DRAFT") throw new Error("Only draft invoices can be issued");
  if (!invoice.customerId) throw new Error("Sales invoice requires a customer");
  if (invoice.lines.length === 0) throw new Error("Sales invoice requires at least one line");
  if (command.dueAt.getTime() < invoice.issuedAt.getTime()) throw new Error("Due date cannot precede issue date");
  if (new Set([command.revenueAccountId, command.receivableAccountId, command.taxPayableAccountId]).size !== 3) {
    throw new Error("Invoice accounting accounts must differ");
  }

  const totals = calculateTaxInvoice(invoice);
  if (totals.grandTotal.minorUnits <= 0n) throw new Error("Invoice total must be positive");

  const issuedInvoice: TaxInvoice = { ...invoice, status: "ISSUED" };
  const receivable: Receivable = {
    id: `receivable:${invoice.id}`,
    workspaceId: invoice.workspaceId,
    customerId: invoice.customerId,
    sourceDocumentId: invoice.id,
    issuedAt: invoice.issuedAt,
    dueAt: command.dueAt,
    originalAmount: totals.grandTotal,
    outstandingAmount: totals.grandTotal,
    status: "OPEN",
  };

  const journal: Journal = {
    id: `journal:${invoice.id}`,
    workspaceId: invoice.workspaceId,
    occurredAt: invoice.issuedAt,
    description: `صدور فاکتور فروش ${invoice.number}`,
    lines: [
      {
        accountId: command.receivableAccountId,
        debit: totals.grandTotal,
        credit: { currency: totals.grandTotal.currency, minorUnits: 0n },
      },
      {
        accountId: command.revenueAccountId,
        debit: { currency: totals.taxableBase.currency, minorUnits: 0n },
        credit: totals.taxableBase,
      },
      ...(totals.tax.minorUnits > 0n
        ? [{
            accountId: command.taxPayableAccountId,
            debit: { currency: totals.tax.currency, minorUnits: 0n },
            credit: totals.tax,
          }]
        : []),
    ],
  };

  return { invoice: issuedInvoice, totals, receivable, journal };
}
