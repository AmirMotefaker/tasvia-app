import { prisma } from "../../lib/prisma";
import { assertFinancialWriteEnvironment } from "../accounting/simple-workflow-persistence";
import {
  assertPurchaseTransition,
  calculatePurchaseLine,
  calculatePurchaseTotals,
  type PurchaseDraftLine,
} from "../../domain/purchases/purchase";

export type CreatePurchaseDraftInput = {
  workspaceId: string;
  actorId: string;
  supplierId: string;
  warehouseId: string;
  invoiceNumber: string;
  issuedAt: Date;
  dueAt: Date;
  lines: PurchaseDraftLine[];
};

const ACCOUNT_CODES = {
  inventory: "1301",
  payable: "2101",
  expense: "5201",
} as const;

export async function listPurchaseOptions(workspaceId: string) {
  const [suppliers, warehouses, items] = await Promise.all([
    prisma.counterparty.findMany({
      where: { workspaceId, active: true, type: { in: ["SUPPLIER", "BOTH"] } },
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

  return { suppliers, warehouses, items };
}

export async function listPurchases(workspaceId: string) {
  return prisma.purchaseInvoice.findMany({
    where: { workspaceId },
    include: {
      supplier: { select: { name: true } },
      warehouse: { select: { name: true } },
      lines: { select: { id: true } },
    },
    orderBy: [{ issuedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}

export async function createPurchaseDraft(input: CreatePurchaseDraftInput) {
  assertFinancialWriteEnvironment();

  if (!input.invoiceNumber.trim()) throw new Error("PURCHASE_INVOICE_NUMBER_REQUIRED");
  if (input.dueAt.getTime() < input.issuedAt.getTime()) throw new Error("INVALID_DUE_DATE");

  const totals = calculatePurchaseTotals(input.lines);
  const uniqueItemIds = [...new Set(input.lines.map((line) => line.itemId))];

  return prisma.$transaction(async (tx) => {
    const [supplier, warehouse, items] = await Promise.all([
      tx.counterparty.findFirst({
        where: {
          id: input.supplierId,
          workspaceId: input.workspaceId,
          active: true,
          type: { in: ["SUPPLIER", "BOTH"] },
        },
        select: { id: true },
      }),
      tx.warehouse.findFirst({
        where: { id: input.warehouseId, workspaceId: input.workspaceId, active: true },
        select: { id: true },
      }),
      tx.catalogItem.findMany({
        where: { id: { in: uniqueItemIds }, workspaceId: input.workspaceId, active: true },
        select: { id: true },
      }),
    ]);

    if (!supplier) throw new Error("INVALID_SUPPLIER");
    if (!warehouse) throw new Error("INVALID_WAREHOUSE");
    if (items.length !== uniqueItemIds.length) throw new Error("INVALID_PURCHASE_ITEM");

    return tx.purchaseInvoice.create({
      data: {
        workspaceId: input.workspaceId,
        supplierId: input.supplierId,
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
            const calculated = calculatePurchaseLine(line);
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
            note: "ایجاد پیش‌نویس خرید",
          },
        },
      },
      include: { lines: true },
    });
  });
}

async function transitionPurchase(
  purchaseId: string,
  workspaceId: string,
  actorId: string,
  target: "SUBMITTED" | "APPROVED" | "CANCELLED",
) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchaseInvoice.findFirst({
      where: { id: purchaseId, workspaceId },
    });
    if (!purchase) throw new Error("PURCHASE_NOT_FOUND");

    assertPurchaseTransition(purchase.status, target);

    const now = new Date();
    return tx.purchaseInvoice.update({
      where: { id: purchase.id },
      data: {
        status: target,
        ...(target === "SUBMITTED" ? { submittedAt: now, submittedBy: actorId } : {}),
        ...(target === "APPROVED" ? { approvedAt: now, approvedBy: actorId } : {}),
        ...(target === "CANCELLED" ? { cancelledAt: now, cancelledBy: actorId } : {}),
        statusHistory: {
          create: {
            fromStatus: purchase.status,
            toStatus: target,
            changedBy: actorId,
          },
        },
      },
    });
  });
}

export function submitPurchase(purchaseId: string, workspaceId: string, actorId: string) {
  return transitionPurchase(purchaseId, workspaceId, actorId, "SUBMITTED");
}

export function approvePurchase(purchaseId: string, workspaceId: string, actorId: string) {
  return transitionPurchase(purchaseId, workspaceId, actorId, "APPROVED");
}

export function cancelPurchase(purchaseId: string, workspaceId: string, actorId: string) {
  return transitionPurchase(purchaseId, workspaceId, actorId, "CANCELLED");
}

export async function postPurchase(purchaseId: string, workspaceId: string, actorId: string) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchaseInvoice.findFirst({
      where: { id: purchaseId, workspaceId },
      include: { lines: { include: { item: true } } },
    });
    if (!purchase) throw new Error("PURCHASE_NOT_FOUND");

    if (purchase.status === "POSTED" || purchase.status === "PAID") return purchase;
    assertPurchaseTransition(purchase.status, "POSTED");

    const period = await tx.fiscalPeriod.findFirst({
      where: {
        workspaceId,
        status: "OPEN",
        startsAt: { lte: purchase.issuedAt },
        endsAt: { gte: purchase.issuedAt },
      },
      select: { id: true },
    });
    if (!period) throw new Error("OPEN_FISCAL_PERIOD_REQUIRED");

    const accounts = await tx.accountingAccount.findMany({
      where: { workspaceId, active: true, code: { in: Object.values(ACCOUNT_CODES) } },
      select: { id: true, code: true },
    });
    const byCode = new Map(accounts.map((account) => [account.code, account.id]));
    for (const code of Object.values(ACCOUNT_CODES)) {
      if (!byCode.has(code)) throw new Error(`ACCOUNT_NOT_CONFIGURED:${code}`);
    }

    const stockLines = purchase.lines.filter((line) => line.item.type === "STOCK_ITEM");
    const serviceLines = purchase.lines.filter((line) => line.item.type === "SERVICE");
    const stockDebit = stockLines.reduce((sum, line) => sum + line.lineTotal, 0n);
    const serviceDebit = serviceLines.reduce((sum, line) => sum + line.lineTotal, 0n);

    const journalId = `purchase:${purchase.id}`;
    const payableId = `purchase-payable:${purchase.id}`;
    const idempotencyKey = `purchase-post:${workspaceId}:${purchase.id}`;

    const existingJournal = await tx.accountingJournal.findFirst({ where: { workspaceId, idempotencyKey } });
    if (existingJournal) {
      return tx.purchaseInvoice.update({
        where: { id: purchase.id },
        data: {
          status: "POSTED",
          postedJournalId: existingJournal.id,
          payableId,
          postedAt: purchase.postedAt ?? new Date(),
          postedBy: purchase.postedBy ?? actorId,
        },
      });
    }

    for (const line of stockLines) {
      await tx.stockMovement.upsert({
        where: { id: `stock-purchase:${purchase.id}:${line.id}` },
        update: {},
        create: {
          id: `stock-purchase:${purchase.id}:${line.id}`,
          workspaceId,
          warehouseId: purchase.warehouseId,
          itemId: line.itemId,
          type: "PURCHASE",
          quantityMinorUnits: line.quantityMinorUnits,
          occurredAt: purchase.issuedAt,
          reference: purchase.id,
          unitCost: line.unitPrice,
          currency: purchase.currency,
        },
      });
    }

    await tx.openBalance.upsert({
      where: {
        workspaceId_type_sourceDocumentId: {
          workspaceId,
          type: "PAYABLE",
          sourceDocumentId: purchase.id,
        },
      },
      update: {},
      create: {
        id: payableId,
        workspaceId,
        counterpartyId: purchase.supplierId,
        type: "PAYABLE",
        sourceDocumentId: purchase.id,
        issuedAt: purchase.issuedAt,
        dueAt: purchase.dueAt,
        originalAmount: purchase.total,
        outstandingAmount: purchase.total,
        currency: purchase.currency,
        status: "OPEN",
      },
    });

    const journalLines = [
      ...(stockDebit > 0n ? [{ accountId: byCode.get(ACCOUNT_CODES.inventory)!, debit: stockDebit, credit: 0n }] : []),
      ...(serviceDebit > 0n ? [{ accountId: byCode.get(ACCOUNT_CODES.expense)!, debit: serviceDebit, credit: 0n }] : []),
      { accountId: byCode.get(ACCOUNT_CODES.payable)!, debit: 0n, credit: purchase.total },
    ];

    const totalDebit = journalLines.reduce((sum, line) => sum + line.debit, 0n);
    const totalCredit = journalLines.reduce((sum, line) => sum + line.credit, 0n);
    if (totalDebit !== totalCredit) throw new Error("PURCHASE_JOURNAL_UNBALANCED");

    await tx.accountingJournal.create({
      data: {
        id: journalId,
        workspaceId,
        fiscalPeriodId: period.id,
        occurredAt: purchase.issuedAt,
        description: `ثبت خرید ${purchase.invoiceNumber}`,
        status: "POSTED",
        sourceDocumentId: purchase.id,
        idempotencyKey,
        postedAt: new Date(),
        lines: { create: journalLines },
      },
    });

    return tx.purchaseInvoice.update({
      where: { id: purchase.id },
      data: {
        status: "POSTED",
        postedJournalId: journalId,
        payableId,
        postedAt: new Date(),
        postedBy: actorId,
        statusHistory: {
          create: {
            fromStatus: purchase.status,
            toStatus: "POSTED",
            changedBy: actorId,
            note: "ثبت اتمیک خرید، انبار، بدهی و دفتر حسابداری",
          },
        },
      },
      include: { lines: true },
    });
  });
}
