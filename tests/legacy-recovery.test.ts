import assert from "node:assert/strict";
import test from "node:test";
import {
  LEGACY_RECOVERY_GRANT_TTL_MS,
  consumeLegacyRecoveryGrant,
  createLegacyRecoveryGrant,
  evaluateLegacyRecoveryGrant,
} from "../src/auth/legacy-recovery";

test("verified recovery grant is short-lived and user-bound", () => {
  const now = new Date("2026-09-02T04:45:00.000Z");
  const grant = createLegacyRecoveryGrant({ grantId: "grant-1", userId: "user-1", now });

  assert.equal(grant.expiresAt.getTime() - now.getTime(), LEGACY_RECOVERY_GRANT_TTL_MS);
  assert.deepEqual(evaluateLegacyRecoveryGrant(grant, "user-1", now), { allowed: true });
  assert.deepEqual(evaluateLegacyRecoveryGrant(grant, "user-2", now), {
    allowed: false,
    reason: "user-mismatch",
  });
});

test("recovery grant expires and cannot be reused", () => {
  const now = new Date("2026-09-02T04:45:00.000Z");
  const grant = createLegacyRecoveryGrant({ grantId: "grant-2", userId: "user-1", now });

  const expiredAt = new Date(now.getTime() + LEGACY_RECOVERY_GRANT_TTL_MS);
  assert.deepEqual(evaluateLegacyRecoveryGrant(grant, "user-1", expiredAt), {
    allowed: false,
    reason: "expired",
  });

  const consumed = consumeLegacyRecoveryGrant(grant, new Date(now.getTime() + 1_000));
  assert.deepEqual(evaluateLegacyRecoveryGrant(consumed, "user-1", new Date(now.getTime() + 2_000)), {
    allowed: false,
    reason: "consumed",
  });
});
