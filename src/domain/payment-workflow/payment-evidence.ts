import type { Money } from "../financial-safety/money";

export interface PaymentEvidence {
  id: string;
  paymentRequestId: string;
  receiptImage?: string;
  transactionId?: string;
  amount: Money;
  paidAt: Date;
}
