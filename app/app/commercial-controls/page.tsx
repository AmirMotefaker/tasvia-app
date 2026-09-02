import Link from "next/link";

const capabilities = [
  ["چندارزی", "ثبت مبلغ با ارز منبع، نرخ صریح و اثر تسعیر بدون محاسبات اعشاری شناور."],
  ["فروش اقساطی", "تقسیم دقیق مبلغ به اقساط، سررسید، مانده و پیگیری پرداخت هر قسط."],
  ["سطوح قیمت", "قیمت عمده، همکار، ویژه و سیاست‌های اختصاصی مشتری روی یک قیمت پایه."],
  ["تخفیف هوشمند", "قواعد درصدی و مبلغ ثابت با حداقل خرید، بازه زمانی و سقف امن."],
  ["پورسانت فروش", "محاسبه پورسانت بازاریاب بر مبنای فروش ناخالص یا خالص پس از تخفیف."],
  ["بارکد", "شناسه امن کالا برای چاپ، اسکن و اتصال به عملیات انبار و فروش."],
  ["بانک و چک", "خزانه، دریافت و پرداخت، سررسید چک و مغایرت‌گیری روی دفتر واقعی."],
] as const;

export default function CommercialControlsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[32px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">کنترل‌های تجاری تسوین</div>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">فروش حرفه‌ای بدون جداشدن از حسابداری واقعی.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/70">قیمت، تخفیف، ارز، قسط، پورسانت، بارکد و خزانه باید روی همان سند و مانده‌ای کار کنند که گزارش‌های حرفه‌ای تسوین از آن ساخته می‌شوند؛ نه یک لایه نمایشی جدا.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(([title, description]) => (
            <article key={title} className="rounded-[26px] border border-black/5 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-black">{title}</h2>
                <span className="rounded-full bg-[#e8faf7] px-3 py-1 text-[10px] font-black text-[#007f78]">هسته فعال</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[26px] bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">دقت مالی</div>
            <h2 className="mt-2 text-xl font-black">مبلغ‌ها با عدد صحیح نگهداری می‌شوند.</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">قیمت، تخفیف، پورسانت و اقساط از محاسبات floating-point برای پول استفاده نمی‌کنند تا اختلاف ریالی ایجاد نشود.</p>
          </article>
          <article className="rounded-[26px] bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">کنترل انسانی</div>
            <h2 className="mt-2 text-xl font-black">اتوماسیون پیشنهاد می‌دهد؛ تصمیم حساس تأیید می‌خواهد.</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">هیچ انتقال بانکی، وصول چک یا اقدام مالی برگشت‌ناپذیر فقط با یک پیشنهاد هوشمند اجرا نمی‌شود.</p>
          </article>
          <article className="rounded-[26px] bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">مسیر بعدی</div>
            <h2 className="mt-2 text-xl font-black">اتصال این کنترل‌ها به فرم‌های فروش و انبار.</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">در Batch بعدی Persistence و UI عملیاتی هر قابلیت به‌صورت جداگانه به Workspace متصل می‌شود.</p>
          </article>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/sales" className="rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">فروش و فاکتور</Link>
          <Link href="/app/treasury" className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black">بانک و خزانه</Link>
          <Link href="/app/inventory" className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black">کالا و انبار</Link>
        </div>
      </section>
    </main>
  );
}
