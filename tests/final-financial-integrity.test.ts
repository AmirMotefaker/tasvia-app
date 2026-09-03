import test from "node:test";
import assert from "node:assert/strict";
import { nextSettlementStatus } from "../src/domain/settlements/settlement";
import { transitionCheque } from "../src/domain/accounting/cheque";

test("cleared linked cheque amount must be valid settlement amount", () => {
  assert.deepEqual(nextSettlementStatus(1000n, 1000n), {
    outstandingAfter: 0n,
    status: "PAID",
  });
  assert.throws(
    () => nextSettlementStatus(1000n, 1001n),
    /SETTLEMENT_EXCEEDS_OUTSTANDING/,
  );
});

test("cheque lifecycle permits due to cleared but not mutation after cleared", () => {
  const base = {
    id: "c1",
    workspaceId: "w1",
    counterpartyId: "p1",
    direction: "RECEIVED" as const,
    chequeNumber: "100",
    amount: { currency: "IRR" as const, minorUnits: 1000n },
    issuedAt: new Date("2026-09-01"),
    dueAt: new Date("2026-09-03"),
    status: "DUE" as const,
  };
  const cleared = transitionCheque(base, "CLEARED");
  assert.equal(cleared.status, "CLEARED");
  assert.throws(
    () => transitionCheque(cleared, "BOUNCED"),
    /Invalid cheque transition/,
  );
});
