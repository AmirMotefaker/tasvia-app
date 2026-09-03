import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, authConfigured } from "../../src/lib/auth";
import { resolveFirstActiveWorkspaceMembership } from "../../src/domain/workspace/repository";
import { evaluateWorkspaceGate } from "../../src/auth/workspace-gate";

export default async function AccountingLayout({ children }: Readonly<{ children: ReactNode }>) {
  if (!authConfigured) {
    return (
      <main className="min-h-screen bg-[#f3f6fa] px-4 py-12 text-[#0b1220] sm:px-6" dir="rtl">
        <div className="mx-auto max-w-xl rounded-[32px] border border-black/5 bg-white p-7 shadow-sm sm:p-9">
          <div className="text-xs font-black text-[#008f87]">حالت امن تسوین</div>
          <h1 className="mt-3 text-3xl font-black">حسابداری تا اتصال احراز هویت غیرProduction قفل است.</h1>
          <p className="mt-4 text-sm leading-7 text-[#657184]">هیچ ثبت مالی بدون Session معتبر و Workspace فعال در دسترس قرار نمی‌گیرد.</p>
          <Link href="/" className="mt-6 inline-flex rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">بازگشت به سایت</Link>
        </div>
      </main>
    );
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id) redirect("/sign-in?next=/accounting/simple");

  const membership = await resolveFirstActiveWorkspaceMembership(session.user.id);
  const gate = evaluateWorkspaceGate(session.user.id, membership);
  if (gate.state === "MEMBERSHIP_REQUIRED") {
    return (
      <main className="min-h-screen bg-[#f3f6fa] px-4 py-12 text-[#0b1220] sm:px-6" dir="rtl">
        <div className="mx-auto max-w-xl rounded-[32px] border border-black/5 bg-white p-7 shadow-sm sm:p-9">
          <div className="text-xs font-black text-[#008f87]">کنترل دسترسی</div>
          <h1 className="mt-3 text-3xl font-black">Workspace فعال برای ثبت حسابداری وجود ندارد.</h1>
          <p className="mt-4 text-sm leading-7 text-[#657184]">عضویت فعال لازمه مشاهده و ثبت اطلاعات مالی است.</p>
        </div>
      </main>
    );
  }
  if (gate.state !== "ALLOWED") redirect("/sign-in?next=/accounting/simple");

  return children;
}
