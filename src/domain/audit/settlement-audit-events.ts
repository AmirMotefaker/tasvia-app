import type { AuditEvent } from "./audit-event";
import type { SettlementDecision } from "../settlement/settlement-decision";

export function createSettlementAuditEvent(
  settlementId: string,
  decision: SettlementDecision,
): AuditEvent {
  return {
    action:
      decision.status === "READY"
        ? "RECONCILIATION_REQUESTED"
        : "MANUAL_REVIEW_REQUIRED",
    actor: {
      type: "SYSTEM",
      displayName: "Tasvin Settlement Engine",
    },
    entityType: "SETTLEMENT",
    entityId: settlementId,
    occurredAt: new Date(),
    reason: decision.reason,
    confidenceScore: decision.confidenceScore,
    metadata: {
      riskScore: decision.riskScore,
      settlementStatus: decision.status,
    },
  };
}
