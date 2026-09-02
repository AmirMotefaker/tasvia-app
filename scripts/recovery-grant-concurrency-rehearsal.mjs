import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const userId = crypto.randomUUID();
  const grantId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

  await prisma.user.create({
    data: {
      id: userId,
      phone: `09${Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0")}`,
      role: "MERCHANT",
    },
  });

  await prisma.legacyRecoveryGrant.create({
    data: {
      id: grantId,
      userId,
      issuedAt: now,
      expiresAt,
    },
  });

  const consume = () => prisma.legacyRecoveryGrant.updateMany({
    where: {
      id: grantId,
      userId,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    data: { consumedAt: now },
  });

  const [first, second] = await Promise.all([consume(), consume()]);
  const winners = [first.count, second.count].filter((count) => count === 1).length;
  const losers = [first.count, second.count].filter((count) => count === 0).length;

  if (winners !== 1 || losers !== 1) {
    throw new Error(`Expected exactly one atomic consumer; got counts ${first.count}, ${second.count}`);
  }

  const persisted = await prisma.legacyRecoveryGrant.findUniqueOrThrow({ where: { id: grantId } });
  if (!persisted.consumedAt) throw new Error("Grant was not persisted as consumed.");

  console.log("Recovery grant concurrency rehearsal PASS: exactly one consumer won.");
} finally {
  await prisma.$disconnect();
}
