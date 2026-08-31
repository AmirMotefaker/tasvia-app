import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "مدیریت تسویه",
  description: "مدیریت چرخه درخواست، بررسی، شواهد و وضعیت تسویه در تسوین.",
  alternates: { canonical: "/settlement-management" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full bg-[#dff7f4] px-3 py-2 text-xs font-black text-[#007d75]">PREVIEW</span>
        <h1 className="mt-5 text-4xl font-black leading-[1.4]">مدیریت تسویه، از درخواست تا تاریخچه قابل پیگیری</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6c7e]">هسته تجربه تسوین برای ثبت درخواست، ذی‌نفع، مبلغ، شواهد و وضعیت طراحی شده است. نسخه فعلی یک جریان نمایشی است و انتقال وجه واقعی انجام نمی‌دهد.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["درخواست ساختاریافته","بررسی و شواهد","تاریخچه وضعیت"].map((x)=><div key={x} className="rounded-3xl bg-white p-6 font-black">{x}</div>)}
        </div>
        <Link href="/demo" className="mt-8 inline-flex rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">مشاهده دمو</Link>
      </div>
    </main>
  );
}
