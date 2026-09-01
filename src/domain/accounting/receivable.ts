import type { Money } from "../financial-safety/money";

export type ReceivableStatus = "OPEN" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type ReceivableAgingBucket = "CURRENT" | "1_30" | "31_60" | "61_90" | "90_PLUS";

export interface Receivable {
  id: string;
  workspaceId: string;
  customerId: string;
  sourceId?: string;
  sourceDocumentId?: string;
  originalAmount: Money;
  outstandingAmount: Money;
  issuedAt: Date;
  dueAt?: Date;
  status: ReceivableStatus;
}

export function receivableAgingBucket(receivable: Receivable, asOf: Date): ReceivableAgingBucket {
  if (!receivable.dueAt || receivable.dueAt.getTime() >= asOf.getTime()) return "CURRENT";
  const overdueDays = Math.floor((asOf.getTime() - receivable.dueAt.getTime()) / 86_400_000);
  if (overdueDays <= 30) return "1_30";
  if (overdueDays <= 60) return "31_60";
  if (overdueDays <= 90) return "61_90";
  return "90_PLUS";
}

export function effectiveReceivableStatus(receivable: Receivable, asOf: Date): ReceivableStatus {
  if (receivable.outstandingAmount.minorUnits === 0n) return "PAID";
  if (receivable.dueAt && receivable.dueAt.getTime() < asOf.getTime()) return "OVERDUE";
  if (receivable.outstandingAmount.minorUnits < receivable.originalAmount.minorUnits) return "PARTIALLY_PAID";
  return "OPEN";
}
