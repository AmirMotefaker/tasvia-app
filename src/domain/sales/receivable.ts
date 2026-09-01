import type { Money } from "../financial-safety/money";

export type ReceivableStatus = "OPEN" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export interface Receivable {
  id: string;
  workspaceId: string;
  customerId: string;
  invoiceId: string;
  originalAmount: Money;
  paidAmount: Money;
  dueAt: Date;
  status: ReceivableStatus;
}

export function outstandingAmount(receivable: Receivable): Money {
  if (receivable.originalAmount.currency !== receivable.paidAmount.currency) {
    throw new Error("Receivable currency mismatch.");
  }
  if (receivable.paidAmount.minorUnits > receivable.originalAmount.minorUnits) {
    throw new Error("Paid amount cannot exceed receivable amount.");
  }
  return {
    currency: receivable.originalAmount.currency,
    minorUnits: receivable.originalAmount.minorUnits - receivable.paidAmount.minorUnits,
  };
}

export function deriveReceivableStatus(receivable: Receivable, now = new Date()): ReceivableStatus {
  const outstanding = outstandingAmount(receivable).minorUnits;
  if (outstanding === BigInt(0)) return "PAID";
  if (receivable.dueAt.getTime() < now.getTime()) return "OVERDUE";
  if (receivable.paidAmount.minorUnits > BigInt(0)) return "PARTIALLY_PAID";
  return "OPEN";
}

export function agingBucket(receivable: Receivable, now = new Date()): "CURRENT" | "1_30" | "31_60" | "61_90" | "90_PLUS" {
  if (receivable.dueAt.getTime() >= now.getTime()) return "CURRENT";
  const days = Math.floor((now.getTime() - receivable.dueAt.getTime()) / 86_400_000);
  if (days <= 30) return "1_30";
  if (days <= 60) return "31_60";
  if (days <= 90) return "61_90";
  return "90_PLUS";
}
