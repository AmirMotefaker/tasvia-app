import type { SettlementStatus } from "./settlement-status";

export interface SettlementDecision {
  status: SettlementStatus;
  riskScore: number;
  confidenceScore: number;
  reason: string;
}
