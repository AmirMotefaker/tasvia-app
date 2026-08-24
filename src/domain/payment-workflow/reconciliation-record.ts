export interface ReconciliationRecord {
  id: string;
  invoiceId: string;
  paymentRequestId: string;
  accountingStatus: "PENDING" | "COMPLETED";
  reconciledAt?: Date;
}
