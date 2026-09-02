export const LEGACY_RECOVERY_GRANT_TTL_MS = 10 * 60 * 1000;

export type LegacyRecoveryChallenge = {
  challengeId: string;
  userId: string;
  channel: "phone" | "email";
  destinationHint: string;
  expiresAt: Date;
};

export type LegacyRecoveryGrant = {
  grantId: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  consumedAt: Date | null;
};

export type LegacyRecoveryGrantDecision =
  | { allowed: true }
  | { allowed: false; reason: "missing" | "expired" | "consumed" | "user-mismatch" };

export function evaluateLegacyRecoveryGrant(
  grant: LegacyRecoveryGrant | null,
  userId: string,
  now: Date,
): LegacyRecoveryGrantDecision {
  if (!grant) return { allowed: false, reason: "missing" };
  if (grant.userId !== userId) return { allowed: false, reason: "user-mismatch" };
  if (grant.consumedAt) return { allowed: false, reason: "consumed" };
  if (grant.expiresAt.getTime() <= now.getTime()) return { allowed: false, reason: "expired" };
  return { allowed: true };
}

export function createLegacyRecoveryGrant(input: {
  grantId: string;
  userId: string;
  now: Date;
}): LegacyRecoveryGrant {
  return {
    grantId: input.grantId,
    userId: input.userId,
    issuedAt: input.now,
    expiresAt: new Date(input.now.getTime() + LEGACY_RECOVERY_GRANT_TTL_MS),
    consumedAt: null,
  };
}

export function consumeLegacyRecoveryGrant(
  grant: LegacyRecoveryGrant,
  now: Date,
): LegacyRecoveryGrant {
  return { ...grant, consumedAt: now };
}
