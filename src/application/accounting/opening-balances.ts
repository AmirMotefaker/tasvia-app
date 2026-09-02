import type { Journal } from "../../domain/accounting/journal";
import { validateDimensionAssignment, type AccountingDimensionValue, type DimensionAssignment } from "../../domain/accounting/dimensions";
import type { Money } from "../../domain/financial-safety/money";

export interface OpeningBalanceLine {
  accountId: string;
  debit: Money;
  credit: Money;
  dimensions?: DimensionAssignment[];
}

export interface OpeningBalanceCommand {
  id: string;
  workspaceId: string;
  fiscalPeriodId: string;
  occurredAt: Date;
  openingEquityAccountId: string;
  lines: OpeningBalanceLine[];
  dimensionValues: AccountingDimensionValue[];
}

export interface OpeningBalanceResult {
  journal: Journal;
  fiscalPeriodId: string;
  dimensionsByLine: DimensionAssignment[][];
}

export function createOpeningBalanceJournal(command: OpeningBalanceCommand): OpeningBalanceResult {
  if (!command.fiscalPeriodId.trim()) throw new Error("Fiscal period is required");
  if (!command.openingEquityAccountId.trim()) throw new Error("Opening-balance equity account is required");
  if (command.lines.length === 0) throw new Error("Opening balance requires at least one line");

  let debitTotal = 0n;
  let creditTotal = 0n;
  let hasNonZero = false;

  const dimensionsByLine = command.lines.map((line) => {
    if (line.debit.currency !== "IRR" || line.credit.currency !== "IRR") throw new Error("Opening balances currently support IRR only");
    if (line.debit.minorUnits < 0n || line.credit.minorUnits < 0n) throw new Error("Opening balance amounts cannot be negative");
    if (line.debit.minorUnits > 0n && line.credit.minorUnits > 0n) throw new Error("Opening balance line cannot contain both debit and credit");
    if (line.debit.minorUnits > 0n || line.credit.minorUnits > 0n) hasNonZero = true;
    debitTotal += line.debit.minorUnits;
    creditTotal += line.credit.minorUnits;

    const assignments = line.dimensions ?? [];
    for (const assignment of assignments) {
      validateDimensionAssignment({ workspaceId: command.workspaceId, assignment, values: command.dimensionValues });
    }
    return assignments;
  });

  if (!hasNonZero) throw new Error("Opening balance cannot be zero-only");

  const currency = "IRR" as const;
  const balancingDifference = debitTotal - creditTotal;
  const baseLines = command.lines.map((line) => ({ accountId: line.accountId, debit: line.debit, credit: line.credit }));
  const balancingLine = balancingDifference === 0n ? [] : [{
    accountId: command.openingEquityAccountId,
    debit: { currency, minorUnits: balancingDifference < 0n ? -balancingDifference : 0n },
    credit: { currency, minorUnits: balancingDifference > 0n ? balancingDifference : 0n },
  }];

  const journal: Journal = {
    id: command.id,
    workspaceId: command.workspaceId,
    occurredAt: command.occurredAt,
    description: "ثبت مانده افتتاحیه",
    lines: [...baseLines, ...balancingLine],
  };

  const finalDebit = journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const finalCredit = journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  if (finalDebit !== finalCredit) throw new Error("Opening balance journal must be balanced");

  return { journal, fiscalPeriodId: command.fiscalPeriodId, dimensionsByLine };
}
