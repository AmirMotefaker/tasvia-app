import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const primaryNav = [
  ["محصول", "/product"],
  ["تسویه", "/settlement-management"],
  ["تطبیق", "/reconciliation"],
  ["تأمین‌کنندگان", "/suppliers"],
  ["هوشمندی مالی", "/financial-intelligence"],
  ["راهکارها", "/solutions"],
] as const;

const productNav = [
  ["لینک دریافت وجه", "/payment-links"],
  ["ربات تلگرام", "/telegram-bot"],
  ["یکپارچه‌سازی‌ها", "/integrations"],
  ["توسعه‌دهندگان", "/developers"],
  ["امنیت", "/security"],
  ["تعرفه", "/pricing"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#0a1220]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f7fb]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="صفحه اصلی تسوین">
            <Image src="/brand/tasvin-avatar.svg" alt="لوگوی تسوین" width={42} height={42} priority className="rounded-2xl" />
            <div className="leading-tight">
              <div className="font-black">تسوین</div>
              <div className="mt-0.5 text-[10px] font-bold tracking-[0.08em] text-[#6d7787]">TASVIN</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-[13px] font-extrabold text-[#526073] xl:flex">
            {primaryNav.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[#008f87]">{label}</Link>)}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden min-h-11 items-center rounded-2xl border border-black/10 bg-white px-4 text-xs font-black sm:inline-flex">ورود</Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-2xl bg-[#0e223d] px-4 text-xs font-black text-white">شروع گفتگو</Link>
          </div>
        </div>

        <div className="border-t border-black/[0.035] xl:hidden">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-xs font-extrabold text-[#536174] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {[...primaryNav, ...productNav.slice(0, 2)].map(([label, href]) => (
              <Link key={href} href={href} className="shrink-0 rounded-full border border-black/5 bg-white px-3 py-2">{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-black/5 bg-[#0b1d34] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/brand/tasvin-avatar.svg" alt="تسوین" width={42} height={42} className="rounded-2xl" />
                <div><div className="font-black">تسوین</div><div className="text-[10px] font-bold text-white/50">Tasvin Financial Operations</div></div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/65">مرکز عملیات مالی برای تسویه، تطبیق، تأمین‌کنندگان، گزارش‌پذیری و هوشمندی مالی قابل توضیح.</p>
            </div>
            <div>
              <div className="text-xs font-black text-[#65ddd4]">محصول</div>
              <nav className="mt-4 grid gap-3 text-sm font-bold text-white/70">
                {productNav.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
              </nav>
            </div>
            <div>
              <div className="text-xs font-black text-[#65ddd4]">تسوین</div>
              <nav className="mt-4 grid gap-3 text-sm font-bold text-white/70">
                <Link href="/about">درباره ما</Link>
                <Link href="/resources">راهنما و منابع</Link>
                <Link href="/faq">پرسش‌های متداول</Link>
                <Link href="/contact">تماس</Link>
                <Link href="/compare/variza">مقایسه با واریزا</Link>
              </nav>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-white/45">تسوین هیچ ادعایی درباره تأیید بانکی، انتقال وجه یا تسویه قطعی بدون منبع معتبر بانکی/پرداختی نمی‌کند. قابلیت‌های Preview و Planned در صفحات مربوطه مشخص می‌شوند.</div>
        </div>
      </footer>
    </main>
  );
}

export function FeatureStatus({ status }: { status: "Available" | "Preview" | "Planned" }) {
  const labels = { Available: "فعال", Preview: "پیش‌نمایش", Planned: "در برنامه" } as const;
  return <span className="inline-flex rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-black text-[#667284]">{labels[status]}</span>;
}
