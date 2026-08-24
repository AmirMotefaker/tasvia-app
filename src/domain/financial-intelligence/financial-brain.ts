import type { Money } from "../financial-safety/money";
import type { SettlementDecision } from "../settlement/settlement-decision";
import { detectAmountAnomaly } from "./anomaly-detector";
import { explainSettlementDecision } from "./financial-explanation-engine";
import type { FinancialOperationsInsight } from "./financial-operations-insight";

export interface FinancialBrainInput {
  settlement: SettlementDecision;
  recentAmounts: readonly Money[];
  currentAmount: Money;
}

export function analyzeFinancialOperation(
  input: FinancialBrainInput,
): FinancialOperationsInsight {
  const anomaly = detectAmountAnomaly(input.currentAmount, input.recentAmounts);

  const anomalyRisk =
    anomaly.severity === "HIGH"
      ? 0.9
      : anomaly.severity === "MEDIUM"
        ? 0.7
        : 0.2;

  const riskScore = Math.max(input.settlement.riskScore, anomalyRisk);

  return {
    riskScore,
    anomalyDetected: anomaly.detected,
    explanation: explainSettlementDecision(input.settlement),
    recommendation:
      input.settlement.status === "READY" &&
      !anomaly.detected &&
      riskScore < 0.5
        ? "PROCEED_WITH_STANDARD_CONTROLS"
        : "REQUIRE_REVIEW",
  };
}
