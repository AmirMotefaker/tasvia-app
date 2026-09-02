import { PrismaClient } from "@prisma/client";
import type { LegacyRecoveryGrant } from "./legacy-recovery";

export class RecoveryVerificationTransaction {
  constructor(private readonly prisma: PrismaClient) {}

  async verifyChallengeAndIssueGrant(input: {
    challengeId: string;
    userId: string;
    now: Date;
    grant: LegacyRecoveryGrant;
  }): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const verified = await tx.legacyRecoveryChallenge.updateMany({
        where: {
          id: input.challengeId,
          userId: input.userId,
          verifiedAt: null,
          expiresAt: { gt: input.now },
        },
        data: { verifiedAt: input.now },
      });

      if (verified.count !== 1) return false;

      await tx.legacyRecoveryGrant.create({
        data: {
          id: input.grant.grantId,
          userId: input.grant.userId,
          issuedAt: input.grant.issuedAt,
          expiresAt: input.grant.expiresAt,
          consumedAt: input.grant.consumedAt,
        },
      });

      return true;
    });
  }
}
