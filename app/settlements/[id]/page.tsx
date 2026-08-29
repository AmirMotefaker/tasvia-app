import Link from "next/link";

export default async function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isReview = id === "tsv-demo-review";

  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] px-3 py-4 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="text-[11px] font-extrabold text-[#008f87]">Demo Mode</div>
          <h1 className="mt-1 text-2xl font-black">{isReview ? "بررسی درخواست تسویه" : "جزئیات تسویه"}</h1>
          <p className="mt-2 text-sm text-[#657184]">شناسه: {id}</p>
        </div>

        <section className="space-y-4 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f7f9fc] p-4">
              <div className="text-[10px] text-[#7d8797]">ذی‌نفع</div>
              <div className="mt-2 text-sm font-black">تامین‌کننده سپهر</div>
            </div>
            <div className="rounded-2xl bg-[#f7f9fc] p-4">
              <div className="text-[10px] text-[#7d8797]">مبلغ</div>
              <div className="mt-2 text-sm font-black">۳۶٬۵۰۰٬۰۰۰ ریال</div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 p-4">
            <div className="text-xs font-black">Timeline وضعیت</div>
            <div className="mt-4 space-y-4">
              {["درخواست ایجاد شد", "اطلاعات بررسی شد", isReview ? "در انتظار تایید Demo" : "آماده تسویه"].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${index < 2 ? "bg-[#00a99d]" : "bg-[#d8dee7]"}`} />
                  <div>
                    <div className="text-sm font-extrabold">{item}</div>
                    <div className="mt-1 text-[10px] text-[#8a94a3]">رویداد نمایشی و غیر بانکی</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#f1d9a5] bg-[#fffaf0] p-4 text-[11px] leading-6 text-[#8a7343]">
            تایید در این صفحه صرفاً وضعیت Demo را تغییر می‌دهد و هیچ انتقال وجهی انجام نمی‌شود.
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/settlements" className="min-h-12 rounded-2xl border border-black/10 px-4 py-3 text-center text-xs font-extrabold">بازگشت</Link>
            {isReview ? (
              <Link href="/settlements/tsv-1048" className="min-h-12 rounded-2xl bg-[#0f223d] px-4 py-3 text-center text-xs font-extrabold text-white">تایید Demo</Link>
            ) : (
              <Link href="/" className="min-h-12 rounded-2xl bg-[#0f223d] px-4 py-3 text-center text-xs font-extrabold text-white">بازگشت به داشبورد</Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
