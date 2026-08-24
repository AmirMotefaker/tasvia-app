export interface SettlementRequest {
  id: string;
  businessId: string;
  supplierId: string;
  invoiceId: string;
  paymentRequestId: string;
  amount: number;
  requestedAt: Date;
}
