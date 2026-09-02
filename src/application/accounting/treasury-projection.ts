import { prisma } from "../../lib/prisma";

export type TreasuryProjection = {
  accounts: Array<{ id: string; code: string; name: string; balance: bigint }>;
  recentMovements: Array<{
    id: string;
    description: string;
    occurredAt: Date;
    accountName: string;
    reference: string | null;
    amount: bigint;
    direction: "IN" | "OUT";
  }>;
};

export async function buildTreasuryProjection(workspaceId: string): Promise<TreasuryProjection> {
  const accounts = await prisma.accountingAccount.findMany({
    where: {
      workspaceId,
      active: true,
      code: { in: ["1101", "1102"] },
    },
    orderBy: { code: "asc" },
    select: { id: true, code: true, name: true },
  });

  const accountIds = accounts.map((account) => account.id);
  const lines = accountIds.length
    ? await prisma.accountingJournalLine.findMany({
        where: {
          accountId: { in: accountIds },
          journal: { workspaceId, status: "POSTED" },
        },
        include: {
          account: { select: { name: true } },
          journal: { select: { description: true, occurredAt: true, sourceDocumentId: true } },
        },
        orderBy: [{ journal: { occurredAt: "desc" } }, { createdAt: "desc" }],
      })
    : [];

  const balances = new Map<string, bigint>(accounts.map((account) => [account.id, 0n]));
  for (const line of lines) {
    balances.set(line.accountId, (balances.get(line.accountId) ?? 0n) + line.debit - line.credit);
  }

  return {
    accounts: accounts.map((account) => ({ ...account, balance: balances.get(account.id) ?? 0n })),
    recentMovements: lines.slice(0, 12).map((line) => ({
      id: line.id,
      description: line.journal.description,
      occurredAt: line.journal.occurredAt,
      accountName: line.account.name,
      reference: line.journal.sourceDocumentId,
      amount: line.debit > 0n ? line.debit : line.credit,
      direction: line.debit > 0n ? "IN" : "OUT",
    })),
  };
}
