import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت تامین‌کنندگان",
  description: "چشم‌انداز مدیریت ذی‌نفعان و تامین‌کنندگان در تسوین.",
  alternates: { canonical: "/suppliers" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <span className="rounded-full bg-[#fff4d8] px-3 py-2 text-xs font-black text-[#8a6500]">PLANNED</span>
        <h1 className="mt-5 text-4xl font-black">مدیریت تامین‌کنندگان و ذی‌نفعان</h1>
        <p className="mt-5 text-base leading-8 text-[#5f6c7e]">این بخش در Roadmap تسوین برای ایجاد پرونده مالی هر ذی‌نفع، تاریخچه تسویه، اطلاعات مرجع و کنترل‌های عملیاتی برنامه‌ریزی شده است.</p>
      </div>
    </main>
  );
}
