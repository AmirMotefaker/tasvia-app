import Link from "next/link";
import { WorkspaceShell } from "../../../../src/components/workspace/shell";

const reports = [
  ["سود و زیان", "درآمد، هزینه و سود خالص دوره"],
  ["ترازنامه", "دارایی، بدهی و حقوق مالکانه"],
  ["جریان نقد", "ورودی و خروجی نقد"],
  ["تراز آزمایشی", "کنترل مانده حساب‌ها و توازن دفتر"],
  ["مطالبات", "Aging مشتریان و سررسید دریافت"],
  ["بدهی‌ها", "Aging تأمین‌کنندگان و سررسید پرداخت"],
];

export default function FinancialReportsPage() {
  return (
    <WorkspaceShell title="گزارش‌های مالی" eyebrow="تحلیل و Drill-down" actions={<Link href="/accounting/professional" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black">دفتر حرفه‌ای</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[['فروش دوره','از دفتر واقعی'],['سود خالص','در انتظار محاسبه'],['مانده نقد','از خزانه'],['سرمایه در گردش','در انتظار داده']].map(([a,b])=><article key={a} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="mt-3 text-xl font-black">{b}</div></article>)}
      </section>
      <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><div className="text-xs font-black text-[#0b8d85]">روند عملکرد</div><h2 className="mt-1 text-xl font-black">مقایسه دوره‌ای</h2></div><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">انتخاب دوره</button></div><div className="mt-6 flex h-56 items-end gap-3 rounded-2xl bg-slate-50 p-5">{[38,62,48,76,58,84,71,91].map((h,i)=><div key={i} className="flex-1 rounded-t-lg bg-[#63dfd4]" style={{height:`${h}%`}} />)}</div></article>
        <article className="rounded-3xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">دید مدیریتی</div><h2 className="mt-2 text-xl font-black">عدد بدون توضیح کافی نیست</h2><p className="mt-3 text-sm leading-7 text-white/65">هر KPI باید به حساب، سند و مدرک منبع قابل پیگیری باشد و هوش مالی فقط توضیح قابل استناد ارائه کند.</p><div className="mt-6 grid grid-cols-2 gap-3">{['سود','نقدینگی','طلب','بدهی'].map(x=><div key={x} className="rounded-2xl bg-white/8 p-4 text-sm font-black">{x}<div className="mt-2 text-xs font-medium text-white/45">در انتظار داده</div></div>)}</div></article>
      </section>
      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{reports.map(([title,desc])=><article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p><div className="mt-4 text-xs font-black text-[#0b8d85]">باز کردن گزارش ←</div></article>)}</section>
    </WorkspaceShell>
  );
}
