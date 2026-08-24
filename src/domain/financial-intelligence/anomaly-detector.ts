export interface AmountAnomalyResult {
  detected: boolean;
  deviationRatio: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export function detectAmountAnomaly(
  currentAmount: number,
  historicalAmounts: readonly number[],
): AmountAnomalyResult {
  if (historicalAmounts.length === 0) {
    return { detected: false, deviationRatio: 0, severity: "LOW" };
  }

  const average =
    historicalAmounts.reduce((total, amount) => total + amount, 0) /
    historicalAmounts.length;

  if (average <= 0) {
    const detected = currentAmount > 0;
    return {
      detected,
      deviationRatio: detected ? 1 : 0,
      severity: detected ? "MEDIUM" : "LOW",
    };
  }

  const deviationRatio = Math.abs(currentAmount - average) / average;

  if (deviationRatio >= 2) {
    return { detected: true, deviationRatio, severity: "HIGH" };
  }

  if (deviationRatio >= 1) {
    return { detected: true, deviationRatio, severity: "MEDIUM" };
  }

  return { detected: false, deviationRatio, severity: "LOW" };
}
