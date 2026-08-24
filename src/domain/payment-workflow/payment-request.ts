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
  amount: number;
  status: PaymentRequestStatus;
  createdAt: Date;
}
