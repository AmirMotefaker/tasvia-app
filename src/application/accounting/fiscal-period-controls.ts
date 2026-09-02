import { assertBalancedJournal, type Journal } from "../../domain/accounting/journal";
import { assertPostingAllowed, assertValidFiscalPeriod, type FiscalPeriod } from "../../domain/accounting/fiscal-period";

export function closeFiscalPeriod(period: FiscalPeriod): FiscalPeriod {
  assertValidFiscalPeriod(period);
  if (period.status === "CLOSED") throw new Error("Fiscal period is already closed");
  return { ...period, status: "CLOSED" };
}

export function reopenFiscalPeriod(period: FiscalPeriod, reason: string): FiscalPeriod {
  assertValidFiscalPeriod(period);
  if (period.status !== "CLOSED") throw new Error("Only a closed fiscal period can be reopened");
  if (!reason.trim()) throw new Error("Fiscal period reopen reason is required");
  return { ...period, status: "OPEN" };
}

export interface ReverseJournalCommand {
  original: Journal;
  reversalId: string;
  reversalDate: Date;
  reversalPeriod: FiscalPeriod;
  reason: string;
  alreadyReversed: boolean;
}

export interface ReverseJournalResult {
  journal: Journal;
  reversalOfJournalId: string;
  reason: string;
}

export function reversePostedJournal(command: ReverseJournalCommand): ReverseJournalResult {
  if (!command.reversalId.trim()) throw new Error("Reversal journal id is required");
  if (!command.reason.trim()) throw new Error("Reversal reason is required");
  if (command.alreadyReversed) throw new Error("Journal has already been reversed");
  if (command.original.workspaceId !== command.reversalPeriod.workspaceId) {
    throw new Error("Reversal fiscal period must belong to journal workspace");
  }

  assertBalancedJournal(command.original);
  assertPostingAllowed(command.reversalPeriod, command.reversalDate);

  const journal: Journal = {
    id: command.reversalId,
    workspaceId: command.original.workspaceId,
    occurredAt: command.reversalDate,
    description: `برگشت سند ${command.original.id}: ${command.reason.trim()}`,
    lines: command.original.lines.map((line) => ({
      accountId: line.accountId,
      debit: line.credit,
      credit: line.debit,
      description: line.description,
    })),
  };

  assertBalancedJournal(journal);
  return { journal, reversalOfJournalId: command.original.id, reason: command.reason.trim() };
}
