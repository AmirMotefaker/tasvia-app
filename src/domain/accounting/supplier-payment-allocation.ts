import type { Money } from "../financial-safety/money";
import { payableStatus, type Payable } from "./payable";

export interface SupplierPayment {
  id: string;
  workspaceId: string;
  supplierId: string;
  amount: Money;
  paidAt: Date;
  reference?: string;
}

export interface SupplierPaymentAllocation {
  paymentId: string;
  payableId: string;
  amount: Money;
  allocatedAt: Date;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) throw new Error("Currency mismatch");
}

export function allocateSupplierPayment(
  payment: SupplierPayment,
  payables: Payable[],
  requested: Array<{ payableId: string; amount: Money }>,
  allocatedAt = new Date(),
): SupplierPaymentAllocation[] {
  const byId = new Map(payables.map((item) => [item.id, item]));
  let allocated = 0n;

  const allocations = requested.map((item) => {
    const payable = byId.get(item.payableId);
    if (!payable) throw new Error("Payable not found");
    if (payable.workspaceId !== payment.workspaceId) throw new Error("Cross-workspace allocation is forbidden");
    if (payable.supplierId !== payment.supplierId) throw new Error("Cross-supplier allocation is forbidden");
    assertSameCurrency(payment.amount, item.amount);
    assertSameCurrency(payable.outstandingAmount, item.amount);
    if (item.amount.minorUnits <= 0n) throw new Error("Allocation amount must be positive");
    if (item.amount.minorUnits > payable.outstandingAmount.minorUnits) throw new Error("Allocation exceeds payable balance");
    allocated += item.amount.minorUnits;
    return { paymentId: payment.id, payableId: payable.id, amount: item.amount, allocatedAt };
  });

  if (allocated > payment.amount.minorUnits) throw new Error("Allocations exceed payment amount");
  return allocations;
}

export function unallocatedSupplierPaymentAmount(payment: SupplierPayment, allocations: SupplierPaymentAllocation[]): Money {
  const allocated = allocations
    .filter((item) => item.paymentId === payment.id)
    .reduce((sum, item) => {
      assertSameCurrency(payment.amount, item.amount);
      return sum + item.amount.minorUnits;
    }, 0n);
  if (allocated > payment.amount.minorUnits) throw new Error("Payment is over-allocated");
  return { currency: payment.amount.currency, minorUnits: payment.amount.minorUnits - allocated };
}

export function applySupplierPaymentAllocations(
  payables: Payable[],
  allocations: SupplierPaymentAllocation[],
  asOf = new Date(),
): Payable[] {
  return payables.map((payable) => {
    const paid = allocations
      .filter((item) => item.payableId === payable.id)
      .reduce((sum, item) => {
        assertSameCurrency(payable.outstandingAmount, item.amount);
        return sum + item.amount.minorUnits;
      }, 0n);
    if (paid > payable.outstandingAmount.minorUnits) throw new Error("Allocation exceeds payable balance");
    const updated: Payable = {
      ...payable,
      outstandingAmount: { ...payable.outstandingAmount, minorUnits: payable.outstandingAmount.minorUnits - paid },
    };
    return { ...updated, status: payableStatus(updated, asOf) };
  });
}
