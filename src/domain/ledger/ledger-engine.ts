import type { Money } from "../financial-safety/money";
import type { LedgerEntry } from "./ledger-entry";

export function calculateBalance(
  entries: readonly LedgerEntry[],
): Money {
  const total = entries.reduce(
    (sum, entry) =>
      entry.direction === "DEBIT"
        ? sum + entry.amount.minorUnits
        : sum - entry.amount.minorUnits,
    BigInt(0),
  );

  return {
    currency: "IRR",
    minorUnits: total,
  };
}
