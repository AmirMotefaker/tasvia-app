import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { listSettlementOptions } from "../../../src/application/settlements/settlement-service";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

export default async function SettlementsPage() {
  const current = await requireCurrentWorkspace();
  const data = await listSettlementOptions(current.workspace.id);

  const receivableTotal = data.receivables.reduce(
    (sum, balance) => sum + balance.outstandingAmount,
    0n,
  );
  const payableTotal = data.payables.reduce(
    (sum, balance) => sum + balance.outstandingAmount,
    0n,
  );

  const rows = [
    ...data.receivables.map((balance) => ({
      id: balance.id,
      counterpartyName: balance.counterpartyName,
      type: "RECEIVABLE",
      amount: balance.outstandingAmount,
      dueAt: balance.dueAt,
    })),
    ...data.payables.map((balance) => ({
      id: balance.id,
      counterpartyName: balance.counterpartyName,
      type: "PAYABLE",
      amount: balance.outstandingAmount,
      dueAt: balance.dueAt,
    })),
  ].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());

  return (
    <WorkspaceShell
      title="تسویه‌ها"
      eyebrow="مطالبات و بدهی‌های واقعی"
      actions={
        <Link
          href="/app/treasury"
          className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white"
        >
          ثبت دریافت / پرداخت
        </Link>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["مطالبات باز", money(receivableTotal)],
          ["بدهی‌های باز", money(payableTotal)],
          ["تعداد مطالبات", new Intl.NumberFormat("fa-IR").format(data.receivables.length)],
          ["تعداد بدهی‌ها", new Intl.NumberFormat("fa-IR").format(data.payables.length)],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]"
          >
            <div className="text-xs font-bold text-slate-500">{label}</div>
            <div className="mt-3 text-xl font-black text-[#102845]">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#0b8d85]">صف تسویه</div>
            <h2 className="mt-1 text-xl font-black text-[#102845]">مانده‌های باز قابل تخصیص</h2>
          </div>
          <Link href="/app/treasury" className="text-xs font-black text-[#0b8d85]">
            ورود به خزانه ←
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-sm font-black text-[#26354a]">مانده بازی برای تسویه وجود ندارد.</div>
            <p className="mt-2 text-xs leading-6 text-[#8190a3]">
              بعد از ثبت مالی فروش یا خرید، مانده مشتری یا تأمین‌کننده در این بخش ظاهر می‌شود.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-right text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {["طرف حساب", "نوع", "مانده", "سررسید", "اقدام"].map((head) => (
                    <th key={head} className="px-4 py-3 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-black text-[#26354a]">{row.counterpartyName}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-lg px-2.5 py-1.5 font-black ${row.type === "RECEIVABLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {row.type === "RECEIVABLE" ? "طلب" : "بدهی"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-black">{money(row.amount)}</td>
                    <td className="px-4 py-4">{new Intl.DateTimeFormat("fa-IR").format(row.dueAt)}</td>
                    <td className="px-4 py-4">
                      <Link href="/app/treasury" className="rounded-lg border border-slate-200 px-3 py-2 font-black">
                        تسویه
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <Link href="/app/suppliers" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="text-xs font-black text-[#0b8d85]">طرف حساب‌ها</div>
          <h3 className="mt-2 font-black">مانده تأمین‌کنندگان را بررسی کن</h3>
        </Link>
        <Link href="/app/reconciliation" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="text-xs font-black text-[#0b8d85]">پس از خزانه</div>
          <h3 className="mt-2 font-black">گردش بانکی را تطبیق بده</h3>
        </Link>
        <article className="rounded-2xl bg-[#102845] p-5 text-white">
          <div className="text-xs font-black text-[#63dfd4]">حالت امن</div>
          <h3 className="mt-2 font-black">انتقال بانکی واقعی بدون Provider مجاز اجرا نمی‌شود</h3>
        </article>
      </section>
    </WorkspaceShell>
  );
}
