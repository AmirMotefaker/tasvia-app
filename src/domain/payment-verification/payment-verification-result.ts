import type { VerificationRuleResult } from "./payment-verification-rule";

export type VerificationDecision =
  | "AUTO_VERIFY"
  | "MANUAL_REVIEW"
  | "REJECT";

export interface PaymentVerificationResult {
  decision: VerificationDecision;
  confidenceScore: number;
  rules: VerificationRuleResult[];
}
