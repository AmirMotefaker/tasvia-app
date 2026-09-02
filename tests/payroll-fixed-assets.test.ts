import assert from "node:assert/strict";
import test from "node:test";
import type { Money } from "../src/domain/financial-safety/money";
import { payrollJournalProjection, payrollLineNetPay, payrollRunTotals, type PayrollPayee, type PayrollRun } from "../src/domain/accounting/payroll";
import { depreciationJournalProjection, straightLineDepreciation, type FixedAsset } from "../src/domain/accounting/fixed-assets";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });

const payees: PayrollPayee[] = [
  { id: "emp-1", workspaceId: "ws", name: "کارمند یک", active: true },
  { id: "emp-2", workspaceId: "ws", name: "کارمند دو", active: true },
];

const run: PayrollRun = {
  id: "payroll-1405-06",
  workspaceId: "ws",
  periodLabel: "شهریور ۱۴۰۵",
  occurredAt: new Date("2026-09-01T00:00:00Z"),
  lines: [
    { id: "l1", payeeId: "emp-1", grossPay: m(1000n), deductions: m(100n) },
    { id: "l2", payeeId: "emp-2", grossPay: m(2000n), deductions: m(250n) },
  ],
};

test("payroll net pay and totals remain exact", () => {
  assert.equal(payrollLineNetPay(run.lines[0]).minorUnits, 900n);
  const totals = payrollRunTotals(run, payees);
  assert.equal(totals.grossPay.minorUnits, 3000n);
  assert.equal(totals.deductions.minorUnits, 350n);
  assert.equal(totals.netPay.minorUnits, 2650n);
});

test("payroll journal projection is balanced", () => {
  const journal = payrollJournalProjection({ run, payees, payrollExpenseAccountId: "expense", payrollPayableAccountId: "payable", deductionLiabilityAccountId: "deductions" });
  const debit = journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, credit);
});

test("payroll rejects deductions above gross pay", () => {
  assert.throws(() => payrollLineNetPay({ id: "bad", payeeId: "emp-1", grossPay: m(100n), deductions: m(101n) }), /cannot exceed gross pay/);
});

const asset: FixedAsset = {
  id: "asset-1",
  workspaceId: "ws",
  name: "تجهیزات",
  acquiredAt: new Date("2026-01-01T00:00:00Z"),
  acquisitionCost: m(1_200_000n),
  residualValue: m(120_000n),
  usefulLifeMonths: 36,
  active: true,
};

test("straight-line depreciation keeps exact carrying amount", () => {
  const projection = straightLineDepreciation(asset, 12);
  assert.equal(projection.depreciableBase.minorUnits, 1_080_000n);
  assert.equal(projection.monthlyDepreciation.minorUnits, 30_000n);
  assert.equal(projection.accumulatedDepreciation.minorUnits, 360_000n);
  assert.equal(projection.carryingAmount.minorUnits, 840_000n);
});

test("depreciation journal projection is balanced", () => {
  const journal = depreciationJournalProjection({ asset, periodMonths: 1, occurredAt: new Date("2026-02-01T00:00:00Z"), depreciationExpenseAccountId: "depr-expense", accumulatedDepreciationAccountId: "acc-depr" });
  assert.equal(journal.lines[0].debit.minorUnits, journal.lines[1].credit.minorUnits);
});

test("fixed asset rejects residual value above acquisition cost", () => {
  assert.throws(() => straightLineDepreciation({ ...asset, residualValue: m(1_300_000n) }, 1), /Residual value cannot exceed acquisition cost/);
});
