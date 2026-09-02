import type { Money } from "../financial-safety/money";

export type CatalogItemType = "STOCK_ITEM" | "SERVICE";
export type StockMovementType =
  | "OPENING"
  | "PURCHASE"
  | "SALE"
  | "RETURN_IN"
  | "RETURN_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT";

export interface CatalogItem {
  id: string;
  workspaceId: string;
  type: CatalogItemType;
  name: string;
  sku?: string;
  barcode?: string;
  unit: string;
  taxRateBasisPoints?: number;
  lowStockThreshold?: bigint;
  active: boolean;
}

export interface Warehouse {
  id: string;
  workspaceId: string;
  name: string;
  code: string;
  active: boolean;
}

export interface StockMovement {
  id: string;
  workspaceId: string;
  warehouseId: string;
  itemId: string;
  type: StockMovementType;
  quantityMinorUnits: bigint;
  occurredAt: Date;
  reference?: string;
  unitCost?: Money;
}

export interface StockBalance {
  workspaceId: string;
  warehouseId: string;
  itemId: string;
  quantityMinorUnits: bigint;
}

export interface InventoryValuation {
  workspaceId: string;
  warehouseId: string;
  itemId: string;
  quantityMinorUnits: bigint;
  averageUnitCost: Money;
  inventoryValue: Money;
}

function direction(type: StockMovementType): 1n | -1n {
  switch (type) {
    case "OPENING":
    case "PURCHASE":
    case "RETURN_IN":
    case "ADJUSTMENT_IN":
    case "TRANSFER_IN":
      return 1n;
    default:
      return -1n;
  }
}

export function stockBalanceFor(movements: StockMovement[], warehouseId: string, itemId: string): bigint {
  return movements
    .filter((movement) => movement.warehouseId === warehouseId && movement.itemId === itemId)
    .reduce((total, movement) => {
      if (movement.quantityMinorUnits <= 0n) throw new Error("Stock movement quantity must be positive");
      return total + direction(movement.type) * movement.quantityMinorUnits;
    }, 0n);
}

export function assertStockMovementAllowed(input: {
  movement: StockMovement;
  currentQuantityMinorUnits: bigint;
  allowNegativeStock?: boolean;
}): void {
  if (input.movement.quantityMinorUnits <= 0n) throw new Error("Stock movement quantity must be positive");
  const next = input.currentQuantityMinorUnits + direction(input.movement.type) * input.movement.quantityMinorUnits;
  if (!input.allowNegativeStock && next < 0n) throw new Error("Negative stock is forbidden");
}

export function stockCard(movements: StockMovement[], warehouseId: string, itemId: string) {
  let running = 0n;
  return movements
    .filter((movement) => movement.warehouseId === warehouseId && movement.itemId === itemId)
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
    .map((movement) => {
      running += direction(movement.type) * movement.quantityMinorUnits;
      return { movement, runningQuantityMinorUnits: running };
    });
}

export function weightedAverageValuation(movements: StockMovement[], warehouseId: string, itemId: string): InventoryValuation {
  const relevant = movements
    .filter((movement) => movement.warehouseId === warehouseId && movement.itemId === itemId)
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  let quantity = 0n;
  let value = 0n;
  let currency: Money["currency"] = "IRR";

  for (const movement of relevant) {
    if (movement.quantityMinorUnits <= 0n) throw new Error("Stock movement quantity must be positive");
    const sign = direction(movement.type);
    if (sign === 1n) {
      if (!movement.unitCost) throw new Error("Inbound inventory movement requires unit cost");
      if (quantity !== 0n && movement.unitCost.currency !== currency) throw new Error("Inventory valuation currency mismatch");
      currency = movement.unitCost.currency;
      quantity += movement.quantityMinorUnits;
      value += movement.quantityMinorUnits * movement.unitCost.minorUnits;
    } else {
      if (movement.quantityMinorUnits > quantity) throw new Error("Inventory issue exceeds available stock");
      const average = quantity === 0n ? 0n : value / quantity;
      quantity -= movement.quantityMinorUnits;
      value -= movement.quantityMinorUnits * average;
    }
  }

  const averageUnitCost = quantity === 0n ? 0n : value / quantity;
  return {
    workspaceId: relevant[0]?.workspaceId ?? "",
    warehouseId,
    itemId,
    quantityMinorUnits: quantity,
    averageUnitCost: { currency, minorUnits: averageUnitCost },
    inventoryValue: { currency, minorUnits: value },
  };
}

export function isLowStock(item: CatalogItem, quantityMinorUnits: bigint): boolean {
  return item.type === "STOCK_ITEM" && item.lowStockThreshold !== undefined && quantityMinorUnits <= item.lowStockThreshold;
}
