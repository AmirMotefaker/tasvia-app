export type CurrencyCode = "IRR" | "USD" | "EUR" | "AED" | "TRY" | (string & {});

export type Money = {
  amount: bigint;
  currency: CurrencyCode;
};

export type PriceLevel = {
  id: string;
  name: string;
  multiplierBps: number;
  active: boolean;
};

export type DiscountRule = {
  id: string;
  percentageBps?: number;
  fixedAmount?: bigint;
  minSubtotal?: bigint;
  startsAt?: Date;
  endsAt?: Date;
  active: boolean;
};

export type InstallmentScheduleItem = {
  sequence: number;
  dueAt: Date;
  amount: bigint;
};

export type CommissionRule = {
  salespersonId: string;
  rateBps: number;
  appliesAfterDiscount: boolean;
};

function assertBps(value: number, field: string) {
  if (!Number.isInteger(value) || value < 0 || value > 10000) {
    throw new Error(`${field} must be an integer between 0 and 10000 basis points`);
  }
}

export function convertMoney(input: Money, targetCurrency: CurrencyCode, targetMinorUnitsPerSourceMinorUnit: bigint): Money {
  if (targetMinorUnitsPerSourceMinorUnit <= 0n) throw new Error("exchange rate must be positive");
  return { amount: input.amount * targetMinorUnitsPerSourceMinorUnit, currency: targetCurrency };
}

export function applyPriceLevel(baseUnitPrice: bigint, level: PriceLevel): bigint {
  if (!level.active) throw new Error("price level is inactive");
  assertBps(level.multiplierBps, "multiplierBps");
  return (baseUnitPrice * BigInt(level.multiplierBps)) / 10000n;
}

export function applyDiscount(subtotal: bigint, rule: DiscountRule, now = new Date()): bigint {
  if (subtotal < 0n) throw new Error("subtotal cannot be negative");
  if (!rule.active) return subtotal;
  if (rule.minSubtotal !== undefined && subtotal < rule.minSubtotal) return subtotal;
  if (rule.startsAt && now < rule.startsAt) return subtotal;
  if (rule.endsAt && now > rule.endsAt) return subtotal;

  let discount = 0n;
  if (rule.percentageBps !== undefined) {
    assertBps(rule.percentageBps, "percentageBps");
    discount += (subtotal * BigInt(rule.percentageBps)) / 10000n;
  }
  if (rule.fixedAmount !== undefined) {
    if (rule.fixedAmount < 0n) throw new Error("fixed discount cannot be negative");
    discount += rule.fixedAmount;
  }

  return discount >= subtotal ? 0n : subtotal - discount;
}

export function buildEqualInstallments(total: bigint, count: number, firstDueAt: Date, intervalDays: number): InstallmentScheduleItem[] {
  if (total <= 0n) throw new Error("installment total must be positive");
  if (!Number.isInteger(count) || count < 1) throw new Error("installment count must be positive");
  if (!Number.isInteger(intervalDays) || intervalDays < 1) throw new Error("intervalDays must be positive");

  const base = total / BigInt(count);
  const remainder = total % BigInt(count);

  return Array.from({ length: count }, (_, index) => ({
    sequence: index + 1,
    dueAt: new Date(firstDueAt.getTime() + index * intervalDays * 24 * 60 * 60 * 1000),
    amount: base + (index === count - 1 ? remainder : 0n),
  }));
}

export function calculateCommission(input: {
  subtotal: bigint;
  netAfterDiscount: bigint;
  rule: CommissionRule;
}): bigint {
  assertBps(input.rule.rateBps, "rateBps");
  const basis = input.rule.appliesAfterDiscount ? input.netAfterDiscount : input.subtotal;
  if (basis < 0n) throw new Error("commission basis cannot be negative");
  return (basis * BigInt(input.rule.rateBps)) / 10000n;
}

export function validateBarcode(value: string): string {
  const normalized = value.trim();
  if (!/^[0-9A-Za-z_-]{4,64}$/.test(normalized)) {
    throw new Error("barcode must contain 4-64 safe alphanumeric characters");
  }
  return normalized;
}
