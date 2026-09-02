import type { Account } from "./account";
import type { JournalEntry } from "../journal/journal-entry";

export interface TrialBalanceRow {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: bigint;
  credit: bigint;
}

export interface TrialBalance {
  rows: TrialBalanceRow[];
  totalDebit: bigint;
  totalCredit: bigint;
}

export function buildTrialBalance(accounts: Account[], entries: JournalEntry[]): TrialBalance {
  const byAccount = new Map<string, TrialBalanceRow>();

  for (const account of accounts) {
    byAccount.set(account.id, {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      debit: BigInt(0),
      credit: BigInt(0),
    });
  }

  for (const entry of entries) {
    if (entry.status !== "POSTED") continue;
    for (const line of entry.lines) {
      const row = byAccount.get(line.accountId);
      if (!row) throw new Error(`Unknown account in posted journal: ${line.accountId}`);
      if (line.amount.currency !== "IRR") throw new TypeError("Trial balance currently supports IRR only.");
      if (line.direction === "DEBIT") row.debit += line.amount.minorUnits;
      else row.credit += line.amount.minorUnits;
    }
  }

  const rows = [...byAccount.values()].filter((row) => row.debit !== BigInt(0) || row.credit !== BigInt(0));
  const totalDebit = rows.reduce((sum, row) => sum + row.debit, BigInt(0));
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, BigInt(0));

  if (totalDebit !== totalCredit) throw new Error("Posted ledger is not balanced.");
  return { rows, totalDebit, totalCredit };
}
