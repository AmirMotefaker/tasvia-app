import type { Money } from "../../domain/financial-safety/money";
import type { JournalEntry } from "../../domain/journal/journal-entry";
import type { JournalLine } from "../../domain/journal/journal-line";
import { validateDoubleEntry } from "../../domain/journal/journal-validation";
import type { TreasuryAccount } from "../../domain/accounting/treasury";

export interface ExpenseCommand {
  id: string;
  workspaceId: string;
  actorId: string;
  occurredAt: Date;
  categoryId: string;
  amount: Money;
  treasuryAccount: TreasuryAccount;
  expenseAccountId: string;
  evidenceReference?: string;
}

export interface TreasuryTransferCommand {
  id: string;
  workspaceId: string;
  actorId: string;
  occurredAt: Date;
  amount: Money;
  from: TreasuryAccount;
  to: TreasuryAccount;
}

function line(entryId: string, id: string, accountId: string, direction: "DEBIT" | "CREDIT", amount: Money): JournalLine {
  return { id, journalEntryId: entryId, accountId, direction, amount };
}

function balanced(id: string, reference: string, description: string, occurredAt: Date, lines: JournalLine[]): JournalEntry {
  const entry: JournalEntry = { id, reference, description, status: "POSTED", lines, createdAt: occurredAt };
  if (!validateDoubleEntry(entry)) throw new Error("Treasury command produced an unbalanced journal entry");
  return entry;
}

export function createExpense(command: ExpenseCommand): JournalEntry {
  if (command.amount.minorUnits <= 0n) throw new Error("Expense amount must be positive");
  if (command.treasuryAccount.workspaceId !== command.workspaceId) throw new Error("Cross-workspace expense is forbidden");
  if (!command.treasuryAccount.active) throw new Error("Treasury account is inactive");
  if (command.treasuryAccount.currentBalance.currency !== command.amount.currency) throw new Error("Expense currency mismatch");
  const entryId = `expense:${command.id}`;
  return balanced(entryId, command.evidenceReference ?? command.id, `هزینه: ${command.categoryId}`, command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.expenseAccountId, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.treasuryAccount.id, "CREDIT", command.amount),
  ]);
}

export function createTreasuryTransfer(command: TreasuryTransferCommand): JournalEntry {
  if (command.amount.minorUnits <= 0n) throw new Error("Transfer amount must be positive");
  if (command.from.id === command.to.id) throw new Error("Transfer accounts must be different");
  if (command.from.workspaceId !== command.workspaceId || command.to.workspaceId !== command.workspaceId) throw new Error("Cross-workspace transfer is forbidden");
  if (!command.from.active || !command.to.active) throw new Error("Treasury account is inactive");
  if (command.from.currentBalance.currency !== command.amount.currency || command.to.currentBalance.currency !== command.amount.currency) throw new Error("Transfer currency mismatch");
  const entryId = `transfer:${command.id}`;
  return balanced(entryId, command.id, "انتقال بین حساب‌های خزانه", command.occurredAt, [
    line(entryId, `${entryId}:dr`, command.to.id, "DEBIT", command.amount),
    line(entryId, `${entryId}:cr`, command.from.id, "CREDIT", command.amount),
  ]);
}
