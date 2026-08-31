import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../../src/components/public/site-shell";

export const metadata: Metadata = {
  title: "راهکارهای تسوین | عملیات مالی برای مدل‌های مختلف کسب‌وکار",
  description: "راهکارهای اختصاصی تسوین برای کافه و رستوران، خرده‌فروشی، کسب‌وکار چندشعبه‌ای و تیم‌های مالی.",
  alternates: { canonical: "/solutions" },
};

const solutions = [
  ["کافه و رستوران", "/solutions/cafes-restaurants", "تسویه پرتکرار، تأمین‌کنندگان و شواهد مالی روزانه."],
  ["فروشگاه و خرده‌فروشی", "/solutions/retail", "تطبیق عملیات پرتعداد، گزارش و مغایرت."],
  ["کسب‌وکار چندشعبه‌ای", "/solutions/multi-branch", "تفکیک Workspace و دید مدیریتی تجمیعی."],
  ["تیم‌های مالی", "/solutions/finance-teams", "کنترل دسترسی، Audit، تطبیق و گزارش عملیاتی."],
] as const;

export default function SolutionsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          <div className="text-xs font-black text-[#008f87]">راهکارهای تسوین</div>
          <h1 className="mt-4 text-4xl font-black leading-[1.35] sm:text-5xl">یک هسته مالی مشترک، تجربه‌ای متناسب با مدل عملیاتی هر کسب‌وکار.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6c7e]">تسوین قابلیت‌های پایه را به سناریوهای واقعی کسب‌وکار متصل می‌کند؛ بدون اینکه برای هر صنعت یک محصول جدا و ناسازگار بسازد.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {solutions.map(([title, href, text]) => (
            <Link key={href} href={href} className="group rounded-[28px] border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-xl font-black">{title}</div>
              <p className="mt-3 text-sm leading-7 text-[#647184]">{text}</p>
              <div className="mt-5 text-xs font-black text-[#008f87]">مشاهده راهکار ←</div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
