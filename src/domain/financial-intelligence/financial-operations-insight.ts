export type FinancialOperationsRecommendation =
  | "PROCEED_WITH_STANDARD_CONTROLS"
  | "REQUIRE_REVIEW";

export interface FinancialOperationsInsight {
  riskScore: number;
  anomalyDetected: boolean;
  explanation: string;
  recommendation: FinancialOperationsRecommendation;
}
