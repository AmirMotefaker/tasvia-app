import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "دموی محصول",
  description: "دموی تعاملی تسوین برای مشاهده جریان نمونه درخواست و وضعیت تسویه.",
  alternates: { canonical: "/demo" },
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0f223d] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs font-black text-[#63dfd4]">Demo Mode</div>
        <h1 className="mt-3 text-4xl font-black">دموی تعاملی تسوین</h1>
        <p className="mt-5 text-base leading-8 text-white/70">این محیط برای نمایش تجربه محصول است. هیچ انتقال وجه واقعی، اتصال بانکی یا عملیات PSP انجام نمی‌شود.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/onboarding" className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-[#0f223d]">شروع از کسب‌وکار</Link>
          <Link href="/settlements" className="rounded-2xl border border-white/20 px-5 py-4 text-center text-sm font-black">مشاهده تسویه‌ها</Link>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-bold text-white/70">بازگشت به سایت رسمی</Link>
      </div>
    </main>
  );
}
