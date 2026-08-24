export interface IdempotencyKey {
  scope: string;
  key: string;
}

export function createIdempotencyKey(scope: string, key: string): IdempotencyKey {
  const normalizedScope = scope.trim();
  const normalizedKey = key.trim();

  if (!normalizedScope || !normalizedKey) {
    throw new TypeError("Idempotency scope and key are required.");
  }

  if (normalizedScope.length > 64 || normalizedKey.length > 128) {
    throw new RangeError("Idempotency scope or key exceeds configured limits.");
  }

  return { scope: normalizedScope, key: normalizedKey };
}

export function serializeIdempotencyKey(value: IdempotencyKey): string {
  return `${value.scope}:${value.key}`;
}
