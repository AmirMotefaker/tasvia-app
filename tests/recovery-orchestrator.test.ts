import assert from "node:assert/strict";
import test from "node:test";
import type { LegacyRecoveryGrant } from "../src/auth/legacy-recovery";
import { RecoveryOrchestrator } from "../src/auth/recovery-orchestrator";
import type { RecoveryVerificationProvider } from "../src/auth/recovery-provider";

function makeHarness(verified = true) {
  const grants = new Map<string, LegacyRecoveryGrant>();
  const writes: Array<{ userId: string; password: string }> = [];

  const provider: RecoveryVerificationProvider = {
    async createChallenge({ destination, now }) {
      return {
        challengeId: "challenge-1",
        userId: destination.userId,
        channel: destination.channel,
        destinationHint: "masked",
        expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
      };
    },
    async verifyChallenge({ userId, now }) {
      if (!verified) return { verified: false, reason: "invalid" } as const;
      return {
        verified: true,
        challenge: {
          challengeId: "challenge-1",
          userId,
          channel: "phone",
          destinationHint: "masked",
          expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
        },
      } as const;
    },
  };

  const orchestrator = new RecoveryOrchestrator(
    provider,
    {
      async save(grant) {
        grants.set(grant.grantId, grant);
      },
      async get(grantId) {
        return grants.get(grantId) ?? null;
      },
      async consume(grantId, consumedAt) {
        const grant = grants.get(grantId);
        if (!grant || grant.consumedAt) return false;
        grants.set(grantId, { ...grant, consumedAt });
        return true;
      },
    },
    {
      async setModernCredential({ userId, password }) {
        writes.push({ userId, password });
      },
    },
    () => "grant-1",
  );

  return { orchestrator, grants, writes };
}

test("does not issue a grant when verification fails", async () => {
  const { orchestrator, grants } = makeHarness(false);
  const result = await orchestrator.verifyAndIssueGrant({
    challengeId: "challenge-1",
    userId: "user-1",
    proof: "bad",
    now: new Date("2026-09-02T05:00:00Z"),
  });

  assert.equal(result.verified, false);
  assert.equal(grants.size, 0);
});

test("issues a user-bound grant only after verification", async () => {
  const { orchestrator, grants } = makeHarness(true);
  const result = await orchestrator.verifyAndIssueGrant({
    challengeId: "challenge-1",
    userId: "user-1",
    proof: "ok",
    now: new Date("2026-09-02T05:00:00Z"),
  });

  assert.equal(result.verified, true);
  assert.equal(grants.get("grant-1")?.userId, "user-1");
});

test("consumes the grant before writing the modern credential", async () => {
  const { orchestrator, writes } = makeHarness(true);
  const now = new Date("2026-09-02T05:00:00Z");
  const verification = await orchestrator.verifyAndIssueGrant({
    challengeId: "challenge-1",
    userId: "user-1",
    proof: "ok",
    now,
  });
  assert.equal(verification.verified, true);

  const first = await orchestrator.transitionCredential({
    grantId: "grant-1",
    userId: "user-1",
    newPassword: "modern-password-123",
    now: new Date(now.getTime() + 1000),
  });
  assert.deepEqual(first, { ok: true });
  assert.equal(writes.length, 1);

  const second = await orchestrator.transitionCredential({
    grantId: "grant-1",
    userId: "user-1",
    newPassword: "modern-password-456",
    now: new Date(now.getTime() + 2000),
  });
  assert.deepEqual(second, { ok: false, reason: "consumed" });
  assert.equal(writes.length, 1);
});

test("rejects a grant for a different user", async () => {
  const { orchestrator, writes } = makeHarness(true);
  const now = new Date("2026-09-02T05:00:00Z");
  await orchestrator.verifyAndIssueGrant({
    challengeId: "challenge-1",
    userId: "user-1",
    proof: "ok",
    now,
  });

  const result = await orchestrator.transitionCredential({
    grantId: "grant-1",
    userId: "user-2",
    newPassword: "modern-password-123",
    now: new Date(now.getTime() + 1000),
  });

  assert.deepEqual(result, { ok: false, reason: "user-mismatch" });
  assert.equal(writes.length, 0);
});
