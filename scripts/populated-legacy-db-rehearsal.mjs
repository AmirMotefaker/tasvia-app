import { execFileSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.LEGACY_REHEARSAL_DATABASE_URL ?? "";
const allowedMarkers = ["localhost", "127.0.0.1", "preview", "staging", "test", "dev", "ci"];

function assertNonProduction(url, name) {
  if (!url) throw new Error(`${name} is required`);
  const parsed = new URL(url);
  const evidence = `${parsed.hostname} ${parsed.pathname}`.toLowerCase();
  if (!allowedMarkers.some((marker) => evidence.includes(marker))) {
    throw new Error(`${name} does not look explicitly non-production; refusing populated rehearsal`);
  }
}

assertNonProduction(databaseUrl, "LEGACY_REHEARSAL_DATABASE_URL");

const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  DIRECT_URL: databaseUrl,
};
const prismaCli = process.platform === "win32" ? "npx.cmd" : "npx";
const initialMigration = "20260720172828_init";
const initialSql = `prisma/migrations/${initialMigration}/migration.sql`;

console.log("Tasvin populated legacy DB rehearsal: safety gate passed.");
console.log("1/7 apply legacy baseline schema only");
execFileSync(prismaCli, ["prisma", "db", "execute", "--file", initialSql, "--url", databaseUrl], {
  stdio: "inherit",
  env,
});

console.log("2/7 record legacy baseline as applied");
execFileSync(prismaCli, ["prisma", "migrate", "resolve", "--applied", initialMigration], {
  stdio: "inherit",
  env,
});

const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
try {
  console.log("3/7 seed synthetic legacy user and merchant");
  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" ("id", "phone", "password", "role", "createdAt", "updatedAt")
    VALUES ('legacy-user-1', '09120000000', '$synthetic$legacy$hash', 'MERCHANT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Merchant" ("id", "userId", "name", "status", "createdAt", "updatedAt")
    VALUES ('legacy-merchant-1', 'legacy-user-1', 'Synthetic Legacy Merchant', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const before = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM "User") AS user_count,
      (SELECT COUNT(*)::int FROM "Merchant") AS merchant_count,
      (SELECT COUNT(*)::int FROM "User" WHERE "password" IS NOT NULL) AS legacy_password_count
  `);
  const snapshot = before[0];
  if (snapshot.user_count !== 1 || snapshot.merchant_count !== 1 || snapshot.legacy_password_count !== 1) {
    throw new Error(`Unexpected legacy seed inventory: ${JSON.stringify(snapshot)}`);
  }

  console.log("4/7 deploy reviewed migration onto populated legacy database");
  execFileSync(prismaCli, ["prisma", "migrate", "deploy"], { stdio: "inherit", env });

  console.log("5/7 verify relational data survived");
  const after = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM "User" WHERE "id" = 'legacy-user-1') AS user_count,
      (SELECT COUNT(*)::int FROM "Merchant" WHERE "id" = 'legacy-merchant-1' AND "userId" = 'legacy-user-1') AS merchant_count
  `);
  if (after[0].user_count !== 1 || after[0].merchant_count !== 1) {
    throw new Error(`Legacy relational data was not preserved: ${JSON.stringify(after[0])}`);
  }

  console.log("6/7 verify legacy password column was destructively removed");
  const passwordColumn = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS count
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'password'
  `);
  if (passwordColumn[0].count !== 0) {
    throw new Error("Expected legacy User.password column to be removed by reviewed migration");
  }

  const credentialRows = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS count FROM "Account" WHERE "userId" = 'legacy-user-1' AND "password" IS NOT NULL
  `);
  if (credentialRows[0].count !== 0) {
    throw new Error("Unexpected automatic credential migration detected; review migration assumptions");
  }

  console.log("7/7 verify final schema has zero drift");
  execFileSync(
    prismaCli,
    ["prisma", "migrate", "diff", "--from-url", databaseUrl, "--to-schema-datamodel", "prisma/schema.prisma", "--exit-code"],
    { stdio: "inherit", env },
  );

  console.log("PASS: populated legacy rehearsal confirms data preservation but credential loss without explicit transfer.");
} finally {
  await prisma.$disconnect();
}
