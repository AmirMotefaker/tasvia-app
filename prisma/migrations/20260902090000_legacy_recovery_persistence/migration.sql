CREATE TYPE "RecoveryChannel" AS ENUM ('PHONE', 'EMAIL');

CREATE TABLE "LegacyRecoveryChallenge" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "channel" "RecoveryChannel" NOT NULL,
  "destinationHint" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LegacyRecoveryChallenge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LegacyRecoveryGrant" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LegacyRecoveryGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LegacyRecoveryChallenge_userId_expiresAt_idx"
  ON "LegacyRecoveryChallenge"("userId", "expiresAt");

CREATE INDEX "LegacyRecoveryGrant_userId_expiresAt_consumedAt_idx"
  ON "LegacyRecoveryGrant"("userId", "expiresAt", "consumedAt");

ALTER TABLE "LegacyRecoveryChallenge"
  ADD CONSTRAINT "LegacyRecoveryChallenge_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LegacyRecoveryGrant"
  ADD CONSTRAINT "LegacyRecoveryGrant_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
