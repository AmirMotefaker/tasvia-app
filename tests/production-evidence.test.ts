import assert from "node:assert/strict";
import test from "node:test";
import { evaluateBackupRestoreEvidence, evaluateLaunchEvidence } from "../src/production/evidence";
import { isLegacyInventoryComplete, summarizeLegacyCredentialInventory } from "../src/production/legacy-inventory";

test("legacy inventory reports counts without credential material", () => {
  const summary = summarizeLegacyCredentialInventory([
    { hasLegacyCredential: true, hasModernCredential: false },
    { hasLegacyCredential: false, hasModernCredential: true },
    { hasLegacyCredential: true, hasModernCredential: true },
    { hasLegacyCredential: false, hasModernCredential: false },
  ]);

  assert.deepEqual(summary, {
    totalUsers: 4,
    legacyCredentialUsers: 2,
    modernCredentialUsers: 2,
    dualCredentialUsers: 1,
    noCredentialUsers: 1,
  });
  assert.equal(isLegacyInventoryComplete(summary), true);
});

test("backup readiness blocks incomplete restore evidence", () => {
  assert.deepEqual(evaluateBackupRestoreEvidence({
    backupCreated: true,
    checksumVerified: true,
    restoreRehearsed: false,
    restoredRowCountsMatched: false,
    restoredSchemaVerified: true,
  }), ["restore-not-rehearsed", "restore-row-count-mismatch"]);
});

test("launch evidence passes only when every destructive-operation prerequisite is proven", () => {
  assert.deepEqual(evaluateLaunchEvidence({
    backup: {
      backupCreated: true,
      checksumVerified: true,
      restoreRehearsed: true,
      restoredRowCountsMatched: true,
      restoredSchemaVerified: true,
    },
    migrationRehearsalPassed: true,
    rollbackPlanVerified: true,
    legacyInventoryComplete: true,
  }), []);
});
