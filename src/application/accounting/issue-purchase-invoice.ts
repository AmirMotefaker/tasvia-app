import type { Journal } from "../../domain/accounting/journal";
import type { Payable } from "../../domain/accounting/payable";
import type { CatalogItem, StockMovement, Warehouse } from "../../domain/accounting/inventory";
import { purchaseStockMovements } from "./inventory-integration";
import type { Money } from "../../domain/financial-safety/money";

export interface PurchaseInvoiceLine {
  id: string;
  description: string;
  item?: CatalogItem;
  warehouse?: Warehouse;
  quantityMinorUnits: bigint;
  unitPrice: Money;
  taxRateBasisPoints: number;
}

export interface PurchaseInvoice {
  id: string;
  workspaceId: string;
  supplierId: string;
  number: string;
  issuedAt: Date;
  dueAt: Date;
  lines: PurchaseInvoiceLine[];
  status: "DRAFT" | "ISSUED" | "VOIDED";
}

export interface IssuePurchaseInvoiceCommand {
  invoice: PurchaseInvoice;
  payableAccountId: string;
  inventoryAccountId: string;
  expenseAccountId: string;
  inputTaxAccountId: string;
}

export interface IssuePurchaseInvoiceResult {
  invoice: PurchaseInvoice;
  payable: Payable;
  stockMovements: StockMovement[];
  journal: Journal;
  subtotal: Money;
  tax: Money;
  grandTotal: Money;
}

export function issuePurchaseInvoice(command: IssuePurchaseInvoiceCommand): IssuePurchaseInvoiceResult {
  const { invoice } = command;
  if (invoice.status !== "DRAFT") throw new Error("Only draft purchase invoices can be issued");
  if (!invoice.supplierId.trim()) throw new Error("Purchase invoice requires supplier");
  if (invoice.lines.length === 0) throw new Error("Purchase invoice requires at least one line");
  if (invoice.dueAt.getTime() < invoice.issuedAt.getTime()) throw new Error("Due date cannot precede issue date");

  const currency = invoice.lines[0]!.unitPrice.currency;
  let subtotalMinorUnits = 0n;
  let taxMinorUnits = 0n;
  let inventoryMinorUnits = 0n;
  let expenseMinorUnits = 0n;
  const inventoryInputs = [] as Parameters<typeof purchaseStockMovements>[1];

  for (const line of invoice.lines) {
    if (line.quantityMinorUnits <= 0n) throw new Error("Purchase quantity must be positive");
    if (line.unitPrice.currency !== currency) throw new Error("Purchase invoice currency mismatch");
    if (line.unitPrice.minorUnits < 0n) throw new Error("Purchase unit price cannot be negative");
    if (!Number.isInteger(line.taxRateBasisPoints) || line.taxRateBasisPoints < 0) throw new Error("Purchase tax rate is invalid");
    const base = line.quantityMinorUnits * line.unitPrice.minorUnits;
    const lineTax = (base * BigInt(line.taxRateBasisPoints)) / 10_000n;
    subtotalMinorUnits += base;
    taxMinorUnits += lineTax;

    if (line.item?.type === "STOCK_ITEM") {
      if (!line.warehouse) throw new Error("Stock purchase requires warehouse");
      inventoryMinorUnits += base;
      inventoryInputs.push({ item: line.item, warehouse: line.warehouse, quantityMinorUnits: line.quantityMinorUnits, unitCost: line.unitPrice });
    } else {
      expenseMinorUnits += base;
    }
  }

  const subtotal = { currency, minorUnits: subtotalMinorUnits } satisfies Money;
  const tax = { currency, minorUnits: taxMinorUnits } satisfies Money;
  const grandTotal = { currency, minorUnits: subtotalMinorUnits + taxMinorUnits } satisfies Money;

  const payable: Payable = {
    id: `payable:${invoice.id}`,
    workspaceId: invoice.workspaceId,
    supplierId: invoice.supplierId,
    sourceDocumentId: invoice.id,
    issuedAt: invoice.issuedAt,
    dueAt: invoice.dueAt,
    originalAmount: grandTotal,
    outstandingAmount: grandTotal,
    status: "OPEN",
  };

  const stockMovements = purchaseStockMovements({ workspaceId: invoice.workspaceId, referenceId: invoice.id, occurredAt: invoice.issuedAt }, inventoryInputs);
  const zero = (amountCurrency: Money["currency"]): Money => ({ currency: amountCurrency, minorUnits: 0n });
  const lines: Journal["lines"] = [];

  if (inventoryMinorUnits > 0n) lines.push({ accountId: command.inventoryAccountId, debit: { currency, minorUnits: inventoryMinorUnits }, credit: zero(currency) });
  if (expenseMinorUnits > 0n) lines.push({ accountId: command.expenseAccountId, debit: { currency, minorUnits: expenseMinorUnits }, credit: zero(currency) });
  if (taxMinorUnits > 0n) lines.push({ accountId: command.inputTaxAccountId, debit: tax, credit: zero(currency) });
  lines.push({ accountId: command.payableAccountId, debit: zero(currency), credit: grandTotal });

  return {
    invoice: { ...invoice, status: "ISSUED" },
    payable,
    stockMovements,
    journal: { id: `journal:${invoice.id}`, workspaceId: invoice.workspaceId, occurredAt: invoice.issuedAt, description: `صدور فاکتور خرید ${invoice.number}`, lines },
    subtotal,
    tax,
    grandTotal,
  };
}
