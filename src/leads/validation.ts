export type LeadInput = {
  name?: unknown;
  business?: unknown;
  email?: unknown;
  phone?: unknown;
  role?: unknown;
  problem?: unknown;
  website?: unknown;
  consent?: unknown;
};

export type ValidLead = {
  name: string;
  business: string;
  email: string;
  phone: string;
  role: string;
  problem: string;
};

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function validateLead(input: LeadInput):
  | { ok: true; lead: ValidLead }
  | { ok: false; field?: string; message: string; spam?: boolean } {
  const website = text(input.website, 200);
  if (website) {
    return { ok: false, message: "درخواست نامعتبر است.", spam: true };
  }

  const name = text(input.name, 80);
  const business = text(input.business, 120);
  const email = text(input.email, 160).toLowerCase();
  const phone = text(input.phone, 32);
  const role = text(input.role, 80);
  const problem = text(input.problem, 1200);

  if (name.length < 2) return { ok: false, field: "name", message: "نام را کامل وارد کنید." };
  if (business.length < 2) return { ok: false, field: "business", message: "نام کسب‌وکار را وارد کنید." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, field: "email", message: "ایمیل معتبر وارد کنید." };
  if (phone && !/^[+0-9()\-\s]{7,32}$/.test(phone)) return { ok: false, field: "phone", message: "شماره تماس معتبر وارد کنید." };
  if (problem.length < 20) return { ok: false, field: "problem", message: "مسئله عملیاتی را کمی دقیق‌تر توضیح دهید." };
  if (input.consent !== true) return { ok: false, field: "consent", message: "برای ارسال درخواست، رضایت پردازش اطلاعات تماس لازم است." };

  return { ok: true, lead: { name, business, email, phone, role, problem } };
}
