import test from "node:test";
import assert from "node:assert/strict";
import { purchaseStockMovements, saleStockMovements, costOfGoodsSold } from "../src/application/accounting/inventory-integration";
import type { CatalogItem, Warehouse, StockMovement } from "../src/domain/accounting/inventory";

const item: CatalogItem = {
  id: "item-1",
  workspaceId: "ws-1",
  type: "STOCK_ITEM",
  name: "کالای تست",
  unit: "عدد",
  active: true,
};
const service: CatalogItem = { ...item, id: "service-1", type: "SERVICE", name: "خدمت" };
const warehouse: Warehouse = { id: "wh-1", workspaceId: "ws-1", name: "انبار اصلی", code: "MAIN", active: true };

const irr = (minorUnits: bigint) => ({ currency: "IRR" as const, minorUnits });

test("purchase creates stock movement for stock items but not services", () => {
  const movements = purchaseStockMovements({ workspaceId: "ws-1", referenceId: "p-1", occurredAt: new Date("2026-09-01") }, [
    { item, warehouse, quantityMinorUnits: 5n, unitCost: irr(1000n) },
    { item: service, warehouse, quantityMinorUnits: 1n, unitCost: irr(5000n) },
  ]);
  assert.equal(movements.length, 1);
  assert.equal(movements[0].type, "PURCHASE");
  assert.equal(movements[0].quantityMinorUnits, 5n);
});

test("sale rejects negative stock by default", () => {
  const existing = purchaseStockMovements({ workspaceId: "ws-1", referenceId: "p-1", occurredAt: new Date("2026-09-01") }, [
    { item, warehouse, quantityMinorUnits: 2n, unitCost: irr(1000n) },
  ]);
  assert.throws(() => saleStockMovements({
    context: { workspaceId: "ws-1", referenceId: "s-1", occurredAt: new Date("2026-09-02") },
    lines: [{ item, warehouse, quantityMinorUnits: 3n }],
    existingMovements: existing,
  }), /Negative stock is forbidden/);
});

test("sale creates stock-out and COGS uses weighted average", () => {
  const existing: StockMovement[] = [
    ...purchaseStockMovements({ workspaceId: "ws-1", referenceId: "p-1", occurredAt: new Date("2026-09-01") }, [
      { item, warehouse, quantityMinorUnits: 2n, unitCost: irr(1000n) },
    ]),
    ...purchaseStockMovements({ workspaceId: "ws-1", referenceId: "p-2", occurredAt: new Date("2026-09-02") }, [
      { item, warehouse, quantityMinorUnits: 2n, unitCost: irr(2000n) },
    ]),
  ];
  const cogs = costOfGoodsSold({ warehouseId: warehouse.id, itemId: item.id, quantityMinorUnits: 2n, existingMovements: existing });
  assert.equal(cogs.unitCost.minorUnits, 1500n);
  assert.equal(cogs.totalCost.minorUnits, 3000n);
  const sale = saleStockMovements({
    context: { workspaceId: "ws-1", referenceId: "s-1", occurredAt: new Date("2026-09-03") },
    lines: [{ item, warehouse, quantityMinorUnits: 2n }],
    existingMovements: existing,
  });
  assert.equal(sale[0].type, "SALE");
  assert.equal(sale[0].quantityMinorUnits, 2n);
});

test("cross-workspace inventory operation is rejected", () => {
  assert.throws(() => purchaseStockMovements({ workspaceId: "ws-2", referenceId: "p-x", occurredAt: new Date() }, [
    { item, warehouse, quantityMinorUnits: 1n, unitCost: irr(1000n) },
  ]), /Cross-workspace/);
});
