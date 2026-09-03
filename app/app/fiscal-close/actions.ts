"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { closeFiscalPeriod } from "../../../src/application/accounting/fiscal-close-service";

export async function closeFiscalPeriodAction(periodId: string): Promise<void> {
  const current = await requireCurrentWorkspace();
  if (!["OWNER", "ADMIN"].includes(current.role)) return;

  await closeFiscalPeriod({
    workspaceId: current.workspace.id,
    actorId: current.userId,
    fiscalPeriodId: periodId,
  });

  revalidatePath("/app/fiscal-close");
  revalidatePath("/app/reports/financial");
}
