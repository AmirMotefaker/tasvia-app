"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import {
  closeFiscalPeriod,
  reopenFiscalPeriod,
} from "../../../src/application/accounting/fiscal-close-service";

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

export async function reopenFiscalPeriodAction(
  periodId: string,
  formData: FormData,
): Promise<void> {
  const current = await requireCurrentWorkspace();
  if (!["OWNER", "ADMIN"].includes(current.role)) return;

  await reopenFiscalPeriod({
    workspaceId: current.workspace.id,
    actorId: current.userId,
    fiscalPeriodId: periodId,
    reason: String(formData.get("reason") ?? ""),
  });

  revalidatePath("/app/fiscal-close");
  revalidatePath("/app/reports/financial");
}
