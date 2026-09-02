import { prisma } from "../../lib/prisma";
import type { Journal } from "../../domain/accounting/journal";

export interface PersistJournalInput {
  journal: Journal;
  idempotencyKey: string;
  sourceDocumentId?: string;
  fiscalPeriodId?: string;
}

function assertIrrJournal(journal: Journal): void {
  for (const line of journal.lines) {
    if (line.debit.currency !== "IRR" || line.credit.currency !== "IRR") {
      throw new Error("Accounting persistence currently supports IRR only");
    }
  }
}

export async function persistPostedJournal(input: PersistJournalInput) {
  const { journal } = input;
  if (!input.idempotencyKey.trim()) throw new Error("Journal idempotency key is required");
  if (journal.lines.length < 2) throw new Error("Journal requires at least two lines");
  assertIrrJournal(journal);

  const debit = journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  if (debit !== credit) throw new Error("Journal must be balanced before persistence");

  const existing = await prisma.accountingJournal.findFirst({
    where: { workspaceId: journal.workspaceId, idempotencyKey: input.idempotencyKey },
  });
  if (existing) return existing;

  const accountIds = [...new Set(journal.lines.map((line) => line.accountId))];
  const accounts = await prisma.accountingAccount.findMany({
    where: { id: { in: accountIds }, workspaceId: journal.workspaceId, active: true },
    select: { id: true },
  });
  if (accounts.length !== accountIds.length) throw new Error("Journal references invalid workspace account");

  if (input.fiscalPeriodId) {
    const period = await prisma.fiscalPeriod.findFirst({
      where: { id: input.fiscalPeriodId, workspaceId: journal.workspaceId, status: "OPEN" },
    });
    if (!period) throw new Error("Journal fiscal period is missing, closed, or belongs to another workspace");
    if (journal.occurredAt < period.startsAt || journal.occurredAt > period.endsAt) {
      throw new Error("Journal date is outside fiscal period");
    }
  }

  return prisma.$transaction(async (tx) => {
    return tx.accountingJournal.create({
      data: {
        id: journal.id,
        workspaceId: journal.workspaceId,
        fiscalPeriodId: input.fiscalPeriodId,
        occurredAt: journal.occurredAt,
        description: journal.description,
        status: "POSTED",
        sourceDocumentId: input.sourceDocumentId,
        idempotencyKey: input.idempotencyKey,
        postedAt: new Date(),
        lines: {
          create: journal.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit.minorUnits,
            credit: line.credit.minorUnits,
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
