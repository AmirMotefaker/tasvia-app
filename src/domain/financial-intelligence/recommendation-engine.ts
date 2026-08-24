import type { FinancialOperationsInsight } from "./financial-operations-insight";

export interface FinancialRecommendation {
  action: "CONTINUE" | "HOLD_FOR_REVIEW";
  rationale: string;
}

export function recommendFinancialAction(
  insight: FinancialOperationsInsight,
): FinancialRecommendation {
  if (
    insight.recommendation === "PROCEED_WITH_STANDARD_CONTROLS" &&
    insight.riskScore < 0.5
  ) {
    return {
      action: "CONTINUE",
      rationale: "Operation is within configured controls and risk tolerance.",
    };
  }

  return {
    action: "HOLD_FOR_REVIEW",
    rationale:
      "Operation requires review because anomaly or elevated risk was detected.",
  };
}
