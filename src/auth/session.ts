export type AppRole = "OWNER" | "ADMIN" | "FINANCE" | "VIEWER";

export type AppSession = {
  userId: string;
  email: string;
  displayName: string;
};

export function requireSession(session: AppSession | null): AppSession {
  if (!session) {
    throw new Error("AUTH_REQUIRED");
  }

  return session;
}
