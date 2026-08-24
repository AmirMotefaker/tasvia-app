import type { PaymentVerificationInput } from "../payment-verification/payment-verification-rule";
import type { PaymentVerificationResult } from "../payment-verification/payment-verification-result";
import type { ReconciliationDecision } from "../reconciliation/reconciliation-decision";

export interface FinancialAgent {
  analyzePayment(
    input: PaymentVerificationInput,
  ): Promise<PaymentVerificationResult>;

  recommendReconciliation(
    verification: PaymentVerificationResult,
  ): Promise<ReconciliationDecision>;
}
