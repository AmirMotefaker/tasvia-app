import type { Money } from "../financial-safety/money";

export interface JournalLine {
  accountId: string;
  debit: Money;
  credit: Money;
  description?: string;
}

export interface Journal {
  id: string;
  workspaceId: string;
  occurredAt: Date;
  description: string;
  lines: JournalLine[];
}

export function assertBalancedJournal(journal: Journal): void {
  if (journal.lines.length < 2) throw new Error("Journal requires at least two lines");
  const debit = journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  if (debit !== credit) throw new Error("Journal must be balanced");
}
