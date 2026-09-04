import { createHash, randomBytes } from "node:crypto";

export const API_SCOPES = [
  "customers:read","suppliers:read","sales:read","purchases:read",
  "inventory:read","treasury:read","reports:read"
] as const;
export type ApiScope=(typeof API_SCOPES)[number];

export function issueApiSecret(){
  const raw=randomBytes(32).toString("base64url");
  return { token:`tv_live_${raw}`, prefix:raw.slice(0,8), hash:hashApiSecret(`tv_live_${raw}`) };
}
export function hashApiSecret(token:string){return createHash("sha256").update(token).digest("hex")}
export function hasScope(granted:string[],required:ApiScope){return granted.includes(required)}
export function apiError(status:number,code:string,message:string){
  return Response.json({error:{code,message}},{status})
}
