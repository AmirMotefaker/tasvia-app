import { prisma } from "../../lib/prisma";
import type { Journal } from "../../domain/accounting/journal";

export interface PersistJournalInput {
  journal: Journal;
  idempotencyKey: string;
  sourceDocumentId?: string;
}

export async function persistPostedJournal(input: PersistJournalInput) {
  const { journal } = input;
  if (!input.idempotencyKey.trim()) throw new Error("Journal idempotency key is required");
  if (journal.lines.length < 2) throw new Error("Journal requires at least two lines");

  const debit = journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  if (debit !== credit) throw new Error("Journal must be balanced before persistence");

  const existing = await prisma.accountingJournal.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing) return existing;

  const accountIds = [...new Set(journal.lines.map((line) => line.accountId))];
  const accounts = await prisma.accountingAccount.findMany({
    where: { id: { in: accountIds }, workspaceId: journal.workspaceId, active: true },
    select: { id: true },
  });
  if (accounts.length !== accountIds.length) throw new Error("Journal references invalid workspace account");

  return prisma.$transaction(async (tx) => {
    return tx.accountingJournal.create({
      data: {
        id: journal.id,
        workspaceId: journal.workspaceId,
        occurredAt: journal.occurredAt,
        description: journal.description,
        status: "POSTED",
        sourceDocumentId: input.sourceDocumentId,
        idempotencyKey: input.idempotencyKey,
        lines: {
          create: journal.lines.map((line) => ({
            accountId: line.accountId,
            debitMinorUnits: line.debit.minorUnits,
            creditMinorUnits: line.credit.minorUnits,
            currency: line.debit.currency,
          })),
        },
      },
      include: { lines: true },
    });
  });
}

export async function listPostedJournalLines(workspaceId: string) {
  return prisma.accountingJournalLine.findMany({
    where: { journal: { workspaceId, status: "POSTED" } },
    include: { account: true, journal: true },
    orderBy: [{ journal: { occurredAt: "asc" } }, { id: "asc" }],
  });
}
