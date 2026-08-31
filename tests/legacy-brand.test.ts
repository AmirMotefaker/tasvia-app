import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOTS = ["app", "src"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);

function collect(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return collect(target);
    return extensions.has(path.extname(entry.name)) ? [target] : [];
  });
}

test("public application source does not regress to legacy Tasvia branding", () => {
  const offenders: string[] = [];

  for (const file of ROOTS.flatMap(collect)) {
    const source = fs.readFileSync(file, "utf8");
    if (/تسویا|Tasvia|tasvia\.ir|\/brand\/tasvia-/i.test(source)) offenders.push(file);
  }

  assert.deepEqual(offenders, []);
});
