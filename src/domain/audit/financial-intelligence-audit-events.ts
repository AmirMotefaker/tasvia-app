import type { AuditEvent } from "./audit-event";
import type { FinancialOperationsInsight } from "../financial-intelligence/financial-operations-insight";

export function createFinancialIntelligenceAuditEvent(
  entityId: string,
  insight: FinancialOperationsInsight,
): AuditEvent {
  return {
    action: insight.anomalyDetected
      ? "MANUAL_REVIEW_REQUIRED"
      : "RECONCILIATION_REQUESTED",
    actor: {
      type: "SYSTEM",
      displayName: "Tasvia Financial Intelligence",
    },
    entityType: "FINANCIAL_OPERATION",
    entityId,
    occurredAt: new Date(),
    reason: insight.explanation,
    confidenceScore: Math.max(0, 1 - insight.riskScore),
    metadata: {
      anomalyDetected: insight.anomalyDetected,
      recommendation: insight.recommendation,
      riskScore: insight.riskScore,
    },
  };
}
