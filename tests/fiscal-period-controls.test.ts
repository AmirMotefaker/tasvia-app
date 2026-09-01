import assert from "node:assert/strict";
import test from "node:test";
import { closeFiscalPeriod, reopenFiscalPeriod, reversePostedJournal } from "../src/application/accounting/fiscal-period-controls";
import type { FiscalPeriod } from "../src/domain/accounting/fiscal-period";
import type { Journal } from "../src/domain/accounting/journal";
import type { Money } from "../src/domain/financial-safety/money";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });
const period: FiscalPeriod = {
  id: "p-1405",
  workspaceId: "ws",
  name: "1405",
  startsAt: new Date("2026-03-21T00:00:00Z"),
  endsAt: new Date("2027-03-20T23:59:59Z"),
  status: "OPEN",
};
const journal: Journal = {
  id: "j-1",
  workspaceId: "ws",
  occurredAt: new Date("2026-09-01T00:00:00Z"),
  description: "ثبت فروش",
  lines: [
    { accountId: "cash", debit: m(1_100n), credit: m(0n) },
    { accountId: "revenue", debit: m(0n), credit: m(1_000n) },
    { accountId: "tax", debit: m(0n), credit: m(100n) },
  ],
};

test("closing an open fiscal period locks posting", () => {
  const closed = closeFiscalPeriod(period);
  assert.equal(closed.status, "CLOSED");
  assert.throws(() => reversePostedJournal({ original: journal, reversalId: "j-r", reversalDate: new Date("2026-09-02"), reversalPeriod: closed, reason: "اصلاح", alreadyReversed: false }), /closed/);
});

test("reopening requires an explicit reason", () => {
  const closed = closeFiscalPeriod(period);
  assert.throws(() => reopenFiscalPeriod(closed, "   "), /reason/);
  assert.equal(reopenFiscalPeriod(closed, "اصلاح ثبت دوره").status, "OPEN");
});

test("reversal exactly swaps debit and credit and stays balanced", () => {
  const result = reversePostedJournal({ original: journal, reversalId: "j-r", reversalDate: new Date("2026-09-02"), reversalPeriod: period, reason: "اصلاح سند", alreadyReversed: false });
  assert.equal(result.reversalOfJournalId, "j-1");
  assert.equal(result.journal.lines[0]?.debit.minorUnits, 0n);
  assert.equal(result.journal.lines[0]?.credit.minorUnits, 1_100n);
  const debit = result.journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = result.journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, credit);
});

test("duplicate reversal and cross-workspace reversal are rejected", () => {
  assert.throws(() => reversePostedJournal({ original: journal, reversalId: "j-r", reversalDate: new Date("2026-09-02"), reversalPeriod: period, reason: "اصلاح", alreadyReversed: true }), /already been reversed/);
  assert.throws(() => reversePostedJournal({ original: journal, reversalId: "j-r2", reversalDate: new Date("2026-09-02"), reversalPeriod: { ...period, workspaceId: "other" }, reason: "اصلاح", alreadyReversed: false }), /workspace/);
});

test("reversal date must fall inside an open period", () => {
  assert.throws(() => reversePostedJournal({ original: journal, reversalId: "j-r", reversalDate: new Date("2028-01-01"), reversalPeriod: period, reason: "اصلاح", alreadyReversed: false }), /outside the fiscal period/);
});
