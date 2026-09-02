import type { Money } from "../financial-safety/money";

export type ChequeDirection = "RECEIVED" | "ISSUED";
export type ChequeStatus = "REGISTERED" | "DUE" | "CLEARED" | "BOUNCED" | "CANCELLED";

export interface Cheque {
  id: string;
  workspaceId: string;
  counterpartyId: string;
  direction: ChequeDirection;
  chequeNumber: string;
  sayadId?: string;
  bankName?: string;
  accountReference?: string;
  amount: Money;
  issuedAt: Date;
  dueAt: Date;
  status: ChequeStatus;
}

const terminalStatuses = new Set<ChequeStatus>(["CLEARED", "BOUNCED", "CANCELLED"]);

export function validateCheque(cheque: Cheque): void {
  if (!cheque.id.trim() || !cheque.workspaceId.trim() || !cheque.counterpartyId.trim()) {
    throw new Error("Cheque identity fields are required");
  }
  if (!cheque.chequeNumber.trim()) throw new Error("Cheque number is required");
  if (cheque.amount.currency !== "IRR") throw new Error("Cheque amount must use IRR");
  if (cheque.amount.minorUnits <= 0n) throw new Error("Cheque amount must be positive");
  if (cheque.dueAt.getTime() < cheque.issuedAt.getTime()) throw new Error("Cheque due date cannot precede issue date");
}

export function effectiveChequeStatus(cheque: Cheque, asOf: Date): ChequeStatus {
  validateCheque(cheque);
  if (terminalStatuses.has(cheque.status)) return cheque.status;
  return asOf.getTime() >= cheque.dueAt.getTime() ? "DUE" : "REGISTERED";
}

const allowedTransitions: Record<ChequeStatus, ChequeStatus[]> = {
  REGISTERED: ["DUE", "CLEARED", "CANCELLED"],
  DUE: ["CLEARED", "BOUNCED", "CANCELLED"],
  CLEARED: [],
  BOUNCED: [],
  CANCELLED: [],
};

export function transitionCheque(cheque: Cheque, nextStatus: ChequeStatus): Cheque {
  validateCheque(cheque);
  if (cheque.status === nextStatus) return cheque;
  if (!allowedTransitions[cheque.status].includes(nextStatus)) {
    throw new Error(`Invalid cheque transition: ${cheque.status} -> ${nextStatus}`);
  }
  return { ...cheque, status: nextStatus };
}

export interface ChequeDueProjection {
  chequeId: string;
  workspaceId: string;
  direction: ChequeDirection;
  dueAt: Date;
  daysFromDue: number;
  state: "UPCOMING" | "DUE_TODAY" | "OVERDUE";
  amount: Money;
}

const DAY = 86_400_000;

export function projectChequeDueState(cheque: Cheque, asOf: Date): ChequeDueProjection | null {
  validateCheque(cheque);
  if (terminalStatuses.has(cheque.status)) return null;
  const rawDays = Math.ceil((cheque.dueAt.getTime() - asOf.getTime()) / DAY);
  const state = rawDays < 0 ? "OVERDUE" : rawDays === 0 ? "DUE_TODAY" : "UPCOMING";
  return {
    chequeId: cheque.id,
    workspaceId: cheque.workspaceId,
    direction: cheque.direction,
    dueAt: cheque.dueAt,
    daysFromDue: rawDays,
    state,
    amount: cheque.amount,
  };
}
