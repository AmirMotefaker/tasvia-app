import type { Money } from "../financial-safety/money";

export type PayableStatus = "OPEN" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type PayableAgingBucket = "CURRENT" | "1_30" | "31_60" | "61_90" | "90_PLUS";

export interface Payable {
  id: string;
  workspaceId: string;
  supplierId: string;
  sourceDocumentId?: string;
  issuedAt: Date;
  dueAt: Date;
  originalAmount: Money;
  outstandingAmount: Money;
  status: PayableStatus;
}

export function payableAgingBucket(payable: Payable, asOf: Date): PayableAgingBucket {
  if (payable.outstandingAmount.minorUnits === 0n || payable.dueAt.getTime() >= asOf.getTime()) return "CURRENT";
  const days = Math.floor((asOf.getTime() - payable.dueAt.getTime()) / 86_400_000);
  if (days <= 30) return "1_30";
  if (days <= 60) return "31_60";
  if (days <= 90) return "61_90";
  return "90_PLUS";
}

export function payableStatus(payable: Payable, asOf = new Date()): PayableStatus {
  if (payable.outstandingAmount.minorUnits === 0n) return "PAID";
  if (payable.outstandingAmount.minorUnits < payable.originalAmount.minorUnits) return "PARTIALLY_PAID";
  if (payable.dueAt.getTime() < asOf.getTime()) return "OVERDUE";
  return "OPEN";
}
