"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../src/lib/prisma";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import {
  API_SCOPES,
  issueApiSecret,
} from "../../../src/application/api-platform/api-contract";

export async function createApiKey(formData: FormData): Promise<void> {
  const current = await requireCurrentWorkspace();
  if (current.role === "VIEWER") {
    throw new Error("دسترسی کافی ندارید.");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("نام کلید الزامی است.");
  }

  const issued = issueApiSecret();

  await prisma.apiKey.create({
    data: {
      workspaceId: current.workspace.id,
      name,
      prefix: issued.prefix,
      secretHash: issued.hash,
      scopes: [...API_SCOPES],
    },
  });

  // Deliberately do not return the raw secret from a Server Action.
  // Secret delivery needs an explicit client-safe one-time reveal surface.
  revalidatePath("/app/api-keys");
}

export async function revokeApiKey(formData: FormData): Promise<void> {
  const current = await requireCurrentWorkspace();
  if (current.role === "VIEWER") {
    throw new Error("دسترسی کافی ندارید.");
  }

  const id = String(formData.get("id") ?? "");

  await prisma.apiKey.updateMany({
    where: {
      id,
      workspaceId: current.workspace.id,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });

  revalidatePath("/app/api-keys");
}
