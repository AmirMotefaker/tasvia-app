import type { PaymentVerificationResult } from "../payment-verification/payment-verification-result";
import type { ReconciliationStatus } from "./reconciliation-status";

export interface ReconciliationDecision {
  status: ReconciliationStatus;
  confidenceScore: number;
  reason: string;
}

export function decideReconciliation(
  verification: PaymentVerificationResult,
): ReconciliationDecision {
  if (verification.decision === "AUTO_VERIFY") {
    return {
      status: "AUTO_RECONCILE",
      confidenceScore: verification.confidenceScore,
      reason: "Payment evidence satisfied automatic verification rules.",
    };
  }

  if (verification.decision === "MANUAL_REVIEW") {
    return {
      status: "MANUAL_REVIEW",
      confidenceScore: verification.confidenceScore,
      reason: "Payment evidence requires human confirmation.",
    };
  }

  return {
    status: "REJECTED",
    confidenceScore: verification.confidenceScore,
    reason: "Payment evidence did not satisfy minimum verification rules.",
  };
}
