import { toNextJsHandler } from "better-auth/next-js";
import { auth, authConfigured } from "../../../../src/lib/auth";

const handler = toNextJsHandler(auth);

function unavailable() {
  return Response.json(
    { error: "AUTH_NOT_CONFIGURED" },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!authConfigured) return unavailable();
  return handler.GET(request);
}

export async function POST(request: Request) {
  if (!authConfigured) return unavailable();
  return handler.POST(request);
}
