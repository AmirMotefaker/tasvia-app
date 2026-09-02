export interface LegacyCredentialInventory {
  totalUsers: number;
  legacyCredentialUsers: number;
  modernCredentialUsers: number;
  dualCredentialUsers: number;
  noCredentialUsers: number;
}

export interface InventoryRow {
  hasLegacyCredential: boolean;
  hasModernCredential: boolean;
}

export function summarizeLegacyCredentialInventory(rows: InventoryRow[]): LegacyCredentialInventory {
  let legacyCredentialUsers = 0;
  let modernCredentialUsers = 0;
  let dualCredentialUsers = 0;
  let noCredentialUsers = 0;

  for (const row of rows) {
    if (row.hasLegacyCredential) legacyCredentialUsers += 1;
    if (row.hasModernCredential) modernCredentialUsers += 1;
    if (row.hasLegacyCredential && row.hasModernCredential) dualCredentialUsers += 1;
    if (!row.hasLegacyCredential && !row.hasModernCredential) noCredentialUsers += 1;
  }

  return {
    totalUsers: rows.length,
    legacyCredentialUsers,
    modernCredentialUsers,
    dualCredentialUsers,
    noCredentialUsers,
  };
}

export function isLegacyInventoryComplete(summary: LegacyCredentialInventory): boolean {
  return summary.totalUsers === summary.legacyCredentialUsers + summary.modernCredentialUsers - summary.dualCredentialUsers + summary.noCredentialUsers;
}
