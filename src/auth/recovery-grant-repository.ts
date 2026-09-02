import { PrismaClient } from "@prisma/client";
import type { LegacyRecoveryGrant } from "./legacy-recovery";

export class RecoveryGrantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(grant: LegacyRecoveryGrant): Promise<void> {
    await this.prisma.legacyRecoveryGrant.create({
      data: {
        id: grant.grantId,
        userId: grant.userId,
        issuedAt: grant.issuedAt,
        expiresAt: grant.expiresAt,
        consumedAt: grant.consumedAt,
      },
    });
  }

  async getById(grantId: string): Promise<LegacyRecoveryGrant | null> {
    const grant = await this.prisma.legacyRecoveryGrant.findUnique({ where: { id: grantId } });
    if (!grant) return null;

    return {
      grantId: grant.id,
      userId: grant.userId,
      issuedAt: grant.issuedAt,
      expiresAt: grant.expiresAt,
      consumedAt: grant.consumedAt,
    };
  }

  async consumeAtomically(input: {
    grantId: string;
    userId: string;
    now: Date;
  }): Promise<boolean> {
    const result = await this.prisma.legacyRecoveryGrant.updateMany({
      where: {
        id: input.grantId,
        userId: input.userId,
        consumedAt: null,
        expiresAt: { gt: input.now },
      },
      data: { consumedAt: input.now },
    });

    return result.count === 1;
  }
}
