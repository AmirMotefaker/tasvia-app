import { prisma } from "../../../../src/lib/prisma";
import { authorizeApi } from "../../../../src/application/api-platform/api-auth";
export async function GET(request:Request){
 const auth=await authorizeApi(request,"sales:read");
 if("error" in auth) return auth.error;
 const data=await prisma.salesInvoice.findMany({where:{workspaceId:auth.workspaceId},orderBy:{createdAt:"desc"},take:100});
 return Response.json({data,meta:{version:"v1",limit:100}});
}
