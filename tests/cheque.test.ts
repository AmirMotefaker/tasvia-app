import assert from "node:assert/strict";
import test from "node:test";
import { effectiveChequeStatus, projectChequeDueState, transitionCheque, type Cheque } from "../src/domain/accounting/cheque";
import type { Money } from "../src/domain/financial-safety/money";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });

const cheque: Cheque = {
  id: "chq-1",
  workspaceId: "ws-1",
  counterpartyId: "cp-1",
  direction: "RECEIVED",
  chequeNumber: "123456",
  amount: m(5_000_000n),
  issuedAt: new Date("2026-09-01T00:00:00Z"),
  dueAt: new Date("2026-09-10T00:00:00Z"),
  status: "REGISTERED",
};

test("registered cheque becomes due at due date", () => {
  assert.equal(effectiveChequeStatus(cheque, new Date("2026-09-09T00:00:00Z")), "REGISTERED");
  assert.equal(effectiveChequeStatus(cheque, new Date("2026-09-10T00:00:00Z")), "DUE");
});

test("due projection distinguishes upcoming, due today and overdue", () => {
  assert.equal(projectChequeDueState(cheque, new Date("2026-09-09T00:00:00Z"))?.state, "UPCOMING");
  assert.equal(projectChequeDueState(cheque, new Date("2026-09-10T00:00:00Z"))?.state, "DUE_TODAY");
  assert.equal(projectChequeDueState(cheque, new Date("2026-09-11T00:00:00Z"))?.state, "OVERDUE");
});

test("valid lifecycle supports clearing and bouncing from due", () => {
  const due = transitionCheque(cheque, "DUE");
  assert.equal(transitionCheque(due, "CLEARED").status, "CLEARED");
  assert.equal(transitionCheque(due, "BOUNCED").status, "BOUNCED");
});

test("terminal cheque states cannot be destructively rewritten", () => {
  const cleared = transitionCheque(cheque, "CLEARED");
  assert.throws(() => transitionCheque(cleared, "BOUNCED"), /Invalid cheque transition/);
  assert.equal(projectChequeDueState(cleared, new Date("2026-09-20T00:00:00Z")), null);
});

test("invalid amounts and due dates are rejected", () => {
  assert.throws(() => effectiveChequeStatus({ ...cheque, amount: m(0n) }, new Date()), /positive/);
  assert.throws(() => effectiveChequeStatus({ ...cheque, dueAt: new Date("2026-08-31T00:00:00Z") }, new Date()), /due date/);
});
