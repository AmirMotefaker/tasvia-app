import { prisma } from "../../lib/prisma";
import { assertFinancialWriteEnvironment } from "./simple-workflow-persistence";

export async function listFiscalPeriods(workspaceId: string) {
  return prisma.fiscalPeriod.findMany({
    where: { workspaceId },
    orderBy: { startsAt: "desc" },
  });
}

export async function fiscalCloseReadiness(
  workspaceId: string,
  fiscalPeriodId: string,
) {
  const period = await prisma.fiscalPeriod.findFirst({
    where: { id: fiscalPeriodId, workspaceId },
  });
  if (!period) throw new Error("FISCAL_PERIOD_NOT_FOUND");

  const [draftJournals, openReceivables, openPayables] = await Promise.all([
    prisma.accountingJournal.count({
      where: {
        workspaceId,
        fiscalPeriodId,
        status: "DRAFT",
      },
    }),
    prisma.openBalance.count({
      where: {
        workspaceId,
        type: "RECEIVABLE",
        status: { in: ["OPEN", "PARTIALLY_PAID"] },
        issuedAt: { lte: period.endsAt },
      },
    }),
    prisma.openBalance.count({
      where: {
        workspaceId,
        type: "PAYABLE",
        status: { in: ["OPEN", "PARTIALLY_PAID"] },
        issuedAt: { lte: period.endsAt },
      },
    }),
  ]);

  return {
    period,
    blockers: {
      draftJournals,
    },
    warnings: {
      openReceivables,
      openPayables,
    },
    canClose: draftJournals === 0 && period.status === "OPEN",
  };
}

export async function closeFiscalPeriod(input: {
  workspaceId: string;
  actorId: string;
  fiscalPeriodId: string;
}) {
  assertFinancialWriteEnvironment();

  return prisma.$transaction(async (tx) => {
    const period = await tx.fiscalPeriod.findFirst({
      where: {
        id: input.fiscalPeriodId,
        workspaceId: input.workspaceId,
      },
    });
    if (!period) throw new Error("FISCAL_PERIOD_NOT_FOUND");
    if (period.status === "CLOSED") return period;

    const drafts = await tx.accountingJournal.count({
      where: {
        workspaceId: input.workspaceId,
        fiscalPeriodId: period.id,
        status: "DRAFT",
      },
    });

    if (drafts > 0) throw new Error("FISCAL_CLOSE_DRAFT_JOURNALS");

    return tx.fiscalPeriod.update({
      where: { id: period.id },
      data: { status: "CLOSED" },
    });
  });
}
