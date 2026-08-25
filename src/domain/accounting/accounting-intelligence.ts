import type { FinancialStatement } from "./financial-statement";
export function explainFinancialStatement(s:FinancialStatement):string {
 return `${s.name} generated with total ${s.total.minorUnits}`;
}
