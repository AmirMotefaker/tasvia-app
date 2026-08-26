import type { Money } from "../financial-safety/money";
export interface TrialBalance { totalDebits: Money; totalCredits: Money; }
export function isBalanced(x:TrialBalance){return x.totalDebits.minorUnits===x.totalCredits.minorUnits;}
