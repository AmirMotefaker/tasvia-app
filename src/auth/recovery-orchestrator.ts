import {
  createLegacyRecoveryGrant,
  evaluateLegacyRecoveryGrant,
  type LegacyRecoveryGrant,
} from "./legacy-recovery";
import type {
  RecoveryDestination,
  RecoveryVerificationProvider,
} from "./recovery-provider";

export type RecoveryGrantStore = {
  save(grant: LegacyRecoveryGrant): Promise<void>;
  get(grantId: string): Promise<LegacyRecoveryGrant | null>;
  consume(grantId: string, consumedAt: Date): Promise<boolean>;
};

export type CredentialTransitionWriter = {
  setModernCredential(input: {
    userId: string;
    password: string;
    now: Date;
  }): Promise<void>;
};

export class RecoveryOrchestrator {
  constructor(
    private readonly provider: RecoveryVerificationProvider,
    private readonly grantStore: RecoveryGrantStore,
    private readonly credentialWriter: CredentialTransitionWriter,
    private readonly createGrantId: () => string,
  ) {}

  createChallenge(destination: RecoveryDestination, now: Date) {
    return this.provider.createChallenge({ destination, now });
  }

  async verifyAndIssueGrant(input: {
    challengeId: string;
    userId: string;
    proof: string;
    now: Date;
  }) {
    const result = await this.provider.verifyChallenge(input);
    if (!result.verified) return result;

    if (result.challenge.userId !== input.userId) {
      return { verified: false as const, reason: "invalid" as const };
    }

    const grant = createLegacyRecoveryGrant({
      grantId: this.createGrantId(),
      userId: input.userId,
      now: input.now,
    });
    await this.grantStore.save(grant);

    return { verified: true as const, grant };
  }

  async transitionCredential(input: {
    grantId: string;
    userId: string;
    newPassword: string;
    now: Date;
  }): Promise<
    | { ok: true }
    | { ok: false; reason: "missing" | "expired" | "consumed" | "user-mismatch" | "grant-race" }
  > {
    const grant = await this.grantStore.get(input.grantId);
    const decision = evaluateLegacyRecoveryGrant(grant, input.userId, input.now);
    if (!decision.allowed) return { ok: false, reason: decision.reason };

    const consumed = await this.grantStore.consume(input.grantId, input.now);
    if (!consumed) return { ok: false, reason: "grant-race" };

    await this.credentialWriter.setModernCredential({
      userId: input.userId,
      password: input.newPassword,
      now: input.now,
    });

    return { ok: true };
  }
}
