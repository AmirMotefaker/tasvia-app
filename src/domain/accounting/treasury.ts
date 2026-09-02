import type { Money } from "../financial-safety/money";

export type TreasuryAccountType = "BANK" | "CASH" | "PETTY_CASH";

export interface TreasuryAccount {
  id: string;
  workspaceId: string;
  name: string;
  type: TreasuryAccountType;
  openingBalance: Money;
  currentBalance: Money;
  bankName?: string;
  iban?: string;
  cardNumber?: string;
  active: boolean;
}

export interface BankStatementTransaction {
  id: string;
  workspaceId: string;
  treasuryAccountId: string;
  occurredAt: Date;
  amount: Money;
  direction: "INFLOW" | "OUTFLOW";
  reference?: string;
  description?: string;
}

export interface ReconciliationCandidate {
  bankTransactionId: string;
  accountingReferenceId: string;
  confidence: number;
  reasons: string[];
}

export function assertTreasuryAccount(account: TreasuryAccount): void {
  if (!account.id.trim()) throw new Error("Treasury account id is required");
  if (!account.workspaceId.trim()) throw new Error("Treasury workspace is required");
  if (!account.name.trim()) throw new Error("Treasury account name is required");
  if (account.openingBalance.currency !== account.currentBalance.currency) throw new Error("Treasury currency mismatch");
}

export function cashPosition(accounts: TreasuryAccount[]): Money {
  const active = accounts.filter((account) => account.active);
  const currency = active[0]?.currentBalance.currency ?? "IRR";
  return active.reduce<Money>((total, account) => {
    if (account.currentBalance.currency !== currency) throw new Error("Cash position currency mismatch");
    return { currency, minorUnits: total.minorUnits + account.currentBalance.minorUnits };
  }, { currency, minorUnits: 0n });
}

export function reconciliationConfidence(input: {
  bank: BankStatementTransaction;
  accountingAmount: Money;
  accountingOccurredAt: Date;
  accountingReference?: string;
}): ReconciliationCandidate {
  if (input.bank.amount.currency !== input.accountingAmount.currency) {
    return { bankTransactionId: input.bank.id, accountingReferenceId: input.accountingReference ?? "unknown", confidence: 0, reasons: ["currency-mismatch"] };
  }
  let confidence = 0;
  const reasons: string[] = [];
  if (input.bank.amount.minorUnits === input.accountingAmount.minorUnits) { confidence += 0.6; reasons.push("exact-amount"); }
  const days = Math.abs(input.bank.occurredAt.getTime() - input.accountingOccurredAt.getTime()) / 86_400_000;
  if (days <= 1) { confidence += 0.25; reasons.push("date-within-one-day"); }
  else if (days <= 3) { confidence += 0.1; reasons.push("date-within-three-days"); }
  if (input.bank.reference && input.accountingReference && input.bank.reference === input.accountingReference) { confidence += 0.15; reasons.push("exact-reference"); }
  return {
    bankTransactionId: input.bank.id,
    accountingReferenceId: input.accountingReference ?? "unknown",
    confidence: Math.min(1, confidence),
    reasons,
  };
}
