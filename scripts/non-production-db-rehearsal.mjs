import { execFileSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? databaseUrl;
const allowedMarkers = ["localhost", "127.0.0.1", "preview", "staging", "test", "dev"];

function assertNonProduction(url, name) {
  if (!url) throw new Error(`${name} is required for DB rehearsal`);
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${name} must be a valid database URL`);
  }
  const evidence = `${parsed.hostname} ${parsed.pathname}`.toLowerCase();
  if (!allowedMarkers.some((marker) => evidence.includes(marker))) {
    throw new Error(`${name} does not look explicitly non-production; refusing rehearsal`);
  }
}

assertNonProduction(databaseUrl, "DATABASE_URL");
assertNonProduction(directUrl, "DIRECT_URL");

const env = { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: directUrl };
const prisma = process.platform === "win32" ? "npx.cmd" : "npx";

console.log("Tasvin non-production DB rehearsal: safety gate passed.");
console.log("1/4 prisma validate");
execFileSync(prisma, ["prisma", "validate"], { stdio: "inherit", env });
console.log("2/4 prisma migrate status");
execFileSync(prisma, ["prisma", "migrate", "status"], { stdio: "inherit", env });
console.log("3/4 prisma migrate deploy");
execFileSync(prisma, ["prisma", "migrate", "deploy"], { stdio: "inherit", env });
console.log("4/4 prisma migrate status (post-deploy)");
execFileSync(prisma, ["prisma", "migrate", "status"], { stdio: "inherit", env });
console.log("PASS: non-production DB migration rehearsal completed.");
