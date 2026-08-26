import type { Money } from "../financial-safety/money";
export interface IncomeStatement { revenue:Money; expenses:Money; netProfit:Money; }
export function calculateNetProfit(a:Money,b:Money):Money{return {currency:a.currency,minorUnits:a.minorUnits-b.minorUnits};}
