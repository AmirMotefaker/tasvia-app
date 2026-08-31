import test from "node:test";
import assert from "node:assert/strict";
import { validateLead } from "../src/leads/validation";

test("valid lead is normalized and accepted", () => {
  const result = validateLead({
    name: "  امیر متفکر  ",
    business: "  فروشگاه نمونه  ",
    email: "  AMIR@example.com ",
    phone: "+98 912 000 0000",
    role: "owner",
    problem: "ما برای پیگیری درخواست‌های تسویه و شواهد مالی بین چند نقش عملیاتی مشکل داریم.",
    website: "",
    consent: true,
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.lead.name, "امیر متفکر");
    assert.equal(result.lead.email, "amir@example.com");
  }
});

test("honeypot submissions are treated as spam", () => {
  const result = validateLead({ website: "https://spam.example", consent: true });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.spam, true);
});

test("lead requires consent", () => {
  const result = validateLead({
    name: "کاربر تست",
    business: "کسب‌وکار تست",
    email: "test@example.com",
    problem: "این متن برای توضیح یک مسئله عملیاتی واقعی و قابل بررسی کافی است.",
    consent: false,
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.field, "consent");
});

test("lead rejects invalid email and sensitive-short descriptions", () => {
  const invalidEmail = validateLead({
    name: "کاربر تست",
    business: "کسب‌وکار تست",
    email: "not-an-email",
    problem: "این متن برای توضیح یک مسئله عملیاتی واقعی و قابل بررسی کافی است.",
    consent: true,
  });
  assert.equal(invalidEmail.ok, false);

  const shortProblem = validateLead({
    name: "کاربر تست",
    business: "کسب‌وکار تست",
    email: "test@example.com",
    problem: "کوتاه",
    consent: true,
  });
  assert.equal(shortProblem.ok, false);
  if (!shortProblem.ok) assert.equal(shortProblem.field, "problem");
});
