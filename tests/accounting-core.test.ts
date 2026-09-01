import test from "node:test";
import assert from "node:assert/strict";
import { createStarterChart, validateChart } from "../src/domain/accounting/chart-of-accounts";
import { assertPostingAllowed, type FiscalPeriod } from "../src/domain/accounting/fiscal-period";
import { buildTrialBalance } from "../src/domain/accounting/trial-balance";
import { irr } from "../src/domain/financial-safety/money";
import type { JournalEntry } from "../src/domain/journal/journal-entry";

test("starter chart is valid and service preset omits inventory accounts", () => {
  const general = createStarterChart("GENERAL");
  const services = createStarterChart("SERVICES");
  validateChart(general);
  validateChart(services);
  assert.equal(general.some((a) => a.id === "inventory"), true);
  assert.equal(services.some((a) => a.id === "inventory"), false);
});

test("closed fiscal periods reject posting", () => {
  const period: FiscalPeriod = {
    id: "fy-1405",
    workspaceId: "ws-1",
    name: "سال مالی ۱۴۰۵",
    startsAt: new Date("2026-03-21T00:00:00.000Z"),
    endsAt: new Date("2027-03-20T23:59:59.999Z"),
    status: "CLOSED",
  };
  assert.throws(() => assertPostingAllowed(period, new Date("2026-09-01T00:00:00.000Z")), /closed/);
});

test("trial balance includes only posted entries and remains balanced", () => {
  const accounts = createStarterChart("GENERAL");
  const posted: JournalEntry = {
    id: "j1",
    reference: "sale-1",
    description: "فروش نقدی",
    status: "POSTED",
    createdAt: new Date("2026-09-01T00:00:00.000Z"),
    lines: [
      { id: "l1", journalEntryId: "j1", accountId: "cash", direction: "DEBIT", amount: irr(1_000_000) },
      { id: "l2", journalEntryId: "j1", accountId: "sales", direction: "CREDIT", amount: irr(1_000_000) },
    ],
  };
  const draft: JournalEntry = {
    ...posted,
    id: "j2",
    reference: "draft",
    status: "DRAFT",
    lines: posted.lines.map((line, i) => ({ ...line, id: `d${i}`, journalEntryId: "j2" })),
  };

  const result = buildTrialBalance(accounts, [posted, draft]);
  assert.equal(result.totalDebit, BigInt(1_000_000));
  assert.equal(result.totalCredit, BigInt(1_000_000));
  assert.equal(result.rows.length, 2);
});
