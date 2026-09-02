import assert from "node:assert/strict";
import test from "node:test";
import { canApprove, resolveProductLocale, validateBackupManifest } from "../src/domain/parity/platform-controls";

test("approval rules are role-bound", () => {
  const rule = { action: "CLOSE_PERIOD" as const, minimumApprovals: 2, allowedRoles: ["OWNER", "ACCOUNTANT"] as const };
  assert.equal(canApprove({ ...rule, allowedRoles: [...rule.allowedRoles] }, "OWNER"), true);
  assert.equal(canApprove({ ...rule, allowedRoles: [...rule.allowedRoles] }, "OPERATOR"), false);
});

test("financial backups must be encrypted and checksummed", () => {
  assert.doesNotThrow(() => validateBackupManifest({
    workspaceId: "ws-1",
    createdAt: new Date(),
    schemaVersion: "2026.09",
    checksum: "a".repeat(64),
    encrypted: true,
    includesDocuments: true,
  }));
  assert.throws(() => validateBackupManifest({
    workspaceId: "ws-1",
    createdAt: new Date(),
    schemaVersion: "2026.09",
    checksum: "short",
    encrypted: false,
    includesDocuments: false,
  }));
});

test("product locale defaults to Persian", () => {
  assert.equal(resolveProductLocale(), "fa-IR");
  assert.equal(resolveProductLocale("en-US"), "en-US");
});
