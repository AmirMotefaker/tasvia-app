import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ورود به تسویا",
  description: "ورود به محیط کاربری تسویا.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-md rounded-[32px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-xs font-black text-[#008f87]">Tasvia Workspace</div>
        <h1 className="mt-3 text-3xl font-black">ورود به محیط کاری</h1>
        <p className="mt-4 text-sm leading-7 text-[#657184]">
          این صفحه foundation تجربه ورود است. اتصال احراز هویت واقعی و session provider در مرحله بعدی و با secret مدیریت‌شده انجام می‌شود.
        </p>
        <div className="mt-6 rounded-2xl bg-[#fff8e5] p-4 text-xs leading-6 text-[#7a5b00]">
          هیچ credential یا secret در این نسخه داخل repository ذخیره نمی‌شود.
        </div>
        <Link href="/app" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#0f223d] px-5 py-3.5 text-sm font-black text-white">
          مشاهده Workspace Preview
        </Link>
      </div>
    </main>
  );
}
