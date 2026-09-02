import type { Money } from "../financial-safety/money";

export type FinancialAccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export interface FinancialAccount {
  id: string;
  workspaceId: string;
  code: string;
  name: string;
  type: FinancialAccountType;
}

export interface PostedLedgerLine {
  id: string;
  workspaceId: string;
  journalId: string;
  accountId: string;
  occurredAt: Date;
  debit: Money;
  credit: Money;
  sourceDocumentId?: string;
}

export interface TrialBalanceRow {
  account: FinancialAccount;
  debit: Money;
  credit: Money;
  balance: Money;
}

function assertIrr(money: Money): void {
  if (money.currency !== "IRR") throw new Error("Currency mismatch in financial statements");
}

function irr(minorUnits: bigint): Money {
  return { currency: "IRR", minorUnits };
}

export function trialBalance(input: { workspaceId: string; accounts: FinancialAccount[]; lines: PostedLedgerLine[] }): TrialBalanceRow[] {
  const accounts = input.accounts.filter((account) => account.workspaceId === input.workspaceId);
  const byId = new Map(accounts.map((account) => [account.id, account]));
  const totals = new Map<string, { debit: bigint; credit: bigint }>();
  for (const line of input.lines) {
    if (line.workspaceId !== input.workspaceId) continue;
    if (!byId.has(line.accountId)) throw new Error("Ledger line references unknown workspace account");
    assertIrr(line.debit);
    assertIrr(line.credit);
    const current = totals.get(line.accountId) ?? { debit: 0n, credit: 0n };
    current.debit += line.debit.minorUnits;
    current.credit += line.credit.minorUnits;
    totals.set(line.accountId, current);
  }
  return accounts.map((account): TrialBalanceRow => {
    const total = totals.get(account.id) ?? { debit: 0n, credit: 0n };
    const naturalDebit = account.type === "ASSET" || account.type === "EXPENSE";
    const balance = naturalDebit ? total.debit - total.credit : total.credit - total.debit;
    return { account, debit: irr(total.debit), credit: irr(total.credit), balance: irr(balance) };
  });
}

export function profitAndLoss(rows: TrialBalanceRow[]) {
  const revenue = rows.filter((row) => row.account.type === "REVENUE").reduce((sum, row) => sum + row.balance.minorUnits, 0n);
  const expense = rows.filter((row) => row.account.type === "EXPENSE").reduce((sum, row) => sum + row.balance.minorUnits, 0n);
  return { revenue: irr(revenue), expense: irr(expense), netProfit: irr(revenue - expense) };
}

export function balanceSheet(rows: TrialBalanceRow[]) {
  const sum = (type: FinancialAccountType) => rows.filter((row) => row.account.type === type).reduce((total, row) => total + row.balance.minorUnits, 0n);
  const assets = sum("ASSET");
  const liabilities = sum("LIABILITY");
  const equity = sum("EQUITY");
  const currentEarnings = sum("REVENUE") - sum("EXPENSE");
  return { assets: irr(assets), liabilities: irr(liabilities), equity: irr(equity), currentEarnings: irr(currentEarnings), liabilitiesAndEquity: irr(liabilities + equity + currentEarnings) };
}

export function accountDrillDown(input: { workspaceId: string; accountId: string; lines: PostedLedgerLine[] }) {
  return input.lines.filter((line) => line.workspaceId === input.workspaceId && line.accountId === input.accountId).sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
}
