import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "راهکارها",
  description: "کاربردهای تسوین برای کافه، رستوران، خرده‌فروشی و کسب‌وکارهای چندشعبه‌ای.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  const items = [
    ["کافه و رستوران", "مدیریت درخواست‌های پرداخت تامین‌کنندگان و پیگیری وضعیت بدون اتکا به پیام‌های پراکنده."],
    ["خرده‌فروشی", "شفاف‌سازی چرخه درخواست‌ها، مبالغ و ذی‌نفعان در عملیات روزمره."],
    ["کسب‌وکار چندشعبه‌ای", "دید متمرکز روی تسویه‌های شعب و امکان پیگیری تاریخچه هر مورد."],
    ["تیم مالی و عملیاتی", "یک زبان مشترک برای وضعیت، شواهد و مسئولیت هر مرحله."],
  ];
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">راهکارهای تسوین</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#5f6c7e]">تسوین برای کسب‌وکارهایی طراحی شده که تعداد درخواست‌های مالی و پیگیری‌هایشان از روش‌های دستی فراتر رفته است.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map(([title, text]) => (
            <section key={title} className="rounded-[24px] border border-black/5 bg-white p-5">
              <h2 className="text-lg font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
