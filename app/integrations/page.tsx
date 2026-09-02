import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "یکپارچه‌سازی‌ها",
  description: "وضعیت یکپارچه‌سازی‌های تسوین برای API، اعلان، فروشگاه، POS، مالیات و سرویس‌های رسمی.",
  alternates: { canonical: "/integrations" },
};

const integrations = [
  ["فروشگاه آنلاین", "FOUNDATION", "قرارداد WooCommerce، Shopify و Custom API برای همگام‌سازی سفارش و وضعیت."],
  ["اعلان‌ها", "FOUNDATION", "قرارداد SMS، Email، Telegram و In-App با idempotency و audit."],
  ["کارتخوان و POS", "BOUNDARY", "نگاشت ترمینال، Provider و حساب بانکی مقصد؛ اتصال واقعی نیازمند دسترسی رسمی است."],
  ["سامانه مودیان", "BOUNDARY", "مدل submission، idempotency و status tracking؛ ارسال واقعی پس از credential رسمی."],
  ["استعلام‌های رسمی", "BOUNDARY", "هویت، شبا، کارت و کدپستی با correlation/reference؛ Provider واقعی جدا فعال می‌شود."],
  ["Telegram", "FOUNDATION", "قرارداد Bot و workflow ایمن بدون اجازه انتقال پول مستقیم از ربات."],
  ["API و Webhook", "CONTRACT", "مرز Developer Platform با auth server-side، idempotency، signature و audit."],
  ["PSP / بانک", "PROTECTED", "فقط Integration boundary و Mock/Sandbox؛ هیچ اجرای پول واقعی در Preview فعال نیست."],
] as const;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <span className="rounded-full bg-[#e8f8f6] px-3 py-2 text-xs font-black text-[#007f78]">INTEGRATION STATUS</span>
          <h1 className="mt-5 text-4xl font-black">یکپارچه‌سازی‌های تسوین، با وضعیت واقعی هر اتصال</h1>
          <p className="mt-4 text-base leading-8 text-[#5f6c7e]">به‌جای نمایش یک فهرست مبهم «به‌زودی»، تسوین مشخص می‌کند چه چیزی در سطح Domain/Foundation آماده است و چه چیزی برای فعال‌شدن در Production به Provider، قرارداد یا Credential رسمی نیاز دارد.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map(([title,status,text]) => <article key={title} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="text-[10px] font-black text-[#008f87]">{status}</div><h2 className="mt-2 text-lg font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p></article>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/developers" className="rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">معماری API و Webhook</Link><Link href="/app/platform-controls" className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-black">کنترل‌های انطباق</Link></div>
      </div>
    </main>
  );
}
