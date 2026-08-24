import {
  VERIFICATION_WEIGHTS,
  type PaymentVerificationInput,
  type VerificationRuleResult,
} from "./payment-verification-rule";
import {
  type PaymentVerificationResult,
  type VerificationDecision,
} from "./payment-verification-result";
import {
  VERIFICATION_THRESHOLDS,
  normalizeConfidence,
} from "./verification-confidence";

function decideVerification(confidenceScore: number): VerificationDecision {
  if (confidenceScore >= VERIFICATION_THRESHOLDS.autoVerify) {
    return "AUTO_VERIFY";
  }

  if (confidenceScore >= VERIFICATION_THRESHOLDS.manualReview) {
    return "MANUAL_REVIEW";
  }

  return "REJECT";
}

export function evaluatePaymentVerification(
  input: PaymentVerificationInput,
): PaymentVerificationResult {
  const rules: VerificationRuleResult[] = [
    {
      signal: "AMOUNT",
      matched: input.expectedAmount === input.observedAmount,
      weight: VERIFICATION_WEIGHTS.amount,
    },
    {
      signal: "INVOICE",
      matched:
        Boolean(input.observedInvoiceId) &&
        input.expectedInvoiceId === input.observedInvoiceId,
      weight: VERIFICATION_WEIGHTS.invoice,
    },
    {
      signal: "SUPPLIER",
      matched:
        Boolean(input.observedSupplierId) &&
        input.expectedSupplierId === input.observedSupplierId,
      weight: VERIFICATION_WEIGHTS.supplier,
    },
  ];

  const confidenceScore = normalizeConfidence(
    rules.reduce(
      (total, rule) => total + (rule.matched ? rule.weight : 0),
      0,
    ),
  );

  return {
    decision: decideVerification(confidenceScore),
    confidenceScore,
    rules,
  };
}
