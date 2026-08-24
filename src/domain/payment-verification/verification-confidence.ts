export const VERIFICATION_THRESHOLDS = {
  autoVerify: 0.9,
  manualReview: 0.6,
} as const;

export function normalizeConfidence(score: number): number {
  if (!Number.isFinite(score)) return 0;
  if (score <= 0) return 0;
  if (score >= 1) return 1;
  return score;
}
