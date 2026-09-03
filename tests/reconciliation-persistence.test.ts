import test from "node:test";
import assert from "node:assert/strict";
import { reconciliationConfidence } from "../src/application/reconciliation/reconciliation-service";

test("exact reconciliation evidence scores at least automatic threshold", () => {
  const score = reconciliationConfidence({
    evidenceAmount: 1000n,
    journalAmount: 1000n,
    evidenceDate: new Date("2026-09-03"),
    journalDate: new Date("2026-09-03"),
    evidenceRef: "abc",
    journalRef: "abc-123",
  });
  assert.equal(score, 100);
});

test("amount mismatch cannot reach matching threshold by date alone", () => {
  const score = reconciliationConfidence({
    evidenceAmount: 1000n,
    journalAmount: 900n,
    evidenceDate: new Date("2026-09-03"),
    journalDate: new Date("2026-09-03"),
    evidenceRef: "x",
    journalRef: null,
  });
  assert.equal(score, 25);
});
