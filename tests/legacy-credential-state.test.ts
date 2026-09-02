import assert from "node:assert/strict";
import test from "node:test";
import {
  canCleanupLegacyPassword,
  classifyLegacyCredentialState,
} from "../src/auth/legacy-credential-state";

test("modern Better Auth password account wins over transitional legacy residue", () => {
  assert.equal(
    classifyLegacyCredentialState({
      hasLegacyPassword: true,
      hasModernPasswordAccount: true,
    }),
    "MODERN_CREDENTIAL_READY",
  );
});

test("legacy-only password requires verified recovery instead of blind hash copy", () => {
  assert.equal(
    classifyLegacyCredentialState({
      hasLegacyPassword: true,
      hasModernPasswordAccount: false,
    }),
    "LEGACY_RECOVERY_REQUIRED",
  );
});

test("user without either password credential is not treated as legacy recovery", () => {
  assert.equal(
    classifyLegacyCredentialState({
      hasLegacyPassword: false,
      hasModernPasswordAccount: false,
    }),
    "NO_PASSWORD_CREDENTIAL",
  );
});

test("legacy password cleanup is allowed only after modern credential exists and legacy residue is gone", () => {
  assert.equal(
    canCleanupLegacyPassword({
      hasLegacyPassword: false,
      hasModernPasswordAccount: true,
    }),
    true,
  );
  assert.equal(
    canCleanupLegacyPassword({
      hasLegacyPassword: true,
      hasModernPasswordAccount: true,
    }),
    false,
  );
  assert.equal(
    canCleanupLegacyPassword({
      hasLegacyPassword: false,
      hasModernPasswordAccount: false,
    }),
    false,
  );
});
