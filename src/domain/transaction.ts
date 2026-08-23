export interface Transaction {
  id: string;
  paymentId: string;
  referenceNumber: string;
  bank?: string;
  amount: number;
  transactionDate: Date;
}
