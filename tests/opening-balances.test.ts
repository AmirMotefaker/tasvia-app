import assert from "node:assert/strict";
import test from "node:test";
import { createOpeningBalanceJournal } from "../src/application/accounting/opening-balances";
import type { AccountingDimensionValue } from "../src/domain/accounting/dimensions";
import type { Money } from "../src/domain/financial-safety/money";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });
const values: AccountingDimensionValue[] = [
  { id: "branch-main", workspaceId: "ws", type: "BRANCH", code: "MAIN", name: "مرکزی", active: true },
  { id: "branch-other", workspaceId: "other", type: "BRANCH", code: "OTHER", name: "خارج", active: true },
];

test("opening balance auto-balances through designated equity account", () => {
  const result = createOpeningBalanceJournal({
    id: "opening-1",
    workspaceId: "ws",
    fiscalPeriodId: "fy-1405",
    occurredAt: new Date("2026-03-21T00:00:00Z"),
    openingEquityAccountId: "opening-equity",
    dimensionValues: values,
    lines: [
      { accountId: "cash", debit: m(1_000n), credit: m(0n), dimensions: [{ dimensionType: "BRANCH", allocations: [{ dimensionValueId: "branch-main", basisPoints: 10_000 }] }] },
      { accountId: "payable", debit: m(0n), credit: m(300n) },
    ],
  });
  const debit = result.journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = result.journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, 1_000n);
  assert.equal(credit, 1_000n);
  assert.equal(result.journal.lines.at(-1)?.accountId, "opening-equity");
  assert.equal(result.journal.lines.at(-1)?.credit.minorUnits, 700n);
});

test("already balanced opening entries need no balancing line", () => {
  const result = createOpeningBalanceJournal({
    id: "opening-2", workspaceId: "ws", fiscalPeriodId: "fy", occurredAt: new Date("2026-03-21"), openingEquityAccountId: "opening-equity", dimensionValues: values,
    lines: [{ accountId: "cash", debit: m(500n), credit: m(0n) }, { accountId: "equity", debit: m(0n), credit: m(500n) }],
  });
  assert.equal(result.journal.lines.length, 2);
});

test("zero-only opening balance is rejected", () => {
  assert.throws(() => createOpeningBalanceJournal({
    id: "opening-zero", workspaceId: "ws", fiscalPeriodId: "fy", occurredAt: new Date("2026-03-21"), openingEquityAccountId: "opening-equity", dimensionValues: values,
    lines: [{ accountId: "cash", debit: m(0n), credit: m(0n) }],
  }), /zero-only/);
});

test("cross-workspace opening dimension is rejected", () => {
  assert.throws(() => createOpeningBalanceJournal({
    id: "opening-cross", workspaceId: "ws", fiscalPeriodId: "fy", occurredAt: new Date("2026-03-21"), openingEquityAccountId: "opening-equity", dimensionValues: values,
    lines: [{ accountId: "cash", debit: m(100n), credit: m(0n), dimensions: [{ dimensionType: "BRANCH", allocations: [{ dimensionValueId: "branch-other", basisPoints: 10_000 }] }] }],
  }), /Cross-workspace/);
});
