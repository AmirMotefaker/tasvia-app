const FALLBACK_SITE_URL = "https://tasvin.ir";

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    FALLBACK_SITE_URL,
);

export const SITE_NAME = "تسوین";
export const SITE_NAME_EN = "Tasvin";
