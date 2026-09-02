import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "دموی محصول",
  description: "تور تعاملی تسوین برای مشاهده محیط کاری، فروش، خرید، خزانه، انبار، گزارش و کنترل‌های محصول.",
  alternates: { canonical: "/demo" },
  robots: { index: false, follow: false },
};

const tour = [
  ["مرکز فرمان", "/app", "نمای کلی ماژول‌ها و ثبت سریع."],
  ["فروش", "/app/sales", "فاکتور، دریافت، طلب و برگشت."],
  ["خرید", "/app/purchases", "تأمین‌کننده، بدهی و پرداخت."],
  ["خزانه", "/app/treasury", "بانک، صندوق، چک و انتقال."],
  ["انبار", "/app/inventory", "موجودی، انتقال و بهای تمام‌شده."],
  ["کنترل‌های تجاری", "/app/commercial-controls", "چندارزی، اقساط، قیمت، تخفیف و بارکد."],
  ["کنترل‌های عملیاتی", "/app/operations-controls", "آرشیو، اعلان، فرم‌ساز، سال مالی، تولید و فروشگاه."],
  ["انطباق و اتصال", "/app/platform-controls", "مودیان، استعلام، POS، Approval و Backup."],
  ["گزارش مالی", "/app/reports/financial", "سود و زیان، ترازنامه و جریان نقد."],
] as const;

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0f223d] px-4 py-12 text-white sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <div className="text-xs font-black text-[#63dfd4]">حالت نمایش محصول</div>
          <h1 className="mt-3 text-4xl font-black">به‌جای یک صفحه دمو، مستقیم وارد بخش‌های واقعی تسوین شو.</h1>
          <p className="mt-5 text-base leading-8 text-white/70">این Preview برای بررسی تجربه محصول است. مسیرها و UI واقعی‌اند، اما هیچ انتقال وجه واقعی، اتصال بانکی Production، ارسال واقعی سامانه مودیان یا عملیات PSP انجام نمی‌شود.</p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tour.map(([title,href,text]) => <Link key={href} href={href} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"><div className="font-black text-[#63dfd4]">{title}</div><p className="mt-3 text-sm leading-7 text-white/65">{text}</p><div className="mt-4 text-xs font-black">باز کردن ←</div></Link>)}
        </section>

        <div className="mt-8 flex flex-wrap gap-3"><Link href="/onboarding" className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-[#0f223d]">شروع جریان کسب‌وکار</Link><Link href="/product" className="rounded-2xl border border-white/20 px-5 py-4 text-sm font-black">مرور کامل محصول</Link><Link href="/" className="px-3 py-4 text-sm font-bold text-white/70">بازگشت به سایت رسمی</Link></div>
      </div>
    </main>
  );
}
