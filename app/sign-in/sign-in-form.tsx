"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../../src/lib/auth-client";
import { sanitizeInternalNextPath } from "../../src/auth/workspace-gate";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const nextPath = useMemo(
    () => sanitizeInternalNextPath(searchParams.get("next")),
    [searchParams],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const result = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    if (result.error) {
      setStatus("error");
      setMessage("ورود انجام نشد. ایمیل و رمز عبور را بررسی کنید.");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs font-black text-[#4d596b]">ایمیل</span>
        <input type="email" autoComplete="email" required value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#008f87]"
          placeholder="name@company.com" />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-black text-[#4d596b]">رمز عبور</span>
        <input type="password" autoComplete="current-password" required minLength={8} value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#008f87]"
          placeholder="••••••••" />
      </label>

      {status === "error" ? (
        <div role="alert" className="rounded-2xl bg-[#fff0f0] p-3 text-xs font-bold text-[#8d2c2c]">{message}</div>
      ) : null}

      <button type="submit" disabled={status === "loading"}
        className="inline-flex w-full justify-center rounded-2xl bg-[#0f223d] px-5 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? "در حال ورود…" : "ورود امن به Workspace"}
      </button>
    </form>
  );
}
