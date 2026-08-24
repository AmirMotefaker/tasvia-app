import type { Money } from "../financial-safety/money";

export type PaymentRequestStatus =
  | "CREATED"
  | "WAITING_PAYMENT"
  | "PAID"
  | "VERIFIED"
  | "RECONCILED";

export interface PaymentRequest {
  id: string;
  businessId: string;
  invoiceId: string;
  supplierId: string;
  amount: Money;
  status: PaymentRequestStatus;
  createdAt: Date;
}
