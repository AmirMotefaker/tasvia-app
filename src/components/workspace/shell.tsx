"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const items = [
  ["/app", "داشبورد", "▦"],
  ["/app/sales", "فروش", "◫"],
  ["/app/purchases", "خرید", "▣"],
  ["/app/treasury", "خزانه", "◉"],
  ["/app/inventory", "انبار", "◇"],
  ["/app/suppliers", "تأمین‌کنندگان", "♙"],
  ["/app/settlements", "تسویه‌ها", "⇄"],
  ["/app/cheques", "چک‌ها", "▤"],
  ["/app/reconciliation", "مغایرت‌گیری", "◎"],
  ["/app/reports/financial", "گزارش‌ها", "▥"],
  ["/app/fiscal-close", "دوره مالی", "◷"],
  ["/accounting/professional", "حسابداری", "≡"],
  ["/app/commercial-controls", "کنترل‌های تجاری", "⌁"],
  ["/app/operations-controls", "عملیات", "⚙"],
  ["/app/platform-controls", "تنظیمات", "⚑"],
] as const;

const mobilePrimary = [
  ["/app", "داشبورد", "▦"],
  ["/app/sales", "فروش", "◫"],
  ["/app/purchases", "خرید", "▣"],
  ["/app/treasury", "خزانه", "◉"],
  ["/app/reports/financial", "گزارش", "▥"],
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({
  children,
  title,
  eyebrow,
  actions,
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f4f7fb] pb-20 text-[#101827] lg:pb-0" dir="rtl">
      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,1fr)_264px]">
        <section className="min-w-0 lg:col-start-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                {eyebrow ? <p className="text-[11px] font-black text-[#0b8d85]">{eyebrow}</p> : null}
                <h1 className="truncate text-xl font-black tracking-tight text-[#101827] sm:text-2xl">{title}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>

            <nav aria-label="دسترسی سریع موبایل" className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
              {items.slice(5, 12).map(([href, label, icon]) => {
                const active = isActive(pathname, href);
                return (
                  <Link key={href} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-black transition ${active ? "bg-[#102845] text-white" : "bg-[#f3f6fa] text-[#435066]"}`}>
                    <span className="ml-1">{icon}</span>{label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</div>
        </section>

        <aside className="hidden border-l border-[#183552] bg-[#102845] text-white lg:col-start-2 lg:row-start-1 lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-4">
            <Link href="/app" className="mb-5 flex items-center justify-between rounded-2xl px-3 py-3">
              <div>
                <div className="text-xl font-black">تسوین</div>
                <div className="mt-1 text-[10px] font-bold text-white/45">مرکز عملیات مالی</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#63dfd4] font-black text-[#102845]">ت</div>
            </Link>

            <nav aria-label="ناوبری اصلی محیط کاری" className="space-y-1 overflow-y-auto pr-1">
              {items.map(([href, label, icon]) => {
                const active = isActive(pathname, href);
                return (
                  <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-white/12 text-white" : "text-white/72 hover:bg-white/10 hover:text-white"}`}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${active ? "bg-[#63dfd4] text-[#102845]" : "bg-white/7 text-[#63dfd4]"}`}>{icon}</span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-black text-[#63dfd4]">حالت امن مالی</div>
              <p className="mt-2 text-[11px] leading-5 text-white/55">ثبت‌های مالی محیط عملیاتی، اتصال بانکی و سرویس‌های مالیاتی فقط پس از مجوز مستقل فعال می‌شوند.</p>
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="ناوبری اصلی موبایل" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_30px_rgba(15,34,61,.08)] backdrop-blur lg:hidden">
        {mobilePrimary.map(([href, label, icon]) => {
          const active = isActive(pathname, href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center rounded-xl text-[10px] font-black transition ${active ? "bg-[#eef8f7] text-[#0b8d85]" : "text-[#718096]"}`}>
              <span className="mb-1 text-base">{icon}</span>{label}
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
