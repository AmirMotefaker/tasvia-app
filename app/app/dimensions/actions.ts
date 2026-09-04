"use server";

import type { AccountingDimensionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import {
  createDimensionValue,
  setDimensionValueActive,
} from "../../../src/application/accounting/dimension-service";

function assertCanManage(role: string) {
  if (role === "VIEWER") {
    throw new Error("DIMENSION_PERMISSION_DENIED");
  }
}

export async function createDimensionAction(formData: FormData): Promise<void> {
  const current = await requireCurrentWorkspace();
  assertCanManage(current.role);

  const type = String(formData.get("type") ?? "") as AccountingDimensionType;
  const code = String(formData.get("code") ?? "");
  const name = String(formData.get("name") ?? "");

  await createDimensionValue({
    workspaceId: current.workspace.id,
    type,
    code,
    name,
  });

  revalidatePath("/app/dimensions");
}

export async function setDimensionActiveAction(formData: FormData): Promise<void> {
  const current = await requireCurrentWorkspace();
  assertCanManage(current.role);

  const id = String(formData.get("id") ?? "").trim();
  const active = String(formData.get("active") ?? "") === "true";

  if (!id) throw new Error("DIMENSION_NOT_FOUND");

  await setDimensionValueActive({
    workspaceId: current.workspace.id,
    id,
    active,
  });

  revalidatePath("/app/dimensions");
}
