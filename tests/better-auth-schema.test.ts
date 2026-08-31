import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const authSource = fs.readFileSync("src/lib/auth.ts", "utf8");

function modelBlock(name: string): string {
  const start = schema.indexOf(`model ${name} {`);
  assert.notEqual(start, -1, `${name} model must exist`);
  const next = schema.indexOf("\nmodel ", start + 1);
  return schema.slice(start, next === -1 ? schema.length : next);
}

test("Better Auth credentials live on Account, not User", () => {
  assert.doesNotMatch(modelBlock("User"), /^\s*password\s+/m);
  assert.match(modelBlock("Account"), /^\s*password\s+String\?/m);
});

test("Better Auth account identity is issuer scoped", () => {
  const account = modelBlock("Account");
  assert.match(account, /^\s*issuer\s+String\s*$/m);
  assert.match(account, /@@unique\(\[issuer,\s*accountId\]\)/);
  assert.doesNotMatch(account, /@@unique\(\[providerId,\s*accountId\]\)/);
});

test("auth config avoids unsupported identityStrategy option", () => {
  assert.doesNotMatch(authSource, /identityStrategy/);
});
