import assert from "node:assert/strict";
import test from "node:test";
import { evaluateWorkspaceGate, sanitizeInternalNextPath } from "../src/auth/workspace-gate";

test("workspace gate denies anonymous access", () => {
  assert.deepEqual(evaluateWorkspaceGate(null, null), { state: "AUTH_REQUIRED" });
});

test("workspace gate denies authenticated user without active membership", () => {
  assert.deepEqual(evaluateWorkspaceGate("user-1", null), { state: "MEMBERSHIP_REQUIRED" });
});

test("workspace gate allows authenticated active member with role context", () => {
  const membership = {
    role: "FINANCE" as const,
    workspace: { id: "workspace-1", name: "کسب‌وکار نمونه", slug: "sample-business" },
  };
  assert.deepEqual(evaluateWorkspaceGate("user-1", membership), { state: "ALLOWED", membership });
});

test("sign-in next path rejects external destinations", () => {
  assert.equal(sanitizeInternalNextPath("https://evil.example"), "/app");
  assert.equal(sanitizeInternalNextPath("//evil.example"), "/app");
  assert.equal(sanitizeInternalNextPath(null), "/app");
  assert.equal(sanitizeInternalNextPath("/app/reports"), "/app/reports");
});
