import type { Money } from "./financial-safety/money";

export interface Transaction {
  id: string;
  paymentId: string;
  referenceNumber: string;
  bank?: string;
  amount: Money;
  transactionDate: Date;
}
