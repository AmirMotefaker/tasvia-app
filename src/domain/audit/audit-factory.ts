import type { AuditEntry } from "./audit-entry";
import type { AuditEvent } from "./audit-event";

export interface AuditEntryIdentifiers {
  id: string;
  correlationId: string;
}

export function createAuditEntry(
  event: AuditEvent,
  identifiers: AuditEntryIdentifiers,
): AuditEntry {
  return {
    ...event,
    id: identifiers.id,
    correlationId: identifiers.correlationId,
    createdAt: new Date(),
  };
}
