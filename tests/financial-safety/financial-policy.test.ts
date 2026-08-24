import assert from "node:assert/strict";
import test from "node:test";
import {
  FINANCIAL_SAFETY_POLICY_V1,
  validateFinancialSafetyPolicy,
} from "../../src/domain/financial-safety/financial-policy";

test("default financial safety policy is valid and versioned", () => {
  assert.doesNotThrow(() => validateFinancialSafetyPolicy(FINANCIAL_SAFETY_POLICY_V1));
  assert.equal(FINANCIAL_SAFETY_POLICY_V1.version, "2026-08-v1");
});

test("invalid financial safety policy is rejected", () => {
  assert.throws(
    () =>
      validateFinancialSafetyPolicy({
        version: "bad",
        autoVerifyThreshold: 0.7,
        manualReviewThreshold: 0.8,
        maximumAutoSettlementRisk: 0.2,
      }),
    RangeError,
  );
});
