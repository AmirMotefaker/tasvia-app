import type { Money } from "../financial-safety/money";

export type LedgerDirection = "DEBIT" | "CREDIT";

export interface LedgerEntry {
  id: string;
  accountId: string;
  transactionId: string;
  direction: LedgerDirection;
  amount: Money;
  createdAt: Date;
}
