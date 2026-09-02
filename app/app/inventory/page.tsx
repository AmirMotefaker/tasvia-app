import Link from "next/link";

const capabilities = [
  ["کالا و خدمات", "کد، واحد، بارکد، مالیات و حداقل موجودی"],
  ["انبارها", "انبار مرکزی، شعب و کنترل فضای کاری"],
  ["کارت انبار", "ورود، خروج و مانده زمانی هر کالا"],
  ["انتقال انبار", "انتقال دوطرفه و قابل حسابرسی بین انبارها"],
  ["ارزش موجودی", "میانگین موزون و ارزش ریالی موجودی"],
  ["بهای تمام‌شده", "اتصال فروش کالای انباری به سند COGS"],
];

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-4 border-b border-black/5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">عملیات کالا</div>
            <h1 className="mt-2 text-3xl font-black">کالا و انبار</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#657184]">موجودی، گردش و بهای تمام‌شده از رویدادهای واقعی انبار ساخته می‌شوند؛ بدون عدد نمایشی.</p>
          </div>
          <Link href="/app" className="text-sm font-black text-[#007d75]">بازگشت به میزکار</Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([title, description]) => (
            <article key={title} className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_14px_45px_rgba(15,34,61,.05)]">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#657184]">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-7 rounded-[28px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">کنترل موجودی</div>
          <h2 className="mt-3 text-2xl font-black">خروج کالا بدون موجودی کافی متوقف می‌شود.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">خرید ورود موجودی، فروش خروج موجودی، انتقال یک خروج و یک ورود متناظر و فروش کالا سند بهای تمام‌شده ایجاد می‌کند. داده واقعی پس از اتصال Persistence از دفتر موجودی فضای کاری خوانده می‌شود.</p>
        </section>
      </section>
    </main>
  );
}
