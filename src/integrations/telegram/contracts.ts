export type TelegramNotificationKind =
  | "PAYMENT"
  | "SETTLEMENT"
  | "RECONCILIATION"
  | "SUPPLIER"
  | "DAILY_SUMMARY";

export interface TelegramWorkspaceConnection {
  id: string;
  workspaceId: string;
  telegramChatId: string;
  connectedByUserId: string;
  connectedAt: Date;
  revokedAt?: Date;
}

export interface TelegramNotificationPreference {
  workspaceId: string;
  kind: TelegramNotificationKind;
  enabled: boolean;
}

export interface TelegramBotEvent {
  id: string;
  workspaceId: string;
  connectionId: string;
  actorUserId?: string;
  action: "CONNECTED" | "REVOKED" | "STATUS_LOOKUP" | "NOTIFICATION_SENT" | "DEEP_LINK_CREATED";
  occurredAt: Date;
  correlationId: string;
}

export interface TelegramStatusLookup {
  workspaceId: string;
  connectionId: string;
  resourceType: "SETTLEMENT" | "SUPPLIER" | "RECONCILIATION";
  resourceId: string;
}

export interface TelegramDeepLink {
  workspaceId: string;
  path: string;
  expiresAt: Date;
}

export function assertActiveTelegramConnection(
  connection: TelegramWorkspaceConnection,
  workspaceId: string,
): void {
  if (connection.workspaceId !== workspaceId) {
    throw new Error("Cross-workspace Telegram access is forbidden");
  }
  if (connection.revokedAt) {
    throw new Error("Telegram connection has been revoked");
  }
}

export function createSafeTelegramDeepLink(input: {
  workspaceId: string;
  path: string;
  expiresAt: Date;
  now: Date;
}): TelegramDeepLink {
  if (!input.path.startsWith("/app/")) {
    throw new Error("Telegram deep links must target authenticated Tasvin app routes");
  }
  if (input.path.startsWith("//") || input.path.includes("://")) {
    throw new Error("External Telegram deep links are forbidden");
  }
  if (input.expiresAt.getTime() <= input.now.getTime()) {
    throw new Error("Telegram deep link expiry must be in the future");
  }
  return {
    workspaceId: input.workspaceId,
    path: input.path,
    expiresAt: input.expiresAt,
  };
}

export function shouldSendTelegramNotification(input: {
  connection: TelegramWorkspaceConnection;
  preference: TelegramNotificationPreference;
  kind: TelegramNotificationKind;
}): boolean {
  assertActiveTelegramConnection(input.connection, input.preference.workspaceId);
  return input.preference.kind === input.kind && input.preference.enabled;
}
