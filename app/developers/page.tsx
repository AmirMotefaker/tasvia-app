import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "توسعه‌دهندگان و API",
  description: "معماری آینده API و Webhook تسوین برای توسعه‌دهندگان.",
  alternates: { canonical: "/developers" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black text-[#63dfd4]">PLANNED API</span>
        <h1 className="mt-5 text-4xl font-black">Tasvin for Developers</h1>
        <p className="mt-5 text-base leading-8 text-white/65">API عمومی هنوز منتشر نشده است. طراحی آینده بر احراز هویت server-side، idempotency، webhook امضاشده، delivery ID، retry policy و auditability تمرکز خواهد داشت.</p>
        <pre className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-black/20 p-5 text-left text-xs leading-7" dir="ltr">{`POST /v1/settlements
Idempotency-Key: ...

202 Accepted
{
  "status": "planned-contract-example"
}`}</pre>
      </div>
    </main>
  );
}
