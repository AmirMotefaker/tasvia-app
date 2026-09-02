import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "توسعه‌دهندگان و API",
  description: "قراردادهای توسعه‌دهندگان تسوین برای API، Webhook، idempotency و یکپارچه‌سازی‌های امن.",
  alternates: { canonical: "/developers" },
};

const principles = [
  ["Server-side auth", "دسترسی‌های توسعه‌دهنده باید به Workspace و نقش معتبر متصل باشند."],
  ["Idempotency", "درخواست‌های مالی تکراری با کلید یکتا نباید عملیات مالی را دوباره ایجاد کنند."],
  ["Signed webhooks", "تحویل رویداد باید امضا، delivery ID و سیاست retry قابل حسابرسی داشته باشد."],
  ["Auditability", "هر عملیات حساس باید actor، زمان، منبع و نتیجه قابل پیگیری داشته باشد."],
] as const;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-12 text-white sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black text-[#63dfd4]">DEVELOPER CONTRACTS</span>
        <h1 className="mt-5 max-w-4xl text-4xl font-black">معماری توسعه‌دهندگان تسوین از الان قرارداد مشخص دارد؛ انتشار API عمومی مرحله جداست.</h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-white/65">Domain و Integration boundaryهای لازم برای فروشگاه، اعلان، POS، سامانه مودیان، استعلام و عملیات مالی تعریف شده‌اند. API عمومی Production فقط پس از تکمیل authentication، rate limit، credential management و sandbox رسمی منتشر می‌شود.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {principles.map(([title,text]) => <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5"><h2 className="font-black text-[#63dfd4]">{title}</h2><p className="mt-3 text-sm leading-7 text-white/60">{text}</p></article>)}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <pre className="overflow-x-auto rounded-3xl border border-white/10 bg-black/20 p-5 text-left text-xs leading-7" dir="ltr">{`POST /v1/settlements
Authorization: Bearer <server-token>
Idempotency-Key: <unique-key>

202 Accepted
{
  "id": "stl_...",
  "status": "REVIEW_REQUIRED"
}`}</pre>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><div className="text-xs font-black text-[#63dfd4]">Production boundary</div><h2 className="mt-2 text-xl font-black">هیچ endpoint نمونه‌ای در این صفحه به معنی انتقال پول واقعی نیست.</h2><p className="mt-4 text-sm leading-7 text-white/60">PSP، بانک، مالیات و استعلام فقط پس از credential رسمی و Gate عملیاتی فعال می‌شوند. این تفکیک مانع تبدیل مستندات توسعه‌دهنده به ادعای قابلیت Production نشده می‌شود.</p></div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3"><Link href="/integrations" className="rounded-2xl bg-[#63dfd4] px-5 py-3 text-sm font-black text-[#0b1220]">وضعیت یکپارچه‌سازی‌ها</Link><Link href="/security" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-black">مدل امنیت</Link></div>
      </div>
    </main>
  );
}
