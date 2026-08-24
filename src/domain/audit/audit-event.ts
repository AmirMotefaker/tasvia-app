export type AuditActorType =
  | "USER"
  | "SYSTEM"
  | "AI_AGENT";

export type AuditAction =
  | "PAYMENT_CREATED"
  | "PAYMENT_VERIFIED"
  | "PAYMENT_REJECTED"
  | "RECONCILIATION_REQUESTED"
  | "AUTO_RECONCILED"
  | "MANUAL_REVIEW_REQUIRED";

export interface AuditActor {
  type: AuditActorType;
  id?: string;
  displayName?: string;
}

export interface AuditEvent {
  action: AuditAction;
  actor: AuditActor;
  entityType: string;
  entityId: string;
  occurredAt: Date;
  reason?: string;
  confidenceScore?: number;
  metadata?: Readonly<Record<string, unknown>>;
}
