export type InvoiceStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Invoice {
  id: string;
  supplierId: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: Date;
}
