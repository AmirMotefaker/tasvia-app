import assert from "node:assert/strict";
import test from "node:test";
import { balanceSheet, profitAndLoss, trialBalance, type FinancialAccount, type PostedLedgerLine } from "../src/domain/accounting/financial-statements";
import type { Money } from "../src/domain/financial-safety/money";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });
const accounts: FinancialAccount[] = [
  { id: "cash", workspaceId: "ws", code: "101", name: "بانک", type: "ASSET" },
  { id: "equity", workspaceId: "ws", code: "301", name: "سرمایه", type: "EQUITY" },
  { id: "revenue", workspaceId: "ws", code: "401", name: "فروش", type: "REVENUE" },
  { id: "expense", workspaceId: "ws", code: "501", name: "هزینه", type: "EXPENSE" },
];
const lines: PostedLedgerLine[] = [
  { id: "1", workspaceId: "ws", journalId: "j1", accountId: "cash", occurredAt: new Date("2026-09-01"), debit: m(1_000n), credit: m(0n) },
  { id: "2", workspaceId: "ws", journalId: "j1", accountId: "equity", occurredAt: new Date("2026-09-01"), debit: m(0n), credit: m(1_000n) },
  { id: "3", workspaceId: "ws", journalId: "j2", accountId: "cash", occurredAt: new Date("2026-09-02"), debit: m(500n), credit: m(0n), sourceDocumentId: "sale-1" },
  { id: "4", workspaceId: "ws", journalId: "j2", accountId: "revenue", occurredAt: new Date("2026-09-02"), debit: m(0n), credit: m(500n), sourceDocumentId: "sale-1" },
  { id: "5", workspaceId: "ws", journalId: "j3", accountId: "expense", occurredAt: new Date("2026-09-03"), debit: m(200n), credit: m(0n), sourceDocumentId: "expense-1" },
  { id: "6", workspaceId: "ws", journalId: "j3", accountId: "cash", occurredAt: new Date("2026-09-03"), debit: m(0n), credit: m(200n), sourceDocumentId: "expense-1" },
];

test("trial balance produces natural account balances", () => {
  const rows = trialBalance({ workspaceId: "ws", accounts, lines });
  assert.equal(rows.find((row) => row.account.id === "cash")?.balance.minorUnits, 1_300n);
  assert.equal(rows.find((row) => row.account.id === "revenue")?.balance.minorUnits, 500n);
});

test("profit and loss calculates exact net profit", () => {
  const report = profitAndLoss(trialBalance({ workspaceId: "ws", accounts, lines }));
  assert.equal(report.revenue.minorUnits, 500n);
  assert.equal(report.expense.minorUnits, 200n);
  assert.equal(report.netProfit.minorUnits, 300n);
});

test("balance sheet includes current earnings", () => {
  const report = balanceSheet(trialBalance({ workspaceId: "ws", accounts, lines }));
  assert.equal(report.assets.minorUnits, 1_300n);
  assert.equal(report.currentEarnings.minorUnits, 300n);
  assert.equal(report.liabilitiesAndEquity.minorUnits, 1_300n);
});
