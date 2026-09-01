import type { Money } from "../financial-safety/money";

export interface PayrollPayee {
  id: string;
  workspaceId: string;
  name: string;
  active: boolean;
}

export interface PayrollLine {
  id: string;
  payeeId: string;
  grossPay: Money;
  deductions: Money;
}

export interface PayrollRun {
  id: string;
  workspaceId: string;
  periodLabel: string;
  occurredAt: Date;
  lines: PayrollLine[];
}

export interface PayrollTotals {
  grossPay: Money;
  deductions: Money;
  netPay: Money;
}

function assertIrr(money: Money): void {
  if (money.currency !== "IRR") throw new Error("Payroll currently supports IRR only");
}

export function payrollLineNetPay(line: PayrollLine): Money {
  assertIrr(line.grossPay);
  assertIrr(line.deductions);
  if (line.grossPay.minorUnits < 0n || line.deductions.minorUnits < 0n) throw new Error("Payroll values cannot be negative");
  if (line.deductions.minorUnits > line.grossPay.minorUnits) throw new Error("Payroll deductions cannot exceed gross pay");
  return { currency: "IRR", minorUnits: line.grossPay.minorUnits - line.deductions.minorUnits };
}

export function payrollRunTotals(run: PayrollRun, payees: PayrollPayee[]): PayrollTotals {
  if (!run.id.trim() || !run.workspaceId.trim() || !run.periodLabel.trim()) throw new Error("Payroll run identity is required");
  if (run.lines.length === 0) throw new Error("Payroll run requires at least one line");

  const payeesById = new Map(payees.map((payee) => [payee.id, payee]));
  let gross = 0n;
  let deductions = 0n;

  for (const line of run.lines) {
    const payee = payeesById.get(line.payeeId);
    if (!payee || payee.workspaceId !== run.workspaceId) throw new Error("Payroll payee does not belong to workspace");
    if (!payee.active) throw new Error("Inactive payroll payee cannot be included");
    payrollLineNetPay(line);
    gross += line.grossPay.minorUnits;
    deductions += line.deductions.minorUnits;
  }

  return {
    grossPay: { currency: "IRR", minorUnits: gross },
    deductions: { currency: "IRR", minorUnits: deductions },
    netPay: { currency: "IRR", minorUnits: gross - deductions },
  };
}

export function payrollJournalProjection(input: {
  run: PayrollRun;
  payees: PayrollPayee[];
  payrollExpenseAccountId: string;
  payrollPayableAccountId: string;
  deductionLiabilityAccountId: string;
}) {
  const totals = payrollRunTotals(input.run, input.payees);
  if (new Set([input.payrollExpenseAccountId, input.payrollPayableAccountId, input.deductionLiabilityAccountId]).size !== 3) {
    throw new Error("Payroll accounting accounts must differ");
  }

  return {
    id: `journal:payroll:${input.run.id}`,
    workspaceId: input.run.workspaceId,
    occurredAt: input.run.occurredAt,
    description: `حقوق و دستمزد ${input.run.periodLabel}`,
    lines: [
      { accountId: input.payrollExpenseAccountId, debit: totals.grossPay, credit: { currency: "IRR" as const, minorUnits: 0n } },
      { accountId: input.payrollPayableAccountId, debit: { currency: "IRR" as const, minorUnits: 0n }, credit: totals.netPay },
      { accountId: input.deductionLiabilityAccountId, debit: { currency: "IRR" as const, minorUnits: 0n }, credit: totals.deductions },
    ],
  };
}
