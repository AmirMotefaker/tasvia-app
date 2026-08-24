export interface CashflowSnapshot {
  inflow: number;
  outflow: number;
  netCashflow: number;
}

export function analyzeCashflow(
  inflows: readonly number[],
  outflows: readonly number[],
): CashflowSnapshot {
  const inflow = inflows.reduce((total, amount) => total + amount, 0);
  const outflow = outflows.reduce((total, amount) => total + amount, 0);

  return {
    inflow,
    outflow,
    netCashflow: inflow - outflow,
  };
}
