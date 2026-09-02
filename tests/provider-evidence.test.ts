import assert from "node:assert/strict";
import test from "node:test";
import { providerHasProductionApproval, validateProviderSandboxEvidence } from "../src/production/provider-evidence";

test("valid sandbox evidence is accepted without implying production approval", () => {
  const evidence = {
    provider: "BANK_PSP" as const,
    environmentId: "sandbox-1",
    commitSha: "1a07e975",
    testedAt: new Date("2026-09-02T09:00:00Z"),
    passed: true,
    evidenceUrl: "https://example.invalid/evidence/run-1",
  };

  assert.deepEqual(validateProviderSandboxEvidence(evidence), []);
  assert.equal(providerHasProductionApproval(evidence), false);
});

test("production approval requires an explicit approver", () => {
  const evidence = {
    provider: "TAXPAYER" as const,
    environmentId: "tax-sandbox",
    commitSha: "abcdef1234567",
    testedAt: new Date("2026-09-02T09:00:00Z"),
    passed: true,
    evidenceUrl: "https://example.invalid/evidence/tax-1",
    productionApprovedBy: "release-owner",
  };

  assert.equal(providerHasProductionApproval(evidence), true);
});

test("invalid or failed evidence remains blocked", () => {
  const blockers = validateProviderSandboxEvidence({
    provider: "POS",
    environmentId: "",
    commitSha: "not-a-sha",
    testedAt: new Date("invalid"),
    passed: false,
    evidenceUrl: "http://unsafe.invalid",
  });

  assert.ok(blockers.includes("POS: environment-id-missing"));
  assert.ok(blockers.includes("POS: commit-sha-invalid"));
  assert.ok(blockers.includes("POS: sandbox-tests-failed"));
  assert.ok(blockers.includes("POS: evidence-url-invalid"));
  assert.ok(blockers.includes("POS: tested-at-invalid"));
});
