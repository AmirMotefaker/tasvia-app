export interface FinancialSafetyPolicy {
  version: string;
  autoVerifyThreshold: number;
  manualReviewThreshold: number;
  maximumAutoSettlementRisk: number;
}

export const FINANCIAL_SAFETY_POLICY_V1: FinancialSafetyPolicy = {
  version: "2026-08-v1",
  autoVerifyThreshold: 0.9,
  manualReviewThreshold: 0.6,
  maximumAutoSettlementRisk: 0.2,
};

export function validateFinancialSafetyPolicy(policy: FinancialSafetyPolicy): void {
  const values = [
    policy.autoVerifyThreshold,
    policy.manualReviewThreshold,
    policy.maximumAutoSettlementRisk,
  ];

  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    throw new RangeError("Financial policy values must be between 0 and 1.");
  }

  if (policy.manualReviewThreshold > policy.autoVerifyThreshold) {
    throw new RangeError(
      "Manual review threshold cannot exceed auto-verify threshold.",
    );
  }

  if (!policy.version.trim()) {
    throw new TypeError("Financial policy version is required.");
  }
}
