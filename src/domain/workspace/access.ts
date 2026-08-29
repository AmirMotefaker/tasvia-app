import type { AppRole } from "../../auth/session";

export type WorkspaceMembership = {
  workspaceId: string;
  userId: string;
  role: AppRole;
  isActive: boolean;
};

const roleRank: Record<AppRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  FINANCE: 2,
  VIEWER: 1,
};

export function requireWorkspaceAccess(input: {
  membership: WorkspaceMembership | null;
  workspaceId: string;
  minimumRole?: AppRole;
}): WorkspaceMembership {
  const { membership, workspaceId, minimumRole = "VIEWER" } = input;

  if (!membership || !membership.isActive || membership.workspaceId !== workspaceId) {
    throw new Error("WORKSPACE_ACCESS_DENIED");
  }

  if (roleRank[membership.role] < roleRank[minimumRole]) {
    throw new Error("WORKSPACE_ROLE_DENIED");
  }

  return membership;
}
