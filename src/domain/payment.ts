export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: "CARD_TRANSFER";
  status: PaymentStatus;
  verifiedAt?: Date;
  createdAt: Date;
}
