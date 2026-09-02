import { prisma } from "../../lib/prisma";

const inbound = new Set(["OPENING", "PURCHASE", "RETURN_IN", "ADJUSTMENT_IN", "TRANSFER_IN"]);

export type InventoryProjectionRow = {
  itemId: string;
  sku: string | null;
  name: string;
  unit: string;
  warehouseId: string;
  warehouseName: string;
  quantity: bigint;
  averageUnitCost: bigint;
  value: bigint;
  lowStock: boolean;
};

export async function buildInventoryProjection(workspaceId: string) {
  const [items, warehouses, movements] = await Promise.all([
    prisma.catalogItem.findMany({
      where: { workspaceId, active: true, type: "STOCK_ITEM" },
      orderBy: { name: "asc" },
    }),
    prisma.warehouse.findMany({ where: { workspaceId, active: true }, orderBy: { code: "asc" } }),
    prisma.stockMovement.findMany({
      where: { workspaceId },
      orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const rows: InventoryProjectionRow[] = [];
  let totalValue = 0n;
  let totalInbound = 0n;
  let totalOutbound = 0n;
  let lowStockCount = 0;

  for (const item of items) {
    for (const warehouse of warehouses) {
      const relevant = movements.filter((movement) => movement.itemId === item.id && movement.warehouseId === warehouse.id);
      if (relevant.length === 0) continue;

      let quantity = 0n;
      let value = 0n;
      for (const movement of relevant) {
        if (movement.quantityMinorUnits <= 0n) continue;
        if (inbound.has(movement.type)) {
          const unitCost = movement.unitCost ?? 0n;
          quantity += movement.quantityMinorUnits;
          value += movement.quantityMinorUnits * unitCost;
          totalInbound += movement.quantityMinorUnits;
        } else {
          const average = quantity === 0n ? 0n : value / quantity;
          quantity -= movement.quantityMinorUnits;
          value -= movement.quantityMinorUnits * average;
          totalOutbound += movement.quantityMinorUnits;
        }
      }

      const averageUnitCost = quantity === 0n ? 0n : value / quantity;
      const lowStock = item.lowStockThreshold !== null && item.lowStockThreshold !== undefined && quantity <= item.lowStockThreshold;
      if (lowStock) lowStockCount += 1;
      totalValue += value;

      rows.push({
        itemId: item.id,
        sku: item.sku,
        name: item.name,
        unit: item.unit,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        quantity,
        averageUnitCost,
        value,
        lowStock,
      });
    }
  }

  return { rows, totalValue, totalInbound, totalOutbound, lowStockCount };
}
