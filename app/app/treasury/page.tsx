import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const accounts = [
  ["حساب بانکی", "در انتظار داده", "بانک"],
  ["صندوق", "در انتظار داده", "نقد"],
  ["تنخواه", "در انتظار داده", "خرد"],
  ["اسناد دریافتنی", "در انتظار داده", "چک"],
];

export default function TreasuryWorkspacePage() {
  return (
    <WorkspaceShell
      eyebrow="خزانه و جریان نقد"
      title="خزانه‌داری"
      actions={<Link href="/accounting/simple/receipt" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">دریافت جدید +</Link>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {accounts.map(([title, value, kind]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="flex items-center justify-between"><span className="text-xs font-black text-[#6c798c]">{title}</span><span className="rounded-lg bg-[#eef8f7] px-2 py-1 text-[10px] font-black text-[#0b8d85]">{kind}</span></div>
            <div className="mt-4 text-xl font-black text-[#102845]">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><div className="text-xs font-black text-[#0b8d85]">گردش نقد</div><h2 className="mt-1 text-lg font-black text-[#102845]">دریافت، پرداخت و مانده</h2></div>
            <Link href="/app/reconciliation" className="text-xs font-black text-[#0b8d85]">مغایرت‌گیری</Link>
          </div>
          <div className="mt-6 grid h-64 grid-cols-12 items-end gap-2 rounded-2xl bg-[#f8fafc] p-5">
            {[48, 70, 55, 82, 63, 74, 52, 86, 66, 78, 58, 72].map((height, index) => (
              <div key={index} className="flex h-full items-end"><div className="w-full rounded-t-md bg-[#bce9e5]" style={{ height: `${height}%` }} /></div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-6 text-[#7b8899]">نمودار فعلی فقط حالت رابط است و مقدار مالی ساختگی نمایش نمی‌دهد؛ داده واقعی از دفتر خزانه خوانده می‌شود.</p>
        </article>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="border-b border-slate-100 p-5"><div className="text-xs font-black text-[#0b8d85]">حساب‌ها</div><h2 className="mt-1 text-lg font-black text-[#102845]">بانک، صندوق و تنخواه</h2></div>
          <div className="divide-y divide-slate-100">
            {["بانک‌های فعال", "صندوق‌های فعال", "تنخواه‌گردان‌ها", "چک‌های در جریان"].map((label) => (
              <div key={label} className="flex items-center justify-between gap-4 p-4"><div><div className="text-sm font-black text-[#26354a]">{label}</div><div className="mt-1 text-[11px] text-[#8190a3]">پس از اتصال داده فضای کاری</div></div><span className="text-xs font-black text-[#0b8d85]">—</span></div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><div className="text-xs font-black text-[#0b8d85]">آخرین گردش‌ها</div><h2 className="mt-1 font-black text-[#102845]">تراکنش‌های خزانه</h2></div><div className="flex gap-2"><Link href="/accounting/simple/payment" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#526177]">پرداخت</Link><Link href="/accounting/simple/receipt" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#526177]">دریافت</Link></div></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-xs">
            <thead className="bg-[#f8fafc] text-[#66758a]"><tr><th className="px-5 py-3">نوع</th><th className="px-5 py-3">حساب</th><th className="px-5 py-3">مرجع</th><th className="px-5 py-3">مبلغ</th><th className="px-5 py-3">وضعیت</th></tr></thead>
            <tbody>
              {["دریافت مشتری", "پرداخت تأمین‌کننده", "انتقال داخلی", "چک"].map((type) => (
                <tr key={type} className="border-t border-slate-100"><td className="px-5 py-4 font-black text-[#26354a]">{type}</td><td className="px-5 py-4 text-[#7a8798]">پس از اتصال داده</td><td className="px-5 py-4 text-[#7a8798]">—</td><td className="px-5 py-4 text-[#7a8798]">در انتظار داده</td><td className="px-5 py-4"><span className="rounded-lg bg-[#eef8f7] px-2.5 py-1.5 font-black text-[#0b8d85]">آماده نمایش</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </WorkspaceShell>
  );
}
