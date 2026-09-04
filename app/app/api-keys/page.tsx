import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { prisma } from "../../../src/lib/prisma";
import { createApiKey,revokeApiKey } from "./actions";
export default async function ApiKeysPage(){
 const current=await requireCurrentWorkspace();
 const keys=await prisma.apiKey.findMany({where:{workspaceId:current.workspace.id},orderBy:{createdAt:"desc"}});
 return <WorkspaceShell title="کلیدهای API" eyebrow="اتصال امن رست‌یار و سامانه‌های خارجی">
  <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
   <form action={createApiKey} className="rounded-3xl border bg-white p-5"><h2 className="font-black">کلید جدید</h2><input name="name" required placeholder="مثلاً RestYar Production" className="input mt-4 w-full"/><button className="mt-3 rounded-xl bg-[#0f223d] px-4 py-3 text-sm font-black text-white">ساخت کلید</button><p className="mt-3 text-xs text-slate-400">در پایگاه داده فقط هش کلید نگهداری می‌شود. نمایش یک‌باره Secret در گام بعدی با سطح امن اختصاصی تکمیل می‌شود.</p></form>
   <section className="rounded-3xl border bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-black">کلیدها</h2><Link href="/developers" className="text-sm font-bold text-[#008f87]">مستندات API</Link></div>
   <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr><th>نام</th><th>شناسه</th><th>آخرین استفاده</th><th>وضعیت</th><th/></tr></thead><tbody>{keys.map(k=><tr key={k.id}><td>{k.name}</td><td dir="ltr">tv_live_{k.prefix}…</td><td>{k.lastUsedAt?.toLocaleString("fa-IR")??"—"}</td><td>{k.revokedAt?"لغوشده":"فعال"}</td><td>{!k.revokedAt&&<form action={revokeApiKey}><input type="hidden" name="id" value={k.id}/><button className="font-bold text-rose-600">لغو</button></form>}</td></tr>)}</tbody></table></div>
   </section>
  </div>
 </WorkspaceShell>
}
