import type { AppRole } from "./session";

export type WorkspaceMembershipContext = {
  role: AppRole;
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
};

export type WorkspaceGateResult =
  | { state: "AUTH_REQUIRED" }
  | { state: "MEMBERSHIP_REQUIRED" }
  | { state: "ALLOWED"; membership: WorkspaceMembershipContext };

export function evaluateWorkspaceGate(
  userId: string | null | undefined,
  membership: WorkspaceMembershipContext | null,
): WorkspaceGateResult {
  if (!userId) return { state: "AUTH_REQUIRED" };
  if (!membership) return { state: "MEMBERSHIP_REQUIRED" };
  return { state: "ALLOWED", membership };
}

export function sanitizeInternalNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/app";
  return value;
}
