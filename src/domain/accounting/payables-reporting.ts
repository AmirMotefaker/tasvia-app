import type { Money } from "../financial-safety/money";
import { payableAgingBucket, type Payable, type PayableAgingBucket } from "./payable";
import type { SupplierPayment } from "./supplier-payment-allocation";

export interface SupplierStatementLine {
  occurredAt: Date;
  kind: "BILL" | "PAYMENT";
  referenceId: string;
  debit: Money;
  credit: Money;
  balance: Money;
}

function zero(currency: Money["currency"]): Money {
  return { currency, minorUnits: 0n };
}

export function buildSupplierStatement(
  supplierId: string,
  payables: Payable[],
  payments: SupplierPayment[],
): SupplierStatementLine[] {
  const supplierPayables = payables.filter((item) => item.supplierId === supplierId);
  const supplierPayments = payments.filter((item) => item.supplierId === supplierId);
  const currency = supplierPayables[0]?.originalAmount.currency ?? supplierPayments[0]?.amount.currency ?? "IRR";

  const events = [
    ...supplierPayables.map((item) => ({ occurredAt: item.issuedAt, kind: "BILL" as const, referenceId: item.id, amount: item.originalAmount })),
    ...supplierPayments.map((item) => ({ occurredAt: item.paidAt, kind: "PAYMENT" as const, referenceId: item.id, amount: item.amount })),
  ].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  let balance = 0n;
  return events.map((event) => {
    if (event.amount.currency !== currency) throw new Error("Supplier statement currency mismatch");
    if (event.kind === "BILL") balance += event.amount.minorUnits;
    else balance -= event.amount.minorUnits;
    return {
      occurredAt: event.occurredAt,
      kind: event.kind,
      referenceId: event.referenceId,
      debit: event.kind === "PAYMENT" ? event.amount : zero(currency),
      credit: event.kind === "BILL" ? event.amount : zero(currency),
      balance: { currency, minorUnits: balance },
    };
  });
}

export type PayablesAgingSummary = Record<PayableAgingBucket, Money>;

export function summarizePayablesAging(payables: Payable[], asOf: Date): PayablesAgingSummary {
  const currency = payables[0]?.outstandingAmount.currency ?? "IRR";
  const summary: PayablesAgingSummary = {
    CURRENT: zero(currency),
    "1_30": zero(currency),
    "31_60": zero(currency),
    "61_90": zero(currency),
    "90_PLUS": zero(currency),
  };

  for (const payable of payables) {
    if (payable.outstandingAmount.currency !== currency) throw new Error("Payables aging currency mismatch");
    if (payable.outstandingAmount.minorUnits === 0n) continue;
    const bucket = payableAgingBucket(payable, asOf);
    summary[bucket] = {
      currency,
      minorUnits: summary[bucket].minorUnits + payable.outstandingAmount.minorUnits,
    };
  }
  return summary;
}
