import type { Money } from "../../domain/financial-safety/money";
import type { Journal } from "../../domain/accounting/journal";

export interface InventoryCogsCommand {
  id: string;
  workspaceId: string;
  occurredAt: Date;
  cogs: Money;
  costOfGoodsSoldAccountId: string;
  inventoryAccountId: string;
  reference?: string;
}

export function createInventoryCogsJournal(command: InventoryCogsCommand): Journal {
  if (command.cogs.minorUnits <= 0n) throw new Error("COGS must be positive");
  if (command.costOfGoodsSoldAccountId === command.inventoryAccountId) throw new Error("COGS and inventory accounts must differ");

  return {
    id: command.id,
    workspaceId: command.workspaceId,
    occurredAt: command.occurredAt,
    description: command.reference ? `بهای تمام‌شده فروش ${command.reference}` : "بهای تمام‌شده فروش کالا",
    lines: [
      {
        accountId: command.costOfGoodsSoldAccountId,
        debit: command.cogs,
        credit: { currency: command.cogs.currency, minorUnits: 0n },
      },
      {
        accountId: command.inventoryAccountId,
        debit: { currency: command.cogs.currency, minorUnits: 0n },
        credit: command.cogs,
      },
    ],
  };
}
