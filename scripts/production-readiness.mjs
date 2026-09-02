const truthy = (name) => process.env[name] === "true";

const blockers = [];

const requiredEvidence = [
  ["TASVIN_BACKUP_VERIFIED", "backup-not-verified"],
  ["TASVIN_RESTORE_REHEARSED", "restore-not-rehearsed"],
  ["TASVIN_MIGRATION_REHEARSAL_PASSED", "migration-rehearsal-not-passed"],
  ["TASVIN_ROLLBACK_PLAN_VERIFIED", "rollback-plan-not-verified"],
  ["TASVIN_LEGACY_INVENTORY_COMPLETE", "legacy-inventory-incomplete"],
];

for (const [envName, blocker] of requiredEvidence) {
  if (!truthy(envName)) blockers.push(blocker);
}

const providers = [
  ["BANK_PSP", "TASVIN_ENABLE_BANK_PSP"],
  ["SMS_RECOVERY", "TASVIN_ENABLE_SMS_RECOVERY"],
  ["TAXPAYER", "TASVIN_ENABLE_TAXPAYER"],
  ["OFFICIAL_INQUIRY", "TASVIN_ENABLE_OFFICIAL_INQUIRY"],
  ["POS", "TASVIN_ENABLE_POS"],
];

for (const [kind, enableEnv] of providers) {
  if (!truthy(enableEnv)) continue;
  if (!truthy(`${enableEnv}_SANDBOX_VERIFIED`)) blockers.push(`${kind}:sandbox-not-verified`);
  if (!truthy(`${enableEnv}_CREDENTIALS_PRESENT`)) blockers.push(`${kind}:credentials-missing`);
  if (!truthy(`${enableEnv}_PRODUCTION_AUTHORIZED`)) blockers.push(`${kind}:production-not-authorized`);
}

const report = {
  status: blockers.length === 0 ? "READY" : "BLOCKED",
  blockers,
  providerActivationIsOptIn: true,
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = blockers.length === 0 ? 0 : 2;
