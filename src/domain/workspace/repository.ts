import { prisma } from "../../lib/prisma";
export async function resolveActiveWorkspaceMembership(userId:string,workspaceId:string){
  return prisma.membership.findFirst({
    where:{userId,workspaceId,status:"ACTIVE"},
    select:{role:true,workspace:{select:{id:true,name:true}}},
  });
}
