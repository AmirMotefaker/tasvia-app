import { prisma } from "../../../../src/lib/prisma";
import { authorizeApi } from "../../../../src/application/api-platform/api-auth";
export async function GET(request:Request){
 const auth=await authorizeApi(request,"suppliers:read");
 if("error" in auth) return auth.error;
 const data=await prisma.counterparty.findMany({where:{workspaceId:auth.workspaceId,type:{in:["SUPPLIER","BOTH"]}},select:{id:true,name:true,email:true,phone:true,createdAt:true},orderBy:{createdAt:"desc"},take:100});
 return Response.json({data,meta:{version:"v1",limit:100}});
}
