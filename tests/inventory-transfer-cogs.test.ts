import assert from "node:assert/strict";
import test from "node:test";
import { createWarehouseTransfer } from "../src/domain/accounting/inventory-transfer";
import { createInventoryCogsJournal } from "../src/application/accounting/inventory-cogs";

const source = { id: "w1", workspaceId: "ws1", name: "انبار مرکزی", code: "MAIN", active: true };
const destination = { id: "w2", workspaceId: "ws1", name: "انبار شعبه", code: "BRANCH", active: true };

test("warehouse transfer creates paired auditable movements", () => {
  const result = createWarehouseTransfer({
    command: { id: "tr1", workspaceId: "ws1", itemId: "i1", sourceWarehouseId: "w1", destinationWarehouseId: "w2", quantityMinorUnits: 3n, occurredAt: new Date("2026-09-01") },
    sourceWarehouse: source,
    destinationWarehouse: destination,
    sourceQuantityMinorUnits: 5n,
  });
  assert.equal(result.outbound.type, "TRANSFER_OUT");
  assert.equal(result.inbound.type, "TRANSFER_IN");
  assert.equal(result.outbound.quantityMinorUnits, result.inbound.quantityMinorUnits);
});

test("warehouse transfer rejects insufficient stock", () => {
  assert.throws(() => createWarehouseTransfer({
    command: { id: "tr2", workspaceId: "ws1", itemId: "i1", sourceWarehouseId: "w1", destinationWarehouseId: "w2", quantityMinorUnits: 6n, occurredAt: new Date("2026-09-01") },
    sourceWarehouse: source,
    destinationWarehouse: destination,
    sourceQuantityMinorUnits: 5n,
  }), /Negative stock/);
});

test("COGS journal debits expense and credits inventory", () => {
  const journal = createInventoryCogsJournal({ id: "j1", workspaceId: "ws1", occurredAt: new Date("2026-09-01"), cogs: { currency: "IRR", minorUnits: 90000n }, costOfGoodsSoldAccountId: "cogs", inventoryAccountId: "inventory" });
  assert.equal(journal.lines[0]?.debit.minorUnits, 90000n);
  assert.equal(journal.lines[1]?.credit.minorUnits, 90000n);
  assert.equal(journal.lines[0]?.credit.minorUnits, 0n);
  assert.equal(journal.lines[1]?.debit.minorUnits, 0n);
});
