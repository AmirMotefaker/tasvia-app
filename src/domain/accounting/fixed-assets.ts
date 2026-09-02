import type { Money } from "../financial-safety/money";

export interface FixedAsset {
  id: string;
  workspaceId: string;
  name: string;
  acquiredAt: Date;
  acquisitionCost: Money;
  residualValue: Money;
  usefulLifeMonths: number;
  active: boolean;
}

export interface DepreciationProjection {
  depreciableBase: Money;
  monthlyDepreciation: Money;
  accumulatedDepreciation: Money;
  carryingAmount: Money;
}

function assertIrr(money: Money): void {
  if (money.currency !== "IRR") throw new Error("Fixed assets currently support IRR only");
}

export function validateFixedAsset(asset: FixedAsset): void {
  if (!asset.id.trim() || !asset.workspaceId.trim() || !asset.name.trim()) throw new Error("Fixed asset identity is required");
  assertIrr(asset.acquisitionCost);
  assertIrr(asset.residualValue);
  if (asset.acquisitionCost.minorUnits < 0n || asset.residualValue.minorUnits < 0n) throw new Error("Asset values cannot be negative");
  if (asset.residualValue.minorUnits > asset.acquisitionCost.minorUnits) throw new Error("Residual value cannot exceed acquisition cost");
  if (!Number.isInteger(asset.usefulLifeMonths) || asset.usefulLifeMonths <= 0) throw new Error("Useful life must be a positive integer number of months");
}

export function straightLineDepreciation(asset: FixedAsset, elapsedMonths: number): DepreciationProjection {
  validateFixedAsset(asset);
  if (!Number.isInteger(elapsedMonths) || elapsedMonths < 0) throw new Error("Elapsed months must be a non-negative integer");

  const depreciableBase = asset.acquisitionCost.minorUnits - asset.residualValue.minorUnits;
  const monthly = depreciableBase / BigInt(asset.usefulLifeMonths);
  const months = Math.min(elapsedMonths, asset.usefulLifeMonths);
  const accumulated = monthly * BigInt(months);
  const cappedAccumulated = accumulated > depreciableBase ? depreciableBase : accumulated;
  const carrying = asset.acquisitionCost.minorUnits - cappedAccumulated;

  return {
    depreciableBase: { currency: "IRR", minorUnits: depreciableBase },
    monthlyDepreciation: { currency: "IRR", minorUnits: monthly },
    accumulatedDepreciation: { currency: "IRR", minorUnits: cappedAccumulated },
    carryingAmount: { currency: "IRR", minorUnits: carrying },
  };
}

export function depreciationJournalProjection(input: {
  asset: FixedAsset;
  periodMonths: number;
  occurredAt: Date;
  depreciationExpenseAccountId: string;
  accumulatedDepreciationAccountId: string;
}) {
  if (input.depreciationExpenseAccountId === input.accumulatedDepreciationAccountId) throw new Error("Depreciation accounting accounts must differ");
  const projection = straightLineDepreciation(input.asset, input.periodMonths);
  const amount = projection.accumulatedDepreciation;
  return {
    id: `journal:depreciation:${input.asset.id}:${input.periodMonths}`,
    workspaceId: input.asset.workspaceId,
    occurredAt: input.occurredAt,
    description: `استهلاک ${input.asset.name}`,
    lines: [
      { accountId: input.depreciationExpenseAccountId, debit: amount, credit: { currency: "IRR" as const, minorUnits: 0n } },
      { accountId: input.accumulatedDepreciationAccountId, debit: { currency: "IRR" as const, minorUnits: 0n }, credit: amount },
    ],
  };
}
