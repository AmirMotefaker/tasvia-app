import assert from "node:assert/strict";
import test from "node:test";
import { evaluateProductionReadiness, providerEnabledFromEnv } from "../src/production/readiness";

test("production readiness fails closed when core evidence is missing", () => {
  const result = evaluateProductionReadiness({
    backupVerified: false,
    migrationRehearsalPassed: true,
    rollbackPlanVerified: false,
    legacyCredentialInventoryComplete: false,
    providers: [],
  });

  assert.equal(result.ready, false);
  assert.deepEqual(result.blockers, [
    "backup-not-verified",
    "rollback-plan-not-verified",
    "legacy-credential-inventory-incomplete",
  ]);
});

test("disabled providers do not block launch", () => {
  const result = evaluateProductionReadiness({
    backupVerified: true,
    migrationRehearsalPassed: true,
    rollbackPlanVerified: true,
    legacyCredentialInventoryComplete: true,
    providers: [{
      kind: "BANK_PSP",
      enabled: false,
      sandboxVerified: false,
      credentialsPresent: false,
      productionAuthorized: false,
    }],
  });

  assert.equal(result.ready, true);
  assert.deepEqual(result.blockers, []);
});

test("enabled providers require sandbox credentials and explicit authorization", () => {
  const result = evaluateProductionReadiness({
    backupVerified: true,
    migrationRehearsalPassed: true,
    rollbackPlanVerified: true,
    legacyCredentialInventoryComplete: true,
    providers: [{
      kind: "TAXPAYER",
      enabled: true,
      sandboxVerified: false,
      credentialsPresent: true,
      productionAuthorized: false,
    }],
  });

  assert.equal(result.ready, false);
  assert.deepEqual(result.blockers, [
    "TAXPAYER: sandbox-not-verified",
    "TAXPAYER: production-not-authorized",
  ]);
});

test("provider flags are off unless explicitly true", () => {
  assert.equal(providerEnabledFromEnv(undefined), false);
  assert.equal(providerEnabledFromEnv("false"), false);
  assert.equal(providerEnabledFromEnv("TRUE"), false);
  assert.equal(providerEnabledFromEnv("true"), true);
});
