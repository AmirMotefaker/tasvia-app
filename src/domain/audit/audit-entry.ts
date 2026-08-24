import type { AuditEvent } from "./audit-event";

export interface AuditEntry extends AuditEvent {
  id: string;
  correlationId: string;
  createdAt: Date;
}
