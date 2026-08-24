export interface VerificationResult {
  id: string;
  paymentEvidenceId: string;
  amountMatched: boolean;
  invoiceMatched: boolean;
  confidenceScore: number;
  createdAt: Date;
}
