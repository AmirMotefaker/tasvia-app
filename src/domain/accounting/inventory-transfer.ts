import { assertStockMovementAllowed, type StockMovement, type Warehouse } from "./inventory";

export interface WarehouseTransferCommand {
  id: string;
  workspaceId: string;
  itemId: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  quantityMinorUnits: bigint;
  occurredAt: Date;
  reference?: string;
}

export interface WarehouseTransferResult {
  outbound: StockMovement;
  inbound: StockMovement;
}

export function createWarehouseTransfer(input: {
  command: WarehouseTransferCommand;
  sourceWarehouse: Warehouse;
  destinationWarehouse: Warehouse;
  sourceQuantityMinorUnits: bigint;
}): WarehouseTransferResult {
  const { command, sourceWarehouse, destinationWarehouse } = input;
  if (command.quantityMinorUnits <= 0n) throw new Error("Transfer quantity must be positive");
  if (sourceWarehouse.id === destinationWarehouse.id) throw new Error("Source and destination warehouses must differ");
  if (sourceWarehouse.workspaceId !== command.workspaceId || destinationWarehouse.workspaceId !== command.workspaceId) {
    throw new Error("Cross-workspace warehouse transfer is forbidden");
  }
  if (!sourceWarehouse.active || !destinationWarehouse.active) throw new Error("Warehouse must be active");

  const outbound: StockMovement = {
    id: `${command.id}:out`,
    workspaceId: command.workspaceId,
    warehouseId: sourceWarehouse.id,
    itemId: command.itemId,
    type: "TRANSFER_OUT",
    quantityMinorUnits: command.quantityMinorUnits,
    occurredAt: command.occurredAt,
    reference: command.reference ?? command.id,
  };
  assertStockMovementAllowed({ movement: outbound, currentQuantityMinorUnits: input.sourceQuantityMinorUnits });

  return {
    outbound,
    inbound: {
      id: `${command.id}:in`,
      workspaceId: command.workspaceId,
      warehouseId: destinationWarehouse.id,
      itemId: command.itemId,
      type: "TRANSFER_IN",
      quantityMinorUnits: command.quantityMinorUnits,
      occurredAt: command.occurredAt,
      reference: command.reference ?? command.id,
    },
  };
}
