import { authorizeApi } from "../../../../src/application/api-platform/api-auth";
import { buildTreasuryProjection } from "../../../../src/application/accounting/treasury-projection";

export async function GET(request: Request) {
  const auth = await authorizeApi(request, "treasury:read");
  if ("error" in auth) return auth.error;

  const projection = await buildTreasuryProjection(auth.workspaceId);

  return Response.json({
    data: {
      accounts: projection.accounts.map((account) => ({
        ...account,
        balance: account.balance.toString(),
      })),
      recentMovements: projection.recentMovements.map((movement) => ({
        ...movement,
        amount: movement.amount.toString(),
        occurredAt: movement.occurredAt.toISOString(),
      })),
    },
    meta: { version: "v1" },
  });
}
