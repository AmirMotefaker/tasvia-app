import type { Money } from "../financial-safety/money";

export interface SettlementRequest {
  id: string;
  businessId: string;
  supplierId: string;
  invoiceId: string;
  paymentRequestId: string;
  amount: Money;
  requestedAt: Date;
}
