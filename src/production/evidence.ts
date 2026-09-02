export interface BackupRestoreEvidence {
  backupCreated: boolean;
  checksumVerified: boolean;
  restoreRehearsed: boolean;
  restoredRowCountsMatched: boolean;
  restoredSchemaVerified: boolean;
}

export interface LaunchEvidence {
  backup: BackupRestoreEvidence;
  migrationRehearsalPassed: boolean;
  rollbackPlanVerified: boolean;
  legacyInventoryComplete: boolean;
}

export function evaluateBackupRestoreEvidence(input: BackupRestoreEvidence): string[] {
  const blockers: string[] = [];
  if (!input.backupCreated) blockers.push("backup-not-created");
  if (!input.checksumVerified) blockers.push("backup-checksum-not-verified");
  if (!input.restoreRehearsed) blockers.push("restore-not-rehearsed");
  if (!input.restoredRowCountsMatched) blockers.push("restore-row-count-mismatch");
  if (!input.restoredSchemaVerified) blockers.push("restore-schema-not-verified");
  return blockers;
}

export function evaluateLaunchEvidence(input: LaunchEvidence): string[] {
  const blockers = evaluateBackupRestoreEvidence(input.backup);
  if (!input.migrationRehearsalPassed) blockers.push("migration-rehearsal-not-passed");
  if (!input.rollbackPlanVerified) blockers.push("rollback-plan-not-verified");
  if (!input.legacyInventoryComplete) blockers.push("legacy-inventory-incomplete");
  return blockers;
}
