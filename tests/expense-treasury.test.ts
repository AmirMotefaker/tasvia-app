import test from "node:test";
import assert from "node:assert/strict";
import { createExpense, createTreasuryTransfer } from "../src/application/accounting/expense-treasury";
import { cashPosition, reconciliationConfidence, type TreasuryAccount } from "../src/domain/accounting/treasury";

const irr = (minorUnits: bigint) => ({ currency: "IRR" as const, minorUnits });

const bank = (overrides: Partial<TreasuryAccount> = {}): TreasuryAccount => ({
  id: "bank:1",
  workspaceId: "ws:1",
  name: "بانک اصلی",
  type: "BANK",
  openingBalance: irr(1_000_000n),
  currentBalance: irr(1_000_000n),
  active: true,
  ...overrides,
});

test("expense produces a balanced debit expense / credit treasury journal", () => {
  const entry = createExpense({
    id: "e1",
    workspaceId: "ws:1",
    actorId: "u1",
    occurredAt: new Date("2026-09-01T08:00:00Z"),
    categoryId: "office",
    amount: irr(250_000n),
    treasuryAccount: bank(),
    expenseAccountId: "expense:office",
    evidenceReference: "receipt-1",
  });
  assert.equal(entry.status, "POSTED");
  assert.equal(entry.lines[0]?.direction, "DEBIT");
  assert.equal(entry.lines[0]?.accountId, "expense:office");
  assert.equal(entry.lines[1]?.direction, "CREDIT");
  assert.equal(entry.lines[1]?.accountId, "bank:1");
});

test("expense rejects cross-workspace and non-positive amounts", () => {
  assert.throws(() => createExpense({
    id: "e2", workspaceId: "ws:2", actorId: "u1", occurredAt: new Date(), categoryId: "x",
    amount: irr(1n), treasuryAccount: bank(), expenseAccountId: "expense:x",
  }), /Cross-workspace/);
  assert.throws(() => createExpense({
    id: "e3", workspaceId: "ws:1", actorId: "u1", occurredAt: new Date(), categoryId: "x",
    amount: irr(0n), treasuryAccount: bank(), expenseAccountId: "expense:x",
  }), /positive/);
});

test("treasury transfer uses debit destination and credit source", () => {
  const entry = createTreasuryTransfer({
    id: "t1", workspaceId: "ws:1", actorId: "u1", occurredAt: new Date(), amount: irr(300_000n),
    from: bank(),
    to: bank({ id: "cash:1", name: "صندوق", type: "CASH", currentBalance: irr(200_000n) }),
  });
  assert.equal(entry.lines[0]?.accountId, "cash:1");
  assert.equal(entry.lines[0]?.direction, "DEBIT");
  assert.equal(entry.lines[1]?.accountId, "bank:1");
  assert.equal(entry.lines[1]?.direction, "CREDIT");
});

test("treasury transfer rejects same account", () => {
  const same = bank();
  assert.throws(() => createTreasuryTransfer({
    id: "t2", workspaceId: "ws:1", actorId: "u1", occurredAt: new Date(), amount: irr(1n), from: same, to: same,
  }), /different/);
});

test("cash position sums active accounts only", () => {
  const total = cashPosition([
    bank({ currentBalance: irr(700_000n) }),
    bank({ id: "cash:1", type: "CASH", currentBalance: irr(200_000n) }),
    bank({ id: "petty:1", type: "PETTY_CASH", currentBalance: irr(50_000n), active: false }),
  ]);
  assert.equal(total.minorUnits, 900_000n);
});

test("reconciliation confidence reaches one for exact amount date and reference", () => {
  const occurredAt = new Date("2026-09-01T08:00:00Z");
  const candidate = reconciliationConfidence({
    bank: { id: "btx1", workspaceId: "ws:1", treasuryAccountId: "bank:1", occurredAt, amount: irr(100_000n), direction: "OUTFLOW", reference: "ABC" },
    accountingAmount: irr(100_000n),
    accountingOccurredAt: occurredAt,
    accountingReference: "ABC",
  });
  assert.equal(candidate.confidence, 1);
  assert.deepEqual(candidate.reasons, ["exact-amount", "date-within-one-day", "exact-reference"]);
});
