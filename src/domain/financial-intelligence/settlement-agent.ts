import type { SettlementDecision } from "../settlement/settlement-decision";
import type { SettlementEvaluationInput } from "../settlement/settlement-engine";

export interface SettlementAgent {
  evaluate(input: SettlementEvaluationInput): Promise<SettlementDecision>;
  explain(decision: SettlementDecision): Promise<string>;
}
