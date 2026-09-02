import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceShell } from "../../src/components/workspace/shell";

export const metadata: Metadata = {
  title: "داشبورد مالی تسوین",
  description: "مرکز فرمان مالی تسوین برای فروش، خرید، نقدینگی، مطالبات، بدهی‌ها، موجودی و گزارش‌ها.",
  robots: { index: false, follow: false },
};

const metrics = [
  ["فروش دوره", "در انتظار داده", "از فاکتورهای قطعی"],
  ["دریافتنی", "در انتظار داده", "مطالبات باز مشتریان"],
  ["پرداختنی", "در انتظار داده", "بدهی باز تأمین‌کنندگان"],
  ["موجودی نقد", "در انتظار داده", "بانک، صندوق و تنخواه"],
];

const quickActions = [
  ["فاکتور فروش", "/app/sales"],
  ["ثبت خرید", "/app/purchases"],
  ["دریافت وجه", "/accounting/simple/receipt"],
  ["پرداخت وجه", "/accounting/simple/payment"],
];

export default function WorkspacePage() {
  return (
    <WorkspaceShell
      eyebrow="مرکز فرمان مالی"
      title="داشبورد"
      actions={<Link href="/accounting/simple" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">ثبت سریع +</Link>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([title, value, note]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-[#64748b]">{title}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#63dfd4]" />
            </div>
            <div className="mt-4 text-xl font-black text-[#102845]">{value}</div>
            <div className="mt-2 text-[11px] font-bold text-[#8290a4]">{note}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-[#0b8d85]">روند مالی</div>
              <h2 className="mt-1 text-lg font-black text-[#102845]">فروش و جریان نقد</h2>
            </div>
            <span className="rounded-xl bg-[#f3f6fa] px-3 py-2 text-[11px] font-black text-[#607086]">۳۰ روز اخیر</span>
          </div>
          <div className="mt-6 h-64 rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(to_bottom,#ffffff,#f8fbfd)] p-5">
            <div className="flex h-full items-end gap-3" aria-label="نمودار پس از اتصال داده‌های فضای کاری نمایش داده می‌شود">
              {[35, 55, 42, 67, 50, 78, 61, 83, 69, 88, 72, 91].map((height, index) => (
                <div key={index} className="flex flex-1 items-end justify-center">
                  <div className="w-full max-w-8 rounded-t-lg bg-[#d8f3f0]" style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-6 text-[#7a8798]">ارتفاع ستون‌ها صرفاً حالت رابط کاربری است؛ ارقام واقعی فقط از دفتر فضای کاری نمایش داده می‌شوند.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="text-xs font-black text-[#0b8d85]">اقدام سریع</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">کارهای پرتکرار</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map(([label, href]) => (
              <Link key={href} href={href} className="flex min-h-24 flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 transition hover:border-[#63dfd4] hover:bg-[#f0fbfa]">
                <span className="text-sm font-black text-[#102845]">{label}</span>
                <span className="text-xs font-black text-[#0b8d85]">شروع ←</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div><div className="text-xs font-black text-[#0b8d85]">آخرین عملیات</div><h2 className="mt-1 font-black text-[#102845]">رویدادهای مالی فضای کاری</h2></div>
            <Link href="/app/reports/financial" className="text-xs font-black text-[#0b8d85]">مشاهده گزارش‌ها</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-xs">
              <thead className="bg-[#f8fafc] text-[#6c798c]"><tr><th className="px-5 py-3">نوع</th><th className="px-5 py-3">مرجع</th><th className="px-5 py-3">وضعیت</th><th className="px-5 py-3">تاریخ</th></tr></thead>
              <tbody>
                {["فاکتور فروش", "دریافت وجه", "ثبت خرید", "پرداخت تأمین‌کننده"].map((item) => (
                  <tr key={item} className="border-t border-slate-100"><td className="px-5 py-4 font-black text-[#26354a]">{item}</td><td className="px-5 py-4 text-[#8190a3]">پس از اتصال داده</td><td className="px-5 py-4"><span className="rounded-lg bg-[#eef8f7] px-2 py-1 font-black text-[#0b8d85]">آماده نمایش</span></td><td className="px-5 py-4 text-[#8190a3]">—</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="text-xs font-black text-[#0b8d85]">کنترل مالی</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">وضعیت‌های نیازمند توجه</h2>
          <div className="mt-5 space-y-3">
            {[
              ["مطالبات سررسیدشده", "از دفتر دریافتنی‌ها"],
              ["بدهی‌های نزدیک سررسید", "از دفتر پرداختنی‌ها"],
              ["مغایرت خزانه", "از جریان reconciliation"],
              ["کمبود موجودی", "از دفتر انبار"],
            ].map(([title, note]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div><div className="text-sm font-black text-[#26354a]">{title}</div><div className="mt-1 text-[11px] text-[#8190a3]">{note}</div></div>
                <span className="rounded-lg bg-[#f5f7fa] px-2.5 py-1.5 text-[10px] font-black text-[#6f7d90]">بدون داده</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
