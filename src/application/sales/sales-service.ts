import { prisma } from "../../lib/prisma";
import { assertFinancialWriteEnvironment } from "../accounting/simple-workflow-persistence";
import {
  assertSalesTransition,
  calculateSalesLine,
  calculateSalesTotals,
  type SalesDraftLine,
} from "../../domain/sales/sale";

const ACCOUNT_CODES = {
  inventory: "1301",
  receivable: "1201",
  revenue: "4101",
  cogs: "5201",
} as const;

const INBOUND_TYPES = new Set([
  "OPENING",
  "PURCHASE",
  "RETURN_IN",
  "ADJUSTMENT_IN",
  "TRANSFER_IN",
]);

export async function listSalesOptions(workspaceId: string) {
  const [customers, warehouses, items] = await Promise.all([
    prisma.counterparty.findMany({
      where: {
        workspaceId,
        active: true,
        type: { in: ["CUSTOMER", "BOTH"] },
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.warehouse.findMany({
      where: { workspaceId, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, code: true },
    }),
    prisma.catalogItem.findMany({
      where: { workspaceId, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true, type: true, unit: true },
    }),
  ]);

  return { customers, warehouses, items };
}

export async function listSales(workspaceId: string) {
  return prisma.salesInvoice.findMany({
    where: { workspaceId },
    include: {
      customer: { select: { name: true } },
      warehouse: { select: { name: true } },
      lines: true,
    },
    orderBy: [{ issuedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}

export async function createSalesDraft(input: {
  workspaceId: string;
  actorId: string;
  customerId: string;
  warehouseId: string;
  invoiceNumber: string;
  issuedAt: Date;
  dueAt: Date;
  lines: SalesDraftLine[];
}) {
  assertFinancialWriteEnvironment();

  if (!input.invoiceNumber.trim()) {
    throw new Error("SALE_INVOICE_NUMBER_REQUIRED");
  }
  if (input.dueAt.getTime() < input.issuedAt.getTime()) {
    throw new Error("INVALID_DUE_DATE");
  }

  const totals = calculateSalesTotals(input.lines);
  const itemIds = [...new Set(input.lines.map((line) => line.itemId))];

  return prisma.$transaction(async (tx) => {
    const [customer, warehouse, items] = await Promise.all([
      tx.counterparty.findFirst({
        where: {
          id: input.customerId,
          workspaceId: input.workspaceId,
          active: true,
          type: { in: ["CUSTOMER", "BOTH"] },
        },
        select: { id: true },
      }),
      tx.warehouse.findFirst({
        where: {
          id: input.warehouseId,
          workspaceId: input.workspaceId,
          active: true,
        },
        select: { id: true },
      }),
      tx.catalogItem.findMany({
        where: {
          id: { in: itemIds },
          workspaceId: input.workspaceId,
          active: true,
        },
        select: { id: true },
      }),
    ]);

    if (!customer) throw new Error("INVALID_CUSTOMER");
    if (!warehouse) throw new Error("INVALID_WAREHOUSE");
    if (items.length !== itemIds.length) throw new Error("INVALID_SALE_ITEM");

    return tx.salesInvoice.create({
      data: {
        workspaceId: input.workspaceId,
        customerId: input.customerId,
        warehouseId: input.warehouseId,
        invoiceNumber: input.invoiceNumber.trim(),
        issuedAt: input.issuedAt,
        dueAt: input.dueAt,
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        createdBy: input.actorId,
        lines: {
          create: input.lines.map((line) => {
            const calculated = calculateSalesLine(line);
            return {
              itemId: line.itemId,
              quantityMinorUnits: line.quantityMinorUnits,
              unitPrice: line.unitPrice,
              discount: calculated.discount,
              tax: calculated.tax,
              lineTotal: calculated.lineTotal,
            };
          }),
        },
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: "DRAFT",
            changedBy: input.actorId,
            note: "ایجاد پیش‌نویس فروش",
          },
        },
      },
      include: { lines: true },
    });
  });
}

async function transitionSale(
  id: string,
  workspaceId: string,
  actorId: string,
  target: "SUBMITTED" | "APPROVED",
) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const sale = await tx.salesInvoice.findFirst({
      where: { id, workspaceId },
    });
    if (!sale) throw new Error("SALE_NOT_FOUND");

    assertSalesTransition(sale.status, target);

    const now = new Date();

    return tx.salesInvoice.update({
      where: { id: sale.id },
      data: {
        status: target,
        ...(target === "SUBMITTED"
          ? { submittedAt: now, submittedBy: actorId }
          : { approvedAt: now, approvedBy: actorId }),
        statusHistory: {
          create: {
            fromStatus: sale.status,
            toStatus: target,
            changedBy: actorId,
          },
        },
      },
    });
  });
}

export function submitSale(id: string, workspaceId: string, actorId: string) {
  return transitionSale(id, workspaceId, actorId, "SUBMITTED");
}

export function approveSale(id: string, workspaceId: string, actorId: string) {
  return transitionSale(id, workspaceId, actorId, "APPROVED");
}

function inventorySnapshot(
  movements: Array<{
    type: string;
    quantityMinorUnits: bigint;
    unitCost: bigint | null;
  }>,
) {
  let quantity = 0n;
  let value = 0n;

  for (const movement of movements) {
    if (movement.quantityMinorUnits <= 0n) {
      throw new Error("INVALID_STOCK_MOVEMENT_QUANTITY");
    }

    if (INBOUND_TYPES.has(movement.type)) {
      const unitCost = movement.unitCost ?? 0n;
      quantity += movement.quantityMinorUnits;
      value += movement.quantityMinorUnits * unitCost;
    } else {
      if (movement.quantityMinorUnits > quantity) {
        throw new Error("INVENTORY_LEDGER_NEGATIVE");
      }

      const average = quantity === 0n ? 0n : value / quantity;
      quantity -= movement.quantityMinorUnits;
      value -= movement.quantityMinorUnits * average;
    }
  }

  return {
    quantity,
    averageUnitCost: quantity === 0n ? 0n : value / quantity,
    value,
  };
}

export async function postSale(
  id: string,
  workspaceId: string,
  actorId: string,
) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const sale = await tx.salesInvoice.findFirst({
      where: { id, workspaceId },
      include: {
        lines: {
          include: { item: true },
        },
      },
    });

    if (!sale) throw new Error("SALE_NOT_FOUND");

    if (sale.status === "POSTED" || sale.status === "PAID") {
      return sale;
    }

    assertSalesTransition(sale.status, "POSTED");

    const period = await tx.fiscalPeriod.findFirst({
      where: {
        workspaceId,
        status: "OPEN",
        startsAt: { lte: sale.issuedAt },
        endsAt: { gte: sale.issuedAt },
      },
      select: { id: true },
    });

    if (!period) throw new Error("OPEN_FISCAL_PERIOD_REQUIRED");

    const accounts = await tx.accountingAccount.findMany({
      where: {
        workspaceId,
        active: true,
        code: { in: Object.values(ACCOUNT_CODES) },
      },
      select: { id: true, code: true },
    });

    const accountByCode = new Map(
      accounts.map((account) => [account.code, account.id]),
    );

    for (const code of Object.values(ACCOUNT_CODES)) {
      if (!accountByCode.has(code)) {
        throw new Error(`ACCOUNT_NOT_CONFIGURED:${code}`);
      }
    }

    let cogsTotal = 0n;

    for (const line of sale.lines.filter(
      (candidate) => candidate.item.type === "STOCK_ITEM",
    )) {
      const movements = await tx.stockMovement.findMany({
        where: {
          workspaceId,
          warehouseId: sale.warehouseId,
          itemId: line.itemId,
        },
        orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
        select: {
          type: true,
          quantityMinorUnits: true,
          unitCost: true,
        },
      });

      const snapshot = inventorySnapshot(movements);

      if (line.quantityMinorUnits > snapshot.quantity) {
        throw new Error(`INSUFFICIENT_STOCK:${line.itemId}`);
      }
      if (snapshot.averageUnitCost < 0n) {
        throw new Error(`STOCK_COST_INVALID:${line.itemId}`);
      }

      const lineCogs =
        snapshot.averageUnitCost * line.quantityMinorUnits;

      cogsTotal += lineCogs;

      await tx.stockMovement.create({
        data: {
          id: `stock-sale:${sale.id}:${line.id}`,
          workspaceId,
          warehouseId: sale.warehouseId,
          itemId: line.itemId,
          type: "SALE",
          quantityMinorUnits: line.quantityMinorUnits,
          occurredAt: sale.issuedAt,
          reference: sale.id,
          unitCost: snapshot.averageUnitCost,
          currency: sale.currency,
        },
      });
    }

    const receivableId = `sale-receivable:${sale.id}`;

    await tx.openBalance.upsert({
      where: {
        workspaceId_type_sourceDocumentId: {
          workspaceId,
          type: "RECEIVABLE",
          sourceDocumentId: sale.id,
        },
      },
      update: {},
      create: {
        id: receivableId,
        workspaceId,
        counterpartyId: sale.customerId,
        type: "RECEIVABLE",
        sourceDocumentId: sale.id,
        issuedAt: sale.issuedAt,
        dueAt: sale.dueAt,
        originalAmount: sale.total,
        outstandingAmount: sale.total,
        currency: sale.currency,
        status: "OPEN",
      },
    });

    const revenueJournalId = `sale:${sale.id}`;
    const revenueIdempotencyKey = `sale-post:${workspaceId}:${sale.id}`;

    await tx.accountingJournal.create({
      data: {
        id: revenueJournalId,
        workspaceId,
        fiscalPeriodId: period.id,
        occurredAt: sale.issuedAt,
        description: `ثبت فروش ${sale.invoiceNumber}`,
        status: "POSTED",
        sourceDocumentId: sale.id,
        idempotencyKey: revenueIdempotencyKey,
        postedAt: new Date(),
        lines: {
          create: [
            {
              accountId: accountByCode.get(ACCOUNT_CODES.receivable)!,
              debit: sale.total,
              credit: 0n,
            },
            {
              accountId: accountByCode.get(ACCOUNT_CODES.revenue)!,
              debit: 0n,
              credit: sale.total,
            },
          ],
        },
      },
    });

    let cogsJournalId: string | null = null;

    if (cogsTotal > 0n) {
      cogsJournalId = `sale-cogs:${sale.id}`;

      await tx.accountingJournal.create({
        data: {
          id: cogsJournalId,
          workspaceId,
          fiscalPeriodId: period.id,
          occurredAt: sale.issuedAt,
          description: `بهای تمام‌شده فروش ${sale.invoiceNumber}`,
          status: "POSTED",
          sourceDocumentId: sale.id,
          idempotencyKey: `sale-cogs:${workspaceId}:${sale.id}`,
          postedAt: new Date(),
          lines: {
            create: [
              {
                accountId: accountByCode.get(ACCOUNT_CODES.cogs)!,
                debit: cogsTotal,
                credit: 0n,
              },
              {
                accountId: accountByCode.get(ACCOUNT_CODES.inventory)!,
                debit: 0n,
                credit: cogsTotal,
              },
            ],
          },
        },
      });
    }

    return tx.salesInvoice.update({
      where: { id: sale.id },
      data: {
        status: "POSTED",
        cogsTotal,
        postedAt: new Date(),
        postedBy: actorId,
        postedJournalId: revenueJournalId,
        cogsJournalId,
        receivableId,
        statusHistory: {
          create: {
            fromStatus: sale.status,
            toStatus: "POSTED",
            changedBy: actorId,
            note:
              "ثبت اتمیک فروش، خروج انبار، مطالبات و بهای تمام‌شده",
          },
        },
      },
    });
  });
}
