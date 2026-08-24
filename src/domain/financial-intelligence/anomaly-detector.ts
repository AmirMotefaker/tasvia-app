import type { Money } from "../financial-safety/money";

export interface AmountAnomalyResult {
  detected: boolean;
  deviationRatio: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export function detectAmountAnomaly(
  currentAmount: Money,
  historicalAmounts: readonly Money[],
): AmountAnomalyResult {
  if (historicalAmounts.length === 0) {
    return { detected: false, deviationRatio: 0, severity: "LOW" };
  }

  const total = historicalAmounts.reduce(
    (sum, amount) => sum + amount.minorUnits,
    BigInt(0),
  );
  const average = total / BigInt(historicalAmounts.length);

  if (average <= BigInt(0)) {
    const detected = currentAmount.minorUnits > BigInt(0);
    return {
      detected,
      deviationRatio: detected ? 1 : 0,
      severity: detected ? "MEDIUM" : "LOW",
    };
  }

  const deviation =
    currentAmount.minorUnits >= average
      ? currentAmount.minorUnits - average
      : average - currentAmount.minorUnits;

  const deviationRatio =
    Number((deviation * BigInt(10000)) / average) / 10000;

  if (deviation >= average * BigInt(2)) {
    return { detected: true, deviationRatio, severity: "HIGH" };
  }

  if (deviation >= average) {
    return { detected: true, deviationRatio, severity: "MEDIUM" };
  }

  return { detected: false, deviationRatio, severity: "LOW" };
}
