import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const userId = crypto.randomUUID();
  const challengeId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

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
      expiresAt,
    },
  });

  const verify = () => prisma.legacyRecoveryChallenge.updateMany({
    where: {
      id: challengeId,
      userId,
      verifiedAt: null,
      expiresAt: { gt: now },
    },
    data: { verifiedAt: now },
  });

  const [first, second] = await Promise.all([verify(), verify()]);
  const winners = [first.count, second.count].filter((count) => count === 1).length;
  const losers = [first.count, second.count].filter((count) => count === 0).length;

  if (winners !== 1 || losers !== 1) {
    throw new Error(`Expected exactly one atomic verifier; got counts ${first.count}, ${second.count}`);
  }

  const replay = await verify();
  if (replay.count !== 0) throw new Error("Verified challenge was replayable.");

  const wrongUser = await prisma.legacyRecoveryChallenge.updateMany({
    where: {
      id: challengeId,
      userId: crypto.randomUUID(),
      verifiedAt: null,
      expiresAt: { gt: now },
    },
    data: { verifiedAt: now },
  });
  if (wrongUser.count !== 0) throw new Error("Challenge could be verified for another user.");

  console.log("Recovery challenge concurrency rehearsal PASS: one verifier won and replay was rejected.");
} finally {
  await prisma.$disconnect();
}
