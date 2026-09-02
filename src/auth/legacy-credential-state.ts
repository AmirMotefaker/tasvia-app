export type LegacyCredentialState =
  | "MODERN_CREDENTIAL_READY"
  | "LEGACY_RECOVERY_REQUIRED"
  | "NO_PASSWORD_CREDENTIAL";

export type LegacyCredentialFacts = {
  hasLegacyPassword: boolean;
  hasModernPasswordAccount: boolean;
};

export function classifyLegacyCredentialState(
  facts: LegacyCredentialFacts,
): LegacyCredentialState {
  if (facts.hasModernPasswordAccount) return "MODERN_CREDENTIAL_READY";
  if (facts.hasLegacyPassword) return "LEGACY_RECOVERY_REQUIRED";
  return "NO_PASSWORD_CREDENTIAL";
}

export function canCleanupLegacyPassword(
  facts: LegacyCredentialFacts,
): boolean {
  return facts.hasModernPasswordAccount && !facts.hasLegacyPassword;
}
