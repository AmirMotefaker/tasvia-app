export type VerificationSignal =
  | "AMOUNT"
  | "INVOICE"
  | "SUPPLIER";

export interface VerificationRuleResult {
  signal: VerificationSignal;
  matched: boolean;
  weight: number;
}

export interface PaymentVerificationInput {
  expectedAmount: number;
  observedAmount: number;
  expectedInvoiceId: string;
  observedInvoiceId?: string;
  expectedSupplierId: string;
  observedSupplierId?: string;
}

export const VERIFICATION_WEIGHTS = {
  amount: 0.45,
  invoice: 0.3,
  supplier: 0.25,
} as const;
