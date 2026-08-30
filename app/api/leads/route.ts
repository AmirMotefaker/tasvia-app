import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { validateLead } from "../../../src/leads/validation";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  attempts.set(key, current);
  return current.count > MAX_REQUESTS;
}

async function deliverLead(payload: Record<string, unknown>) {
  const webhook = process.env.LEAD_CAPTURE_WEBHOOK_URL?.trim();
  if (!webhook) {
    console.info("tasvia.lead.received", payload);
    return { sink: "application-log" as const };
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.LEAD_CAPTURE_TOKEN
        ? { authorization: `Bearer ${process.env.LEAD_CAPTURE_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) throw new Error(`Lead webhook returned ${response.status}`);
  return { sink: "webhook" as const };
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "تعداد درخواست‌ها زیاد است. یک دقیقه دیگر تلاش کنید." }, { status: 429 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "بدنه درخواست معتبر نیست." }, { status: 400 });
  }

  const result = validateLead((input ?? {}) as Record<string, unknown>);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, field: result.field, message: result.message },
      { status: result.spam ? 202 : 422 },
    );
  }

  const reference = `lead_${randomUUID()}`;
  const payload = {
    reference,
    source: "website-contact",
    receivedAt: new Date().toISOString(),
    ...result.lead,
  };

  try {
    const delivery = await deliverLead(payload);
    return NextResponse.json({
      ok: true,
      reference,
      message: "درخواست شما دریافت شد. پس از بررسی برای ادامه پایلوت با شما تماس می‌گیریم.",
      delivery: delivery.sink,
    });
  } catch (error) {
    console.error("tasvia.lead.delivery_failed", { reference, error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json(
      { ok: false, reference, message: "ارسال درخواست موقتاً ناموفق بود. چند دقیقه دیگر دوباره تلاش کنید." },
      { status: 503 },
    );
  }
}
