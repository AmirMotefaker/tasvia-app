export type InquiryKind = "IDENTITY" | "IBAN" | "CARD" | "POSTAL";

export interface InquiryRequest {
  kind: InquiryKind;
  subject: string;
  correlationId: string;
}

export interface InquiryResult {
  correlationId: string;
  verified: boolean;
  providerReference?: string;
  checkedAt: Date;
}

export type PosProvider = "SADAD" | "BEHPARDAKHT" | "SEP" | "PEC" | "CUSTOM";

export interface PosTerminal {
  id: string;
  title: string;
  terminalId: string;
  provider: PosProvider;
  bankAccountId: string;
  active: boolean;
}

export interface TaxpayerSubmission {
  invoiceId: string;
  fiscalId: string;
  idempotencyKey: string;
  status: "DRAFT" | "READY" | "SUBMITTED" | "ACCEPTED" | "REJECTED";
  providerReference?: string;
}

export type ApprovalAction = "POST_JOURNAL" | "PAY_SUPPLIER" | "CLOSE_PERIOD" | "SUBMIT_TAX" | "EXPORT_BACKUP";
export type ApprovalRole = "OWNER" | "ACCOUNTANT" | "OPERATOR" | "AUDITOR";

export interface ApprovalRule {
  action: ApprovalAction;
  minimumApprovals: number;
  allowedRoles: ApprovalRole[];
}

export function canApprove(rule: ApprovalRule, role: ApprovalRole): boolean {
  return rule.minimumApprovals > 0 && rule.allowedRoles.includes(role);
}

export interface BackupManifest {
  workspaceId: string;
  createdAt: Date;
  schemaVersion: string;
  checksum: string;
  encrypted: boolean;
  includesDocuments: boolean;
}

export function validateBackupManifest(manifest: BackupManifest): void {
  if (!manifest.workspaceId.trim()) throw new Error("workspaceId is required");
  if (!manifest.schemaVersion.trim()) throw new Error("schemaVersion is required");
  if (manifest.checksum.length < 32) throw new Error("backup checksum is invalid");
  if (!manifest.encrypted) throw new Error("financial backups must be encrypted");
}

export type ProductLocale = "fa-IR" | "en-US";

export function resolveProductLocale(value?: string): ProductLocale {
  return value === "en-US" ? "en-US" : "fa-IR";
}
