export type PurchaseDraftLine = {
  itemId: string;
  quantityMinorUnits: bigint;
  unitPrice: bigint;
  discount?: bigint;
  tax?: bigint;
};

export type PurchaseTotals = {
  subtotal: bigint;
  discount: bigint;
  tax: bigint;
  total: bigint;
};

export function calculatePurchaseLine(line: PurchaseDraftLine) {
  if (!line.itemId.trim()) throw new Error("PURCHASE_ITEM_REQUIRED");
  if (line.quantityMinorUnits <= 0n) throw new Error("PURCHASE_QUANTITY_MUST_BE_POSITIVE");
  if (line.unitPrice < 0n) throw new Error("PURCHASE_UNIT_PRICE_INVALID");

  const gross = line.quantityMinorUnits * line.unitPrice;
  const discount = line.discount ?? 0n;
  const tax = line.tax ?? 0n;
  if (discount < 0n || tax < 0n) throw new Error("PURCHASE_ADJUSTMENT_INVALID");
  if (discount > gross) throw new Error("PURCHASE_DISCOUNT_EXCEEDS_GROSS");

  const lineTotal = gross - discount + tax;
  if (lineTotal <= 0n) throw new Error("PURCHASE_LINE_TOTAL_INVALID");

  return { gross, discount, tax, lineTotal };
}

export function calculatePurchaseTotals(lines: PurchaseDraftLine[]): PurchaseTotals {
  if (lines.length === 0) throw new Error("PURCHASE_LINES_REQUIRED");

  return lines.reduce<PurchaseTotals>(
    (total, line) => {
      const calculated = calculatePurchaseLine(line);
      return {
        subtotal: total.subtotal + calculated.gross,
        discount: total.discount + calculated.discount,
        tax: total.tax + calculated.tax,
        total: total.total + calculated.lineTotal,
      };
    },
    { subtotal: 0n, discount: 0n, tax: 0n, total: 0n },
  );
}

export function assertPurchaseTransition(
  from: "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "PAID" | "CANCELLED",
  to: "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "PAID" | "CANCELLED",
): void {
  const allowed: Record<string, string[]> = {
    DRAFT: ["SUBMITTED", "CANCELLED"],
    SUBMITTED: ["APPROVED", "CANCELLED"],
    APPROVED: ["POSTED", "CANCELLED"],
    POSTED: ["PAID"],
    PAID: [],
    CANCELLED: [],
  };
  if (!allowed[from]?.includes(to)) throw new Error(`INVALID_PURCHASE_TRANSITION:${from}:${to}`);
}
