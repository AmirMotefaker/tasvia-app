import { addMoney, irr, type Money } from "../financial-safety/money";

export interface CashflowSnapshot {
  inflow: Money;
  outflow: Money;
  netCashflowMinorUnits: bigint;
}

export function analyzeCashflow(
  inflows: readonly Money[],
  outflows: readonly Money[],
): CashflowSnapshot {
  const inflow = inflows.reduce(addMoney, irr(0));
  const outflow = outflows.reduce(addMoney, irr(0));

  return {
    inflow,
    outflow,
    netCashflowMinorUnits: inflow.minorUnits - outflow.minorUnits,
  };
}
