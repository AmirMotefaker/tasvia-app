import type { Money } from "../financial-safety/money";
import type { LedgerEntry } from "./ledger-entry";

export interface LedgerPosting {
  debit: LedgerEntry;
  credit: LedgerEntry;
}

export function validateBalancedPosting(
  debit: LedgerEntry,
  credit: LedgerEntry,
): boolean {
  return (
    debit.direction === "DEBIT" &&
    credit.direction === "CREDIT" &&
    debit.amount.currency === credit.amount.currency &&
    debit.amount.minorUnits === credit.amount.minorUnits
  );
}
