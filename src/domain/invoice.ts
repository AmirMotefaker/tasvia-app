import type { Money } from "./financial-safety/money";

export type InvoiceStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Invoice {
  id: string;
  supplierId: string;
  invoiceNumber: string;
  amount: Money;
  status: InvoiceStatus;
  createdAt: Date;
}
