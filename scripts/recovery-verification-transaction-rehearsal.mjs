import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const userId = crypto.randomUUID();
  const challengeId = crypto.randomUUID();
  const now = new Date();
  const challengeExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);

  await prisma.user.create({
    data: {
      id: userId,
      phone: `09${Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0")}`,
      role: "MERCHANT",
    },
  });

  await prisma.legacyRecoveryChallenge.create({
    data: {
      id: challengeId,
      userId,
      channel: "PHONE",
      destinationHint: "091*****644",
      expiresAt: challengeExpiresAt,
    },
  });

  const attempt = async () => {
    const grantId = crypto.randomUUID();
    return prisma.$transaction(async (tx) => {
      const verified = await tx.legacyRecoveryChallenge.updateMany({
        where: {
          id: challengeId,
          userId,
          verifiedAt: null,
          expiresAt: { gt: now },
        },
        data: { verifiedAt: now },
      });

      if (verified.count !== 1) return { won: false, grantId: null };

      await tx.legacyRecoveryGrant.create({
        data: {
          id: grantId,
          userId,
          issuedAt: now,
          expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
        },
      });

      return { won: true, grantId };
    });
  };

  const [first, second] = await Promise.all([attempt(), attempt()]);
  const winners = [first, second].filter((result) => result.won);
  const losers = [first, second].filter((result) => !result.won);

  if (winners.length !== 1 || losers.length !== 1) {
    throw new Error(`Expected one transaction winner; got ${JSON.stringify([first, second])}`);
  }

  const persistedGrants = await prisma.legacyRecoveryGrant.findMany({ where: { userId } });
  if (persistedGrants.length !== 1) {
    throw new Error(`Expected exactly one persisted grant; got ${persistedGrants.length}`);
  }

  const challenge = await prisma.legacyRecoveryChallenge.findUniqueOrThrow({ where: { id: challengeId } });
  if (!challenge.verifiedAt) throw new Error("Challenge verification was not persisted.");

  console.log("Recovery verification transaction rehearsal PASS: one challenge produced exactly one grant.");
} finally {
  await prisma.$disconnect();
}
