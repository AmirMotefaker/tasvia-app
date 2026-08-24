import { createIdempotencyKey, type IdempotencyKey } from "./idempotency";

export function createFinancialOperationKey(
  businessId: string,
  operationId: string,
): IdempotencyKey {
  return createIdempotencyKey(`financial-operation:${businessId}`, operationId);
}
