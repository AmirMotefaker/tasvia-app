import assert from "node:assert/strict";
import test from "node:test";
import { evaluateLaunchRehearsal } from "../src/rehearsal/evidence";
import { rehearsalRoutes, validateRouteManifest } from "../src/rehearsal/routes";

test("route manifest is unique and valid", () => {
  assert.doesNotThrow(() => validateRouteManifest());
  assert.ok(rehearsalRoutes.length >= 20);
});

test("launch rehearsal passes only with complete safe evidence", () => {
  const routes = rehearsalRoutes.map((route) => ({ path: route.path, status: 200, ok: true }));
  assert.deepEqual(evaluateLaunchRehearsal({
    commitSha: "abcdef1234567",
    environment: "ci",
    generatedAt: new Date(),
    migrationsPassed: true,
    zeroDrift: true,
    recoveryAtomicityPassed: true,
    readinessRemainedBlocked: true,
    sensitiveProvidersDisabled: true,
    routes,
  }), []);
});

test("launch rehearsal blocks unsafe promotion", () => {
  const blockers = evaluateLaunchRehearsal({
    commitSha: "bad",
    environment: "staging",
    generatedAt: new Date(),
    migrationsPassed: true,
    zeroDrift: true,
    recoveryAtomicityPassed: true,
    readinessRemainedBlocked: false,
    sensitiveProvidersDisabled: false,
    routes: [{ path: "/app", status: 500, ok: false }],
  });
  assert.ok(blockers.includes("invalid-commit-sha"));
  assert.ok(blockers.includes("production-readiness-not-blocked"));
  assert.ok(blockers.includes("sensitive-provider-enabled"));
  assert.ok(blockers.some((item) => item.startsWith("route-failed:/app")));
});
