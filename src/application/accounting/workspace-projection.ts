import { prisma } from "../../lib/prisma";

export type WorkspaceFinancialProjection = {
  sales: bigint;
  receivables: bigint;
  payables: bigint;
  cash: bigint;
  revenue: bigint;
  expenses: bigint;
  netIncome: bigint;
  workingCapital: bigint;
  overdueReceivables: number;
  dueSoonPayables: number;
  recentJournals: Array<{
    id: string;
    description: string;
    sourceDocumentId: string | null;
    occurredAt: Date;
    status: "DRAFT" | "POSTED" | "REVERSED";
  }>;
};

function netByType(type: string, debit: bigint, credit: bigint): bigint {
  if (type === "ASSET" || type === "EXPENSE") return debit - credit;
  return credit - debit;
}

export async function buildWorkspaceFinancialProjection(workspaceId: string, now = new Date()): Promise<WorkspaceFinancialProjection> {
  const [lines, openBalances, recentJournals] = await Promise.all([
    prisma.accountingJournalLine.findMany({
      where: { journal: { workspaceId, status: "POSTED" } },
      select: {
        debit: true,
        credit: true,
        account: { select: { code: true, type: true } },
      },
    }),
    prisma.openBalance.findMany({
      where: { workspaceId, status: { in: ["OPEN", "PARTIALLY_PAID"] } },
      select: { type: true, outstandingAmount: true, dueAt: true },
    }),
    prisma.accountingJournal.findMany({
      where: { workspaceId, status: "POSTED" },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
      take: 8,
      select: { id: true, description: true, sourceDocumentId: true, occurredAt: true, status: true },
    }),
  ]);

  let sales = 0n;
  let cash = 0n;
  let revenue = 0n;
  let expenses = 0n;

  for (const line of lines) {
    const debit = line.debit;
    const credit = line.credit;
    const net = netByType(line.account.type, debit, credit);

    if (line.account.code === "4101" || line.account.code === "4201") sales += net;
    if (line.account.code === "1101" || line.account.code === "1102") cash += net;
    if (line.account.type === "REVENUE") revenue += net;
    if (line.account.type === "EXPENSE") expenses += net;
  }

  let receivables = 0n;
  let payables = 0n;
  let overdueReceivables = 0;
  let dueSoonPayables = 0;
  const dueSoonBoundary = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  for (const balance of openBalances) {
    if (balance.type === "RECEIVABLE") {
      receivables += balance.outstandingAmount;
      if (balance.dueAt.getTime() < now.getTime()) overdueReceivables += 1;
    } else {
      payables += balance.outstandingAmount;
      if (balance.dueAt.getTime() >= now.getTime() && balance.dueAt.getTime() <= dueSoonBoundary.getTime()) dueSoonPayables += 1;
    }
  }

  const netIncome = revenue - expenses;
  const workingCapital = cash + receivables - payables;

  return {
    sales,
    receivables,
    payables,
    cash,
    revenue,
    expenses,
    netIncome,
    workingCapital,
    overdueReceivables,
    dueSoonPayables,
    recentJournals,
  };
}
