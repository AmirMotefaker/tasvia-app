import type { Money } from "../financial-safety/money";
export interface FinancialStatement {
 name:string;
 generatedAt:Date;
 total:Money;
}
