export interface RouteCheckEvidence {
  path: string;
  status: number;
  ok: boolean;
}

export interface LaunchRehearsalEvidence {
  commitSha: string;
  environment: "ci" | "staging";
  generatedAt: Date;
  migrationsPassed: boolean;
  zeroDrift: boolean;
  recoveryAtomicityPassed: boolean;
  readinessRemainedBlocked: boolean;
  sensitiveProvidersDisabled: boolean;
  routes: RouteCheckEvidence[];
}

export function evaluateLaunchRehearsal(evidence: LaunchRehearsalEvidence): string[] {
  const blockers: string[] = [];
  if (!/^[0-9a-f]{7,40}$/i.test(evidence.commitSha)) blockers.push("invalid-commit-sha");
  if (!evidence.migrationsPassed) blockers.push("migration-rehearsal-failed");
  if (!evidence.zeroDrift) blockers.push("schema-drift-detected");
  if (!evidence.recoveryAtomicityPassed) blockers.push("recovery-atomicity-failed");
  if (!evidence.readinessRemainedBlocked) blockers.push("production-readiness-not-blocked");
  if (!evidence.sensitiveProvidersDisabled) blockers.push("sensitive-provider-enabled");
  for (const route of evidence.routes) if (!route.ok || route.status < 200 || route.status >= 500) blockers.push(`route-failed:${route.path}:${route.status}`);
  return blockers;
}
