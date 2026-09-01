import { prisma } from "../../lib/prisma";
import type { Money } from "../../domain/financial-safety/money";

export type OpenBalanceKind = "RECEIVABLE" | "PAYABLE";

export interface PersistOpenBalanceInput {
  id: string;
  workspaceId: string;
  counterpartyId: string;
  type: OpenBalanceKind;
  sourceDocumentId: string;
  issuedAt: Date;
  dueAt: Date;
  amount: Money;
}

export async function persistOpenBalance(input: PersistOpenBalanceInput) {
  if (input.amount.currency !== "IRR") throw new Error("Open balances currently support IRR only");
  if (input.amount.minorUnits <= 0n) throw new Error("Open balance amount must be positive");
  if (input.dueAt.getTime() < input.issuedAt.getTime()) throw new Error("Due date cannot precede issue date");

  const counterparty = await prisma.counterparty.findFirst({
    where: { id: input.counterpartyId, workspaceId: input.workspaceId, active: true },
    select: { id: true, type: true },
  });
  if (!counterparty) throw new Error("Counterparty does not belong to workspace");
  if (input.type === "RECEIVABLE" && counterparty.type === "SUPPLIER") throw new Error("Supplier-only counterparty cannot own receivable");
  if (input.type === "PAYABLE" && counterparty.type === "CUSTOMER") throw new Error("Customer-only counterparty cannot own payable");

  return prisma.openBalance.upsert({
    where: { workspaceId_type_sourceDocumentId: { workspaceId: input.workspaceId, type: input.type, sourceDocumentId: input.sourceDocumentId } },
    update: {},
    create: {
      id: input.id,
      workspaceId: input.workspaceId,
      counterpartyId: input.counterpartyId,
      type: input.type,
      sourceDocumentId: input.sourceDocumentId,
      issuedAt: input.issuedAt,
      dueAt: input.dueAt,
      originalAmount: input.amount.minorUnits,
      outstandingAmount: input.amount.minorUnits,
      currency: input.amount.currency,
      status: "OPEN",
    },
  });
}

export async function listOpenBalances(workspaceId: string, type?: OpenBalanceKind) {
  return prisma.openBalance.findMany({
    where: { workspaceId, ...(type ? { type } : {}), status: { in: ["OPEN", "PARTIALLY_PAID"] } },
    include: { counterparty: true },
    orderBy: [{ dueAt: "asc" }, { issuedAt: "asc" }],
  });
}
