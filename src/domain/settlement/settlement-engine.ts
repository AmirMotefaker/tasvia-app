import type { ReconciliationDecision } from "../reconciliation/reconciliation-decision";
import type { SettlementDecision } from "./settlement-decision";

export interface SettlementEvaluationInput {
  reconciliation: ReconciliationDecision;
  riskScore: number;
}

function normalizeRisk(score: number): number {
  if (!Number.isFinite(score)) return 1;
  if (score <= 0) return 0;
  if (score >= 1) return 1;
  return score;
}

export function evaluateSettlement(
  input: SettlementEvaluationInput,
): SettlementDecision {
  const riskScore = normalizeRisk(input.riskScore);
  const confidenceScore = input.reconciliation.confidenceScore;

  if (
    input.reconciliation.status === "AUTO_RECONCILE" &&
    confidenceScore >= 0.9 &&
    riskScore <= 0.2
  ) {
    return {
      status: "READY",
      riskScore,
      confidenceScore,
      reason: "Reconciliation is verified and settlement risk is low.",
    };
  }

  if (input.reconciliation.status === "REJECTED" || riskScore >= 0.8) {
    return {
      status: "REJECTED",
      riskScore,
      confidenceScore,
      reason: "Settlement failed reconciliation or exceeded risk threshold.",
    };
  }

  return {
    status: "MANUAL_REVIEW",
    riskScore,
    confidenceScore,
    reason: "Settlement requires manual review before execution.",
  };
}
