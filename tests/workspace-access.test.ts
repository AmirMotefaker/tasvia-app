import test from "node:test";
import assert from "node:assert/strict";

import { requireSession } from "../src/auth/session";
import { requireWorkspaceAccess } from "../src/domain/workspace/access";

test("requireSession denies anonymous access", () => {
  assert.throws(() => requireSession(null), /AUTH_REQUIRED/);
});

test("requireWorkspaceAccess denies wrong workspace", () => {
  assert.throws(
    () =>
      requireWorkspaceAccess({
        membership: {
          workspaceId: "workspace-a",
          userId: "user-1",
          role: "OWNER",
          isActive: true,
        },
        workspaceId: "workspace-b",
      }),
    /WORKSPACE_ACCESS_DENIED/,
  );
});

test("requireWorkspaceAccess enforces minimum role", () => {
  assert.throws(
    () =>
      requireWorkspaceAccess({
        membership: {
          workspaceId: "workspace-a",
          userId: "user-1",
          role: "VIEWER",
          isActive: true,
        },
        workspaceId: "workspace-a",
        minimumRole: "FINANCE",
      }),
    /WORKSPACE_ROLE_DENIED/,
  );
});

test("requireWorkspaceAccess allows sufficient active membership", () => {
  const membership = requireWorkspaceAccess({
    membership: {
      workspaceId: "workspace-a",
      userId: "user-1",
      role: "ADMIN",
      isActive: true,
    },
    workspaceId: "workspace-a",
    minimumRole: "FINANCE",
  });

  assert.equal(membership.role, "ADMIN");
});
