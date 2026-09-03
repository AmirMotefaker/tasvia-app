import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("P58 desktop shell pins navigation to physical right side", () => {
  const shell = readFileSync("src/components/workspace/shell.tsx", "utf8");
  assert.ok(shell.includes('dir="ltr"'));
  assert.ok(shell.includes("lg:grid-cols-[minmax(0,1fr)_282px]"));
  assert.ok(shell.includes("lg:col-start-2"));
});

test("P58 loads a real Persian web font", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.ok(css.includes("fonts.googleapis.com"));
  assert.ok(css.includes("Vazirmatn"));
  assert.ok(css.includes("--font-persian"));
});
