import type { Money } from "./financial-safety/money";

export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: Money;
  method: "CARD_TRANSFER";
  status: PaymentStatus;
  verifiedAt?: Date;
  createdAt: Date;
}
