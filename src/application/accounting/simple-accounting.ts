import type { Money } from "../../domain/financial-safety/money";
import type { JournalEntry } from "../../domain/journal/journal-entry";
import type { JournalLine } from "../../domain/journal/journal-line";
import { validateDoubleEntry } from "../../domain/journal/journal-validation";
import type { Receivable } from "../../domain/accounting/receivable";
import type { Payable } from "../../domain/accounting/payable";

export interface AccountingCommandContext {
  workspaceId: string;
  actorId: string;
  occurredAt: Date;
}

export interface AccountingAccountMap {
  cashAccountId: string;
  receivableAccountId: string;
  payableAccountId: string;
  revenueAccountId: string;
  expenseAccountId: string;
}

export interface CreateSaleCommand extends AccountingCommandContext {
  id: string;
  customerId: string;
  amount: Money;
  dueAt?: Date;
  accounts: AccountingAccountMap;
}

export interface CreatePurchaseCommand extends AccountingCommandContext {
  id: string;
  supplierId: string;
  amount: Money;
  dueAt: Date;
  accounts: AccountingAccountMap;
}

function line(entryId: string, id: string, accountId: string, direction: "DEBIT" | "CREDIT", amount: Money): JournalLine {
  return { id, journalEntryId: entryId, accountId, direction, amount };
}

function balancedEntry(id: string, reference: string, description: string, occurredAt: Date, lines: JournalLine[]): JournalEntry {
  const entry: JournalEntry = { id, reference, description, status: "POSTED", lines, createdAt: occurredAt };
  if (!validateDoubleEntry(entry)) throw new Error("Accounting command produced an unbalanced journal entry");
  return entry;
}

export function createSale(command: CreateSaleCommand): { receivable: Receivable; journalEntry: JournalEntry } {
  if (command.amount.minorUnits <= 0n) throw new Error("Sale amount must be positive");
  const entryId = `sale:${command.id}`;
  const receivable: Receivable = {
    id: `ar:${command.id}`,
    workspaceId: command.workspaceId,
    customerId: command.customerId,
    sourceId: command.id,
    originalAmount: command.amount,
    outstandingAmount: command.amount,
    issuedAt: command.occurredAt,
    dueAt: command.dueAt,
    status: "OPEN",
  };
  const journalEntry = balancedEntry(entryId, command.id, "ثبت فروش", command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.accounts.receivableAccountId, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.accounts.revenueAccountId, "CREDIT", command.amount),
  ]);
  return { receivable, journalEntry };
}

export function createPurchase(command: CreatePurchaseCommand): { payable: Payable; journalEntry: JournalEntry } {
  if (command.amount.minorUnits <= 0n) throw new Error("Purchase amount must be positive");
  const entryId = `purchase:${command.id}`;
  const payable: Payable = {
    id: `ap:${command.id}`,
    workspaceId: command.workspaceId,
    supplierId: command.supplierId,
    sourceDocumentId: command.id,
    issuedAt: command.occurredAt,
    dueAt: command.dueAt,
    originalAmount: command.amount,
    outstandingAmount: command.amount,
    status: "OPEN",
  };
  const journalEntry = balancedEntry(entryId, command.id, "ثبت خرید/هزینه", command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.accounts.expenseAccountId, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.accounts.payableAccountId, "CREDIT", command.amount),
  ]);
  return { payable, journalEntry };
}

export function createReceiptJournal(command: AccountingCommandContext & { id: string; amount: Money; accounts: AccountingAccountMap }): JournalEntry {
  if (command.amount.minorUnits <= 0n) throw new Error("Receipt amount must be positive");
  const entryId = `receipt:${command.id}`;
  return balancedEntry(entryId, command.id, "دریافت از مشتری", command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.accounts.cashAccountId, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.accounts.receivableAccountId, "CREDIT", command.amount),
  ]);
}

export function createSupplierPaymentJournal(command: AccountingCommandContext & { id: string; amount: Money; accounts: AccountingAccountMap }): JournalEntry {
  if (command.amount.minorUnits <= 0n) throw new Error("Payment amount must be positive");
  const entryId = `payment:${command.id}`;
  return balancedEntry(entryId, command.id, "پرداخت به تأمین‌کننده", command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.accounts.payableAccountId, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.accounts.cashAccountId, "CREDIT", command.amount),
  ]);
}
