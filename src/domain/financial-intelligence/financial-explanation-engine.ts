import type { SettlementDecision } from "../settlement/settlement-decision";

export function explainSettlementDecision(
  decision: SettlementDecision,
): string {
  const confidence = `${Math.round(decision.confidenceScore * 100)}%`;
  const risk = `${Math.round(decision.riskScore * 100)}%`;

  if (decision.status === "READY") {
    return `Settlement is ready. Confidence ${confidence}; risk ${risk}. ${decision.reason}`;
  }

  if (decision.status === "REJECTED") {
    return `Settlement is rejected. Confidence ${confidence}; risk ${risk}. ${decision.reason}`;
  }

  return `Settlement requires review. Confidence ${confidence}; risk ${risk}. ${decision.reason}`;
}
