import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, authConfigured } from "../lib/auth";
import { resolveFirstActiveWorkspaceMembership } from "../domain/workspace/repository";
import { evaluateWorkspaceGate } from "./workspace-gate";

export async function requireCurrentWorkspace() {
  if (!authConfigured) {
    redirect("/sign-in?next=/app");
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id) redirect("/sign-in?next=/app");

  const membership = await resolveFirstActiveWorkspaceMembership(session.user.id);
  const gate = evaluateWorkspaceGate(session.user.id, membership);
  if (gate.state !== "ALLOWED") redirect("/sign-in?next=/app");

  return {
    userId: session.user.id,
    role: gate.membership.role,
    workspace: gate.membership.workspace,
  };
}
