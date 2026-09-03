import test from "node:test";
import assert from "node:assert/strict";
import { nextSettlementStatus } from "../src/domain/settlements/settlement";

test("partial settlement preserves remaining balance", () => {
  assert.deepEqual(nextSettlementStatus(1000n, 400n), {
    outstandingAfter: 600n,
    status: "PARTIALLY_PAID",
  });
});

test("full settlement closes balance exactly", () => {
  assert.deepEqual(nextSettlementStatus(1000n, 1000n), {
    outstandingAfter: 0n,
    status: "PAID",
  });
});

test("settlement rejects overpayment and zero amount", () => {
  assert.throws(
    () => nextSettlementStatus(1000n, 1001n),
    /SETTLEMENT_EXCEEDS_OUTSTANDING/,
  );

  assert.throws(
    () => nextSettlementStatus(1000n, 0n),
    /SETTLEMENT_AMOUNT_MUST_BE_POSITIVE/,
  );
});
