import type { Money } from "../financial-safety/money";
import type { Receivable } from "./receivable";

export interface CustomerReceipt {
  id: string;
  workspaceId: string;
  customerId: string;
  amount: Money;
  receivedAt: Date;
  reference?: string;
}

export interface ReceiptAllocation {
  receiptId: string;
  receivableId: string;
  amount: Money;
  allocatedAt: Date;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) throw new Error("Currency mismatch");
}

export function allocateReceipt(
  receipt: CustomerReceipt,
  receivables: Receivable[],
  requested: Array<{ receivableId: string; amount: Money }>,
  allocatedAt = new Date(),
): ReceiptAllocation[] {
  const byId = new Map(receivables.map((item) => [item.id, item]));
  let allocated = 0n;

  const allocations = requested.map((item) => {
    const receivable = byId.get(item.receivableId);
    if (!receivable) throw new Error("Receivable not found");
    if (receivable.workspaceId !== receipt.workspaceId) throw new Error("Cross-workspace allocation is forbidden");
    if (receivable.customerId !== receipt.customerId) throw new Error("Cross-customer allocation is forbidden");
    assertSameCurrency(receipt.amount, item.amount);
    assertSameCurrency(receivable.outstandingAmount, item.amount);
    if (item.amount.amount <= 0n) throw new Error("Allocation amount must be positive");
    if (item.amount.amount > receivable.outstandingAmount.amount) throw new Error("Allocation exceeds receivable balance");
    allocated += item.amount.amount;
    return { receiptId: receipt.id, receivableId: receivable.id, amount: item.amount, allocatedAt };
  });

  if (allocated > receipt.amount.amount) throw new Error("Allocations exceed receipt amount");
  return allocations;
}

export function unallocatedReceiptAmount(receipt: CustomerReceipt, allocations: ReceiptAllocation[]): Money {
  const allocated = allocations
    .filter((item) => item.receiptId === receipt.id)
    .reduce((sum, item) => {
      assertSameCurrency(receipt.amount, item.amount);
      return sum + item.amount.amount;
    }, 0n);
  if (allocated > receipt.amount.amount) throw new Error("Receipt is over-allocated");
  return { currency: receipt.amount.currency, amount: receipt.amount.amount - allocated };
}

export function applyAllocations(receivables: Receivable[], allocations: ReceiptAllocation[]): Receivable[] {
  return receivables.map((receivable) => {
    const paid = allocations
      .filter((item) => item.receivableId === receivable.id)
      .reduce((sum, item) => {
        assertSameCurrency(receivable.outstandingAmount, item.amount);
        return sum + item.amount.amount;
      }, 0n);
    if (paid > receivable.outstandingAmount.amount) throw new Error("Allocation exceeds receivable balance");
    const outstanding = receivable.outstandingAmount.amount - paid;
    return {
      ...receivable,
      outstandingAmount: { ...receivable.outstandingAmount, amount: outstanding },
      status: outstanding === 0n ? "PAID" : paid > 0n ? "PARTIALLY_PAID" : receivable.status,
    };
  });
}
