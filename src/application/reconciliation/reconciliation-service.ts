import { prisma } from "../../lib/prisma";
import { assertFinancialWriteEnvironment } from "../accounting/simple-workflow-persistence";

function dayDistance(a: Date, b: Date) {
  return Math.abs(a.getTime() - b.getTime()) / 86_400_000;
}

export function reconciliationConfidence(input: {
  evidenceAmount: bigint;
  journalAmount: bigint;
  evidenceDate: Date;
  journalDate: Date;
  evidenceRef: string;
  journalRef: string | null;
}) {
  let score = 0;

  if (input.evidenceAmount === input.journalAmount) score += 60;

  const days = dayDistance(input.evidenceDate, input.journalDate);
  if (days === 0) score += 25;
  else if (days <= 1) score += 15;
  else if (days <= 3) score += 5;

  if (
    input.journalRef &&
    input.evidenceRef.trim() &&
    input.journalRef
      .toLowerCase()
      .includes(input.evidenceRef.trim().toLowerCase())
  ) {
    score += 15;
  }

  return Math.min(score, 100);
}

export async function listReconciliationWorkspace(workspaceId: string) {
  const [evidence, treasuryAccounts] = await Promise.all([
    prisma.bankEvidence.findMany({
      where: { workspaceId },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.accountingAccount.findMany({
      where: {
        workspaceId,
        active: true,
        code: { in: ["1101", "1102"] },
      },
      select: { id: true, code: true, name: true },
      orderBy: { code: "asc" },
    }),
  ]);

  const accountIds = treasuryAccounts.map((account) => account.id);
  const journalLines = accountIds.length
    ? await prisma.accountingJournalLine.findMany({
        where: {
          accountId: { in: accountIds },
          journal: { workspaceId, status: "POSTED" },
        },
        include: {
          account: { select: { code: true, name: true } },
          journal: {
            select: {
              id: true,
              occurredAt: true,
              description: true,
              sourceDocumentId: true,
            },
          },
        },
        orderBy: [{ journal: { occurredAt: "desc" } }],
        take: 300,
      })
    : [];

  return { evidence, treasuryAccounts, journalLines };
}

export async function createBankEvidence(input: {
  workspaceId: string;
  actorId: string;
  accountCode: "1101" | "1102";
  externalRef: string;
  amount: bigint;
  direction: "IN" | "OUT";
  occurredAt: Date;
  description?: string;
}) {
  assertFinancialWriteEnvironment();

  if (!input.externalRef.trim()) throw new Error("BANK_REFERENCE_REQUIRED");
  if (input.amount <= 0n) throw new Error("BANK_AMOUNT_INVALID");

  const account = await prisma.accountingAccount.findFirst({
    where: {
      workspaceId: input.workspaceId,
      active: true,
      code: input.accountCode,
    },
  });
  if (!account) throw new Error(`ACCOUNT_NOT_CONFIGURED:${input.accountCode}`);

  return prisma.bankEvidence.create({
    data: {
      workspaceId: input.workspaceId,
      accountCode: input.accountCode,
      externalRef: input.externalRef.trim(),
      amount: input.amount,
      direction: input.direction,
      occurredAt: input.occurredAt,
      description: input.description?.trim() || null,
      createdBy: input.actorId,
    },
  });
}

export async function decideEvidence(input: {
  workspaceId: string;
  actorId: string;
  evidenceId: string;
  journalLineId: string;
  decision: "MATCHED" | "REJECTED";
}) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const evidence = await tx.bankEvidence.findFirst({
      where: {
        id: input.evidenceId,
        workspaceId: input.workspaceId,
        status: "PENDING",
      },
    });
    if (!evidence) throw new Error("BANK_EVIDENCE_NOT_FOUND");

    if (input.decision === "REJECTED") {
      return tx.bankEvidence.update({
        where: { id: evidence.id },
        data: {
          status: "REJECTED",
          decidedBy: input.actorId,
          decidedAt: new Date(),
        },
      });
    }

    const line = await tx.accountingJournalLine.findFirst({
      where: {
        id: input.journalLineId,
        journal: { workspaceId: input.workspaceId, status: "POSTED" },
        account: { code: evidence.accountCode },
      },
      include: {
        journal: true,
      },
    });

    if (!line) throw new Error("TREASURY_JOURNAL_LINE_NOT_FOUND");

    const lineAmount = line.debit > 0n ? line.debit : line.credit;
    const lineDirection = line.debit > 0n ? "IN" : "OUT";

    if (lineDirection !== evidence.direction) {
      throw new Error("RECONCILIATION_DIRECTION_MISMATCH");
    }

    const score = reconciliationConfidence({
      evidenceAmount: evidence.amount,
      journalAmount: lineAmount,
      evidenceDate: evidence.occurredAt,
      journalDate: line.journal.occurredAt,
      evidenceRef: evidence.externalRef,
      journalRef: line.journal.sourceDocumentId,
    });

    if (score < 60) throw new Error("RECONCILIATION_CONFIDENCE_TOO_LOW");

    return tx.bankEvidence.update({
      where: { id: evidence.id },
      data: {
        status: "MATCHED",
        matchedJournalId: line.journal.id,
        confidenceScore: score,
        decidedBy: input.actorId,
        decidedAt: new Date(),
      },
    });
  });
}
