import type { Metadata } from "next";
import Link from "next/link";
import { FeatureStatus, SiteShell } from "../../src/components/public/site-shell";

export const metadata: Metadata = {
  title: "ربات تلگرام تسوین | اعلان و پیگیری عملیات مالی",
  description: "ربات تلگرام تسوین برای اعلان‌های مالی، پیگیری وضعیت تسویه و تطبیق، خلاصه‌های دوره‌ای و لینک امن بازگشت به پنل تسوین.",
};

const capabilities = [
  ["اعلان رویدادها", "اعلان تسویه، تطبیق، مغایرت و تغییر وضعیت با متن فارسی روشن.", "Planned"],
  ["پیگیری وضعیت", "جست‌وجوی وضعیت تسویه یا تأمین‌کننده بدون نمایش داده بیشتر از سطح مجاز کاربر.", "Planned"],
  ["خلاصه روزانه", "خلاصه قابل تنظیم از رویدادهای مهم Workspace و موارد نیازمند توجه.", "Planned"],
  ["لینک امن به تسوین", "برای عملیات حساس، ربات کاربر را با deep link امن به محیط احرازشده تسوین برمی‌گرداند.", "Planned"],
] as const;

export default function TelegramBotPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <FeatureStatus status="Planned" />
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.35] sm:text-5xl">ربات تلگرام تسوین؛ اطلاع‌رسانی سریع بدون تبدیل تلگرام به بانک.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5e6b7d]">ربات تلگرام تسوین برای اطلاع‌رسانی، پیگیری و خلاصه‌سازی طراحی می‌شود. اجرای انتقال وجه یا عملیات حساس مالی به‌صورت خودکار در تلگرام جزو این معماری نیست.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="rounded-2xl bg-[#0e223d] px-6 py-3.5 text-center text-sm font-black text-white">درخواست دسترسی آزمایشی</Link>
              <Link href="/security" className="rounded-2xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-black">مدل امنیتی</Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/5 bg-[#102541] p-5 text-white shadow-[0_30px_90px_rgba(16,37,65,.18)] sm:p-7">
            <div className="text-xs font-black text-[#66ddd4]">نمونه تجربه</div>
            <div className="mt-4 space-y-3">
              <div className="ml-7 rounded-3xl rounded-bl-lg bg-white/10 p-4 text-sm leading-7">یک مغایرت جدید در Workspace «شعبه مرکزی» ثبت شد. مبلغ و شواهد نیازمند بررسی هستند.</div>
              <div className="mr-7 rounded-3xl rounded-br-lg bg-[#65ddd4] p-4 text-sm font-bold leading-7 text-[#0b1d34]">وضعیت تسویه امروز را نشان بده</div>
              <div className="ml-7 rounded-3xl rounded-bl-lg bg-white/10 p-4 text-sm leading-7">۳ مورد تکمیل‌شده، ۲ مورد در بررسی و ۱ مورد نیازمند اقدام. برای جزئیات وارد تسوین شوید.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map(([title, text, status]) => (
              <article key={title} className="rounded-3xl border border-black/5 bg-[#f7f9fc] p-5">
                <FeatureStatus status={status} />
                <h2 className="mt-4 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#647184]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black">اصول امنیتی ربات</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["اتصال حساب با تأیید صریح و امکان لغو دسترسی", "کنترل مجوزها در سرور؛ نه اعتماد به شناسه ارسال‌شده از کلاینت", "عدم نمایش یا ثبت Secret و داده مالی حساس در لاگ‌های ربات"].map((item) => <div key={item} className="rounded-3xl border border-black/5 bg-white p-5 text-sm font-bold leading-7">{item}</div>)}
        </div>
      </section>
    </SiteShell>
  );
}
