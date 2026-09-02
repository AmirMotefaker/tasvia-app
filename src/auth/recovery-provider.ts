import type { LegacyRecoveryChallenge } from "./legacy-recovery";

export type RecoveryDestination = {
  userId: string;
  channel: "phone" | "email";
  address: string;
};

export type RecoveryChallengeRequest = {
  destination: RecoveryDestination;
  now: Date;
};

export type RecoveryVerificationResult =
  | { verified: true; challenge: LegacyRecoveryChallenge }
  | { verified: false; reason: "invalid" | "expired" | "rate-limited" | "unavailable" };

export interface RecoveryVerificationProvider {
  createChallenge(input: RecoveryChallengeRequest): Promise<LegacyRecoveryChallenge>;
  verifyChallenge(input: {
    challengeId: string;
    userId: string;
    proof: string;
    now: Date;
  }): Promise<RecoveryVerificationResult>;
}

export function maskRecoveryDestination(channel: "phone" | "email", address: string): string {
  if (channel === "email") {
    const [local = "", domain = ""] = address.split("@");
    const visible = local.slice(0, 2);
    return domain ? `${visible}***@${domain}` : "***";
  }

  const digits = address.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `${digits.slice(0, 3)}*****${digits.slice(-3)}`;
}
