import assert from "node:assert/strict";
import test from "node:test";
import { dimensionShareMinorUnits, projectAmountByDimension, validateDimensionAssignment, type AccountingDimensionValue } from "../src/domain/accounting/dimensions";

const values: AccountingDimensionValue[] = [
  { id: "b1", workspaceId: "ws", type: "BRANCH", code: "HQ", name: "شعبه مرکزی", active: true },
  { id: "b2", workspaceId: "ws", type: "BRANCH", code: "QZV", name: "شعبه قزوین", active: true },
  { id: "foreign", workspaceId: "other", type: "BRANCH", code: "X", name: "خارج", active: true },
];

test("dimension allocation requires exact 100 percent", () => {
  assert.doesNotThrow(() => validateDimensionAssignment({ workspaceId: "ws", values, assignment: { dimensionType: "BRANCH", allocations: [{ dimensionValueId: "b1", basisPoints: 6000 }, { dimensionValueId: "b2", basisPoints: 4000 }] } }));
  assert.throws(() => validateDimensionAssignment({ workspaceId: "ws", values, assignment: { dimensionType: "BRANCH", allocations: [{ dimensionValueId: "b1", basisPoints: 9000 }] } }), /exactly 100 percent/);
});

test("cross-workspace dimension assignment is rejected", () => {
  assert.throws(() => validateDimensionAssignment({ workspaceId: "ws", values, assignment: { dimensionType: "BRANCH", allocations: [{ dimensionValueId: "foreign", basisPoints: 10000 }] } }), /Cross-workspace/);
});

test("dimension projection uses deterministic integer allocation", () => {
  const assignment = { dimensionType: "BRANCH" as const, allocations: [{ dimensionValueId: "b1", basisPoints: 6000 }, { dimensionValueId: "b2", basisPoints: 4000 }] };
  assert.equal(dimensionShareMinorUnits(1_000n, 6000), 600n);
  assert.equal(projectAmountByDimension({ amountMinorUnits: 1_000n, assignment, dimensionValueId: "b2" }), 400n);
});

test("duplicate dimension allocation is rejected", () => {
  assert.throws(() => validateDimensionAssignment({ workspaceId: "ws", values, assignment: { dimensionType: "BRANCH", allocations: [{ dimensionValueId: "b1", basisPoints: 5000 }, { dimensionValueId: "b1", basisPoints: 5000 }] } }), /Duplicate/);
});
