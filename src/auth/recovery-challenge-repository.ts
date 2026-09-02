import { PrismaClient, RecoveryChannel } from "@prisma/client";
import type { LegacyRecoveryChallenge } from "./legacy-recovery";

export class RecoveryChallengeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(challenge: LegacyRecoveryChallenge): Promise<void> {
    await this.prisma.legacyRecoveryChallenge.create({
      data: {
        id: challenge.challengeId,
        userId: challenge.userId,
        channel: challenge.channel === "phone" ? RecoveryChannel.PHONE : RecoveryChannel.EMAIL,
        destinationHint: challenge.destinationHint,
        expiresAt: challenge.expiresAt,
      },
    });
  }

  async verifyAtomically(input: {
    challengeId: string;
    userId: string;
    now: Date;
  }): Promise<boolean> {
    const result = await this.prisma.legacyRecoveryChallenge.updateMany({
      where: {
        id: input.challengeId,
        userId: input.userId,
        verifiedAt: null,
        expiresAt: { gt: input.now },
      },
      data: { verifiedAt: input.now },
    });

    return result.count === 1;
  }
}
