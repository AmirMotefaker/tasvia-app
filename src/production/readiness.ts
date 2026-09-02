export type ProviderKind = "BANK_PSP" | "SMS_RECOVERY" | "TAXPAYER" | "OFFICIAL_INQUIRY" | "POS";

export interface ProviderReadinessInput {
  kind: ProviderKind;
  enabled: boolean;
  sandboxVerified: boolean;
  credentialsPresent: boolean;
  productionAuthorized: boolean;
}

export interface ProductionReadinessInput {
  backupVerified: boolean;
  migrationRehearsalPassed: boolean;
  rollbackPlanVerified: boolean;
  legacyCredentialInventoryComplete: boolean;
  providers: ProviderReadinessInput[];
}

export interface ReadinessResult {
  ready: boolean;
  blockers: string[];
}

export function evaluateProviderReadiness(provider: ProviderReadinessInput): string[] {
  if (!provider.enabled) return [];

  const blockers: string[] = [];
  if (!provider.sandboxVerified) blockers.push(`${provider.kind}: sandbox-not-verified`);
  if (!provider.credentialsPresent) blockers.push(`${provider.kind}: credentials-missing`);
  if (!provider.productionAuthorized) blockers.push(`${provider.kind}: production-not-authorized`);
  return blockers;
}

export function evaluateProductionReadiness(input: ProductionReadinessInput): ReadinessResult {
  const blockers: string[] = [];

  if (!input.backupVerified) blockers.push("backup-not-verified");
  if (!input.migrationRehearsalPassed) blockers.push("migration-rehearsal-not-passed");
  if (!input.rollbackPlanVerified) blockers.push("rollback-plan-not-verified");
  if (!input.legacyCredentialInventoryComplete) blockers.push("legacy-credential-inventory-incomplete");

  for (const provider of input.providers) blockers.push(...evaluateProviderReadiness(provider));

  return { ready: blockers.length === 0, blockers };
}

export function providerEnabledFromEnv(value: string | undefined): boolean {
  return value === "true";
}
