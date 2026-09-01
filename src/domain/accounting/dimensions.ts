export type AccountingDimensionType = "BRANCH" | "COST_CENTER" | "PROJECT";

export interface AccountingDimensionValue {
  id: string;
  workspaceId: string;
  type: AccountingDimensionType;
  code: string;
  name: string;
  active: boolean;
}

export interface Branch extends AccountingDimensionValue {
  type: "BRANCH";
}

export interface DimensionAllocation {
  dimensionValueId: string;
  basisPoints: number;
}

export interface DimensionAssignment {
  dimensionType: AccountingDimensionType;
  allocations: DimensionAllocation[];
}

export function validateDimensionAssignment(input: {
  workspaceId: string;
  assignment: DimensionAssignment;
  values: AccountingDimensionValue[];
}): void {
  if (input.assignment.allocations.length === 0) throw new Error("Dimension allocation requires at least one value");

  const valuesById = new Map(input.values.map((value) => [value.id, value]));
  const seen = new Set<string>();
  let totalBasisPoints = 0;

  for (const allocation of input.assignment.allocations) {
    if (!Number.isInteger(allocation.basisPoints) || allocation.basisPoints <= 0) {
      throw new Error("Dimension allocation basis points must be positive integers");
    }
    if (seen.has(allocation.dimensionValueId)) throw new Error("Duplicate dimension value allocation");
    seen.add(allocation.dimensionValueId);

    const value = valuesById.get(allocation.dimensionValueId);
    if (!value || value.workspaceId !== input.workspaceId) throw new Error("Cross-workspace dimension assignment is forbidden");
    if (!value.active) throw new Error("Inactive dimension value cannot be assigned");
    if (value.type !== input.assignment.dimensionType) throw new Error("Dimension value type mismatch");
    totalBasisPoints += allocation.basisPoints;
  }

  if (totalBasisPoints !== 10_000) throw new Error("Dimension allocation must total exactly 100 percent");
}

export function dimensionShareMinorUnits(amountMinorUnits: bigint, basisPoints: number): bigint {
  if (!Number.isInteger(basisPoints) || basisPoints < 0 || basisPoints > 10_000) throw new Error("Invalid allocation basis points");
  return (amountMinorUnits * BigInt(basisPoints)) / 10_000n;
}

export function projectAmountByDimension(input: {
  amountMinorUnits: bigint;
  assignment: DimensionAssignment;
  dimensionValueId: string;
}): bigint {
  const allocation = input.assignment.allocations.find((item) => item.dimensionValueId === input.dimensionValueId);
  return allocation ? dimensionShareMinorUnits(input.amountMinorUnits, allocation.basisPoints) : 0n;
}
