import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تطبیق و مغایرت‌گیری",
  description: "چشم‌انداز تطبیق شواهد و عملیات مالی در تسوین.",
  alternates: { canonical: "/reconciliation" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <span className="rounded-full bg-[#fff4d8] px-3 py-2 text-xs font-black text-[#8a6500]">PLANNED</span>
        <h1 className="mt-5 text-4xl font-black">تطبیق و مغایرت‌گیری مالی</h1>
        <p className="mt-5 text-base leading-8 text-[#5f6c7e]">هدف این قابلیت، پیوند دادن شواهد معتبر با رویدادهای مالی و آشکار کردن مغایرت‌هاست. هیچ تأیید بانکی خودکاری در نسخه عمومی فعلی فعال نیست.</p>
      </div>
    </main>
  );
}
