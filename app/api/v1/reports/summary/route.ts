import { prisma } from "../../../../../src/lib/prisma";
import { authorizeApi } from "../../../../../src/application/api-platform/api-auth";

export async function GET(request: Request) {
  const auth = await authorizeApi(request, "reports:read");
  if ("error" in auth) return auth.error;

  const [receivables, payables] = await Promise.all([
    prisma.openBalance.aggregate({
      where: {
        workspaceId: auth.workspaceId,
        type: "RECEIVABLE",
        status: { in: ["OPEN", "PARTIALLY_PAID"] },
      },
      _sum: { outstandingAmount: true },
    }),
    prisma.openBalance.aggregate({
      where: {
        workspaceId: auth.workspaceId,
        type: "PAYABLE",
        status: { in: ["OPEN", "PARTIALLY_PAID"] },
      },
      _sum: { outstandingAmount: true },
    }),
  ]);

  return Response.json({
    data: {
      receivables: receivables._sum?.outstandingAmount?.toString() ?? "0",
      payables: payables._sum?.outstandingAmount?.toString() ?? "0",
    },
    meta: { version: "v1" },
  });
}
