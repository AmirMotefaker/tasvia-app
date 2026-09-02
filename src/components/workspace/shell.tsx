import Link from "next/link";
import type { ReactNode } from "react";

const items = [
  ["/app", "داشبورد", "▦"],
  ["/app/sales", "فروش", "◫"],
  ["/app/purchases", "خرید", "▣"],
  ["/app/treasury", "خزانه", "◉"],
  ["/app/inventory", "انبار", "◇"],
  ["/app/suppliers", "تأمین‌کنندگان", "♙"],
  ["/app/settlements", "تسویه‌ها", "⇄"],
  ["/app/reconciliation", "مغایرت‌گیری", "◎"],
  ["/app/reports/financial", "گزارش‌ها", "▥"],
  ["/accounting/professional", "حسابداری", "≡"],
  ["/app/commercial-controls", "کنترل‌های تجاری", "⌁"],
  ["/app/operations-controls", "عملیات", "⚙"],
  ["/app/platform-controls", "تنظیمات و اتصال", "⚑"],
] as const;

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
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#101827]" dir="rtl">
      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,1fr)_248px]">
        <section className="min-w-0 lg:col-start-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                {eyebrow ? <p className="text-[11px] font-black text-[#0b8d85]">{eyebrow}</p> : null}
                <h1 className="truncate text-xl font-black tracking-tight text-[#101827] sm:text-2xl">{title}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>
            <nav aria-label="ناوبری موبایل" className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
              {items.slice(0, 9).map(([href, label]) => (
                <Link key={href} href={href} className="whitespace-nowrap rounded-xl bg-[#f3f6fa] px-3 py-2 text-xs font-black text-[#435066]">
                  {label}
                </Link>
              ))}
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
              {items.map(([href, label, icon]) => (
                <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/72 transition hover:bg-white/10 hover:text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/7 text-xs text-[#63dfd4] group-hover:bg-white/12">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-black text-[#63dfd4]">حالت امن</div>
              <p className="mt-2 text-[11px] leading-5 text-white/55">اتصال‌های بانکی، پرداخت و مالیاتی فقط پس از تأیید رسمی محیط عملیاتی فعال می‌شوند.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
