import type { Money } from "../financial-safety/money";
import { receivableAgingBucket, type Receivable, type ReceivableAgingBucket } from "./receivable";
import type { CustomerReceipt, ReceiptAllocation } from "./receipt-allocation";

export interface CustomerStatementLine {
  occurredAt: Date;
  kind: "INVOICE" | "RECEIPT";
  referenceId: string;
  debit: Money;
  credit: Money;
  balance: Money;
}

function zero(currency: Money["currency"]): Money {
  return { currency, amount: 0n };
}

export function buildCustomerStatement(
  customerId: string,
  receivables: Receivable[],
  receipts: CustomerReceipt[],
): CustomerStatementLine[] {
  const customerReceivables = receivables.filter((item) => item.customerId === customerId);
  const customerReceipts = receipts.filter((item) => item.customerId === customerId);
  const currency = customerReceivables[0]?.originalAmount.currency ?? customerReceipts[0]?.amount.currency ?? "IRR";

  const events = [
    ...customerReceivables.map((item) => ({ occurredAt: item.issuedAt, kind: "INVOICE" as const, referenceId: item.id, amount: item.originalAmount })),
    ...customerReceipts.map((item) => ({ occurredAt: item.receivedAt, kind: "RECEIPT" as const, referenceId: item.id, amount: item.amount })),
  ].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  let balance = 0n;
  return events.map((event) => {
    if (event.amount.currency !== currency) throw new Error("Customer statement currency mismatch");
    if (event.kind === "INVOICE") balance += event.amount.amount;
    else balance -= event.amount.amount;
    return {
      occurredAt: event.occurredAt,
      kind: event.kind,
      referenceId: event.referenceId,
      debit: event.kind === "INVOICE" ? event.amount : zero(currency),
      credit: event.kind === "RECEIPT" ? event.amount : zero(currency),
      balance: { currency, amount: balance },
    };
  });
}

export type AgingSummary = Record<ReceivableAgingBucket, Money>;

export function summarizeReceivablesAging(receivables: Receivable[], asOf: Date): AgingSummary {
  const currency = receivables[0]?.outstandingAmount.currency ?? "IRR";
  const summary: AgingSummary = {
    CURRENT: zero(currency),
    "1_30": zero(currency),
    "31_60": zero(currency),
    "61_90": zero(currency),
    "90_PLUS": zero(currency),
  };

  for (const receivable of receivables) {
    if (receivable.outstandingAmount.currency !== currency) throw new Error("Aging currency mismatch");
    if (receivable.outstandingAmount.amount === 0n) continue;
    const bucket = receivableAgingBucket(receivable, asOf);
    summary[bucket] = { currency, amount: summary[bucket].amount + receivable.outstandingAmount.amount };
  }
  return summary;
}

export function allocatedReceiptTotal(receipt: CustomerReceipt, allocations: ReceiptAllocation[]): Money {
  return allocations
    .filter((item) => item.receiptId === receipt.id)
    .reduce<Money>((total, item) => {
      if (item.amount.currency !== total.currency) throw new Error("Allocation currency mismatch");
      return { currency: total.currency, amount: total.amount + item.amount.amount };
    }, zero(receipt.amount.currency));
}
