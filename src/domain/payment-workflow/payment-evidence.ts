export interface PaymentEvidence {
  id: string;
  paymentRequestId: string;
  receiptImage?: string;
  transactionId?: string;
  amount: number;
  paidAt: Date;
}
