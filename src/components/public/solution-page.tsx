import Link from "next/link";
import { FeatureStatus, SiteShell } from "./site-shell";

type SolutionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  challenges: string[];
  capabilities: Array<{ title: string; text: string; status: "Available" | "Preview" | "Planned" }>;
};

export function SolutionPage({ eyebrow, title, description, challenges, capabilities }: SolutionPageProps) {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          <div className="inline-flex rounded-full border border-[#00a99d]/20 bg-[#eafaf8] px-3 py-2 text-xs font-black text-[#007d75]">{eyebrow}</div>
          <h1 className="mt-5 text-4xl font-black leading-[1.35] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6c7e]">{description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/contact" className="rounded-2xl bg-[#0e223d] px-6 py-3.5 text-center text-sm font-black text-white">گفتگو برای پایلوت</Link><Link href="/product" className="rounded-2xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-black">مشاهده محصول</Link></div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-xs font-black text-[#008f87]">مسئله‌های عملیاتی</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{challenges.map((item) => <div key={item} className="rounded-3xl border border-black/5 bg-[#f7f9fc] p-5 text-sm font-bold leading-7">{item}</div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black">تسوین چه چیزی اضافه می‌کند؟</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{capabilities.map((item) => <article key={item.title} className="rounded-3xl border border-black/5 bg-white p-5"><FeatureStatus status={item.status}/><h3 className="mt-4 text-lg font-black">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#647184]">{item.text}</p></article>)}</div>
      </section>
    </SiteShell>
  );
}
