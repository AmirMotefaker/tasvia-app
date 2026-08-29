import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const secret = process.env.BETTER_AUTH_SECRET;
if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
}
export const auth = betterAuth({
  appName: "Tasvia",
  secret: secret ?? "tasvia-local-validation-secret-32-characters-minimum",
  database: prismaAdapter(prisma,{provider:"postgresql"}),
  emailAndPassword:{enabled:true},
});
