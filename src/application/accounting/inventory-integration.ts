import type { Money } from "../../domain/financial-safety/money";
import type { CatalogItem, StockMovement, Warehouse } from "../../domain/accounting/inventory";
import { assertStockMovementAllowed, weightedAverageValuation } from "../../domain/accounting/inventory";

export interface InventoryLineInput {
  item: CatalogItem;
  warehouse: Warehouse;
  quantityMinorUnits: bigint;
  unitCost?: Money;
}

export interface InventoryFlowContext {
  workspaceId: string;
  referenceId: string;
  occurredAt: Date;
}

function assertLine(line: InventoryLineInput, workspaceId: string): void {
  if (line.item.workspaceId !== workspaceId || line.warehouse.workspaceId !== workspaceId) {
    throw new Error("Cross-workspace inventory operation is forbidden");
  }
  if (!line.item.active || !line.warehouse.active) throw new Error("Inactive inventory item or warehouse");
  if (line.quantityMinorUnits <= 0n) throw new Error("Inventory quantity must be positive");
}

export function purchaseStockMovements(context: InventoryFlowContext, lines: InventoryLineInput[]): StockMovement[] {
  return lines.flatMap((line, index) => {
    assertLine(line, context.workspaceId);
    if (line.item.type === "SERVICE") return [];
    if (!line.unitCost || line.unitCost.minorUnits < 0n) throw new Error("Stock purchase requires a non-negative unit cost");
    return [{
      id: `stock-purchase:${context.referenceId}:${index}`,
      workspaceId: context.workspaceId,
      warehouseId: line.warehouse.id,
      itemId: line.item.id,
      type: "PURCHASE" as const,
      quantityMinorUnits: line.quantityMinorUnits,
      occurredAt: context.occurredAt,
      reference: context.referenceId,
      unitCost: line.unitCost,
    }];
  });
}

export function saleStockMovements(input: {
  context: InventoryFlowContext;
  lines: InventoryLineInput[];
  existingMovements: StockMovement[];
  allowNegativeStock?: boolean;
}): StockMovement[] {
  return input.lines.flatMap((line, index) => {
    assertLine(line, input.context.workspaceId);
    if (line.item.type === "SERVICE") return [];
    const current = input.existingMovements
      .filter((movement) => movement.workspaceId === input.context.workspaceId && movement.warehouseId === line.warehouse.id && movement.itemId === line.item.id)
      .reduce((total, movement) => {
        if (["OPENING", "PURCHASE", "RETURN_IN", "ADJUSTMENT_IN", "TRANSFER_IN"].includes(movement.type)) return total + movement.quantityMinorUnits;
        return total - movement.quantityMinorUnits;
      }, 0n);
    const movement: StockMovement = {
      id: `stock-sale:${input.context.referenceId}:${index}`,
      workspaceId: input.context.workspaceId,
      warehouseId: line.warehouse.id,
      itemId: line.item.id,
      type: "SALE",
      quantityMinorUnits: line.quantityMinorUnits,
      occurredAt: input.context.occurredAt,
      reference: input.context.referenceId,
    };
    assertStockMovementAllowed({ movement, currentQuantityMinorUnits: current, allowNegativeStock: input.allowNegativeStock });
    return [movement];
  });
}

export interface CostOfGoodsSoldResult {
  itemId: string;
  warehouseId: string;
  quantityMinorUnits: bigint;
  unitCost: Money;
  totalCost: Money;
}

export function costOfGoodsSold(input: {
  warehouseId: string;
  itemId: string;
  quantityMinorUnits: bigint;
  existingMovements: StockMovement[];
}): CostOfGoodsSoldResult {
  if (input.quantityMinorUnits <= 0n) throw new Error("COGS quantity must be positive");
  const valuation = weightedAverageValuation(input.existingMovements, input.warehouseId, input.itemId);
  if (input.quantityMinorUnits > valuation.quantityMinorUnits) throw new Error("COGS exceeds available inventory");
  return {
    itemId: input.itemId,
    warehouseId: input.warehouseId,
    quantityMinorUnits: input.quantityMinorUnits,
    unitCost: valuation.averageUnitCost,
    totalCost: {
      currency: valuation.averageUnitCost.currency,
      minorUnits: valuation.averageUnitCost.minorUnits * input.quantityMinorUnits,
    },
  };
}
