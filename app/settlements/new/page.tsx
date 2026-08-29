import Link from "next/link";

export default function NewSettlementPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] px-3 py-4 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="text-[11px] font-extrabold text-[#008f87]">Demo Mode · مرحله ۱ از ۳</div>
          <h1 className="mt-1 text-2xl font-black">درخواست تسویه جدید</h1>
          <p className="mt-2 text-sm leading-7 text-[#657184]">اطلاعات این فرم فقط برای شبیه‌سازی تجربه محصول استفاده می‌شود.</p>
        </div>

        <form className="space-y-4 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold">کسب‌وکار</span>
            <select className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#00a99d]">
              <option>کافه نمونه تسویا</option><option>شعبه دوم نمونه</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold">تامین‌کننده / ذی‌نفع</span>
            <select className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#00a99d]">
              <option>تامین‌کننده سپهر</option><option>پخش آریا</option><option>بازرگانی روشا</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold">مبلغ تسویه</span>
            <input inputMode="numeric" defaultValue="36500000" className="min-h-12 w-full rounded-2xl border border-black/10 px-3 text-sm outline-none focus:border-[#00a99d]" />
            <span className="mt-2 block text-[10px] text-[#7d8797]">مبلغ نمونه بر حسب ریال</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold">توضیح</span>
            <textarea defaultValue="تسویه فاکتور تامین مواد اولیه" className="min-h-28 w-full rounded-2xl border border-black/10 p-3 text-sm outline-none focus:border-[#00a99d]" />
          </label>

          <div className="rounded-2xl border border-[#f1d9a5] bg-[#fffaf0] p-4 text-[11px] leading-6 text-[#8a7343]">
            این فرم هیچ عملیات بانکی واقعی ایجاد نمی‌کند.
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/settlements" className="min-h-12 rounded-2xl border border-black/10 px-4 py-3 text-center text-xs font-extrabold">انصراف</Link>
            <Link href="/settlements/tsv-demo-review" className="min-h-12 rounded-2xl bg-[#0f223d] px-4 py-3 text-center text-xs font-extrabold text-white">بررسی درخواست</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
