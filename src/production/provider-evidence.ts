import type { ProviderKind } from "./readiness";

export interface ProviderSandboxEvidence {
  provider: ProviderKind;
  environmentId: string;
  commitSha: string;
  testedAt: Date;
  passed: boolean;
  evidenceUrl: string;
  productionApprovedBy?: string;
}

export function validateProviderSandboxEvidence(evidence: ProviderSandboxEvidence): string[] {
  const blockers: string[] = [];

  if (!evidence.environmentId.trim()) blockers.push(`${evidence.provider}: environment-id-missing`);
  if (!/^[0-9a-f]{7,40}$/i.test(evidence.commitSha)) blockers.push(`${evidence.provider}: commit-sha-invalid`);
  if (!evidence.passed) blockers.push(`${evidence.provider}: sandbox-tests-failed`);
  if (!/^https:\/\//i.test(evidence.evidenceUrl)) blockers.push(`${evidence.provider}: evidence-url-invalid`);
  if (Number.isNaN(evidence.testedAt.getTime())) blockers.push(`${evidence.provider}: tested-at-invalid`);

  return blockers;
}

export function providerHasProductionApproval(evidence: ProviderSandboxEvidence): boolean {
  return evidence.passed && Boolean(evidence.productionApprovedBy?.trim());
}
