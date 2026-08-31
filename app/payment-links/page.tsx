import type { Metadata } from "next";
import Link from "next/link";
import { FeatureStatus, SiteShell } from "../../src/components/public/site-shell";

export const metadata: Metadata = {
  title: "لینک دریافت وجه تسوین | دریافت، شواهد و تطبیق",
  description: "معماری لینک دریافت وجه تسوین برای ایجاد تجربه قابل پیگیری از درخواست پرداخت تا شواهد، تطبیق و عملیات تسویه.",
};

const flow = [
  ["۱", "ساخت لینک", "مبلغ، توضیح، مرجع داخلی و وضعیت مصرف‌پذیری لینک تعریف می‌شود."],
  ["۲", "دریافت شواهد", "اطلاعات مرتبط با پرداخت و مدرک قابل نگهداری به جریان عملیاتی متصل می‌شود."],
  ["۳", "تطبیق", "پرداخت، مرجع کسب‌وکار و وضعیت بررسی در یک مسیر قابل حسابرسی کنار هم قرار می‌گیرند."],
  ["۴", "عملیات بعدی", "گزارش، اعلان و در صورت نیاز فرآیند تسویه یا پیگیری تأمین‌کننده ادامه پیدا می‌کند."],
] as const;

export default function PaymentLinksPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <FeatureStatus status="Planned" />
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.35] sm:text-5xl">لینک دریافت وجه، وقتی ارزشمند است که بعد از پرداخت هم مسیر روشن بماند.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f6c7e]">تسوین لینک دریافت وجه را به‌عنوان ورودی یک جریان عملیاتی می‌بیند؛ نه پایان آن. هدف این است که پرداخت، شواهد، تطبیق، گزارش و تسویه در یک مدل قابل پیگیری قرار بگیرند.</p>
          </div>
          <div className="rounded-[30px] bg-[#0e223d] p-6 text-white">
            <div className="text-xs font-black text-[#65ddd4]">مرز محصول</div>
            <p className="mt-3 text-sm leading-7 text-white/70">تا زمانی که اتصال معتبر بانکی/PSP وجود نداشته باشد، تسوین «تأیید قطعی بانکی» را صرفاً از روی ادعای کاربر نتیجه‌گیری نمی‌کند.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {flow.map(([n, title, text]) => <article key={n} className="rounded-3xl border border-black/5 bg-[#f7f9fc] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0e223d] text-xs font-black text-white">{n}</div><h2 className="mt-4 text-lg font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black">قابلیت‌های برنامه‌ریزی‌شده</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {["لینک یک‌بارمصرف و چندبارمصرف", "QR برای مسیر دریافت", "مرجع و توضیح اختصاصی کسب‌وکار", "اعلان و رویداد قابل اتصال به Webhook", "گزارش و خروجی عملیاتی", "اتصال مستقیم به تطبیق و عملیات تسویه"].map((item) => <div key={item} className="rounded-3xl border border-black/5 bg-white p-5"><FeatureStatus status="Planned"/><div className="mt-3 text-sm font-black leading-7">{item}</div></div>)}
        </div>
        <div className="mt-8"><Link href="/contact" className="inline-flex rounded-2xl bg-[#0e223d] px-6 py-3.5 text-sm font-black text-white">برای پایلوت گفتگو کنیم</Link></div>
      </section>
    </SiteShell>
  );
}
