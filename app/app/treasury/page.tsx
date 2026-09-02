import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { buildTreasuryProjection } from "../../../src/application/accounting/treasury-projection";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

function date(value: Date) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(value);
}

export default async function TreasuryWorkspacePage() {
  const current = await requireCurrentWorkspace();
  const projection = await buildTreasuryProjection(current.workspace.id);
  const total = projection.accounts.reduce((sum, account) => sum + account.balance, 0n);

  return (
    <WorkspaceShell
      eyebrow="خزانه و جریان نقد"
      title="خزانه‌داری"
      actions={<Link href="/accounting/simple/receipt" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">دریافت جدید +</Link>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="text-xs font-black text-[#6c798c]">کل نقد و بانک</div>
          <div className="mt-4 text-xl font-black text-[#102845]">{money(total)}</div>
          <div className="mt-2 text-[11px] text-[#8190a3]">از خطوط POSTED دفتر</div>
        </article>
        {projection.accounts.map((account) => (
          <article key={account.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-[#6c798c]">{account.name}</span>
              <span className="rounded-lg bg-[#eef8f7] px-2 py-1 text-[10px] font-black text-[#0b8d85]">{account.code}</span>
            </div>
            <div className="mt-4 text-xl font-black text-[#102845]">{money(account.balance)}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div><div className="text-xs font-black text-[#0b8d85]">آخرین گردش‌ها</div><h2 className="mt-1 font-black text-[#102845]">تراکنش‌های واقعی خزانه</h2></div>
          <div className="flex gap-2">
            <Link href="/accounting/simple/payment" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#526177]">پرداخت</Link>
            <Link href="/accounting/simple/receipt" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#526177]">دریافت</Link>
            <Link href="/app/reconciliation" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#526177]">مغایرت‌گیری</Link>
          </div>
        </div>
        {projection.recentMovements.length === 0 ? (
          <div className="p-6 text-sm text-[#8190a3]">هنوز گردش خزانه‌ای در دفتر این فضای کاری ثبت نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-xs">
              <thead className="bg-[#f8fafc] text-[#66758a]"><tr><th className="px-5 py-3">نوع</th><th className="px-5 py-3">حساب</th><th className="px-5 py-3">شرح / مرجع</th><th className="px-5 py-3">مبلغ</th><th className="px-5 py-3">تاریخ</th></tr></thead>
              <tbody>
                {projection.recentMovements.map((movement) => (
                  <tr key={movement.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-black text-[#26354a]">{movement.direction === "IN" ? "ورودی" : "خروجی"}</td>
                    <td className="px-5 py-4 text-[#7a8798]">{movement.accountName}</td>
                    <td className="px-5 py-4 text-[#7a8798]">{movement.description}{movement.reference ? ` · ${movement.reference}` : ""}</td>
                    <td className="px-5 py-4 font-black text-[#102845]">{money(movement.amount)}</td>
                    <td className="px-5 py-4 text-[#7a8798]">{date(movement.occurredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
