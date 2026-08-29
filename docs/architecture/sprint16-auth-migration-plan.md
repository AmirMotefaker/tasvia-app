# Sprint 16A — Authentication Compatibility & Migration Plan
Status: application/schema foundation only. No production migration.

## Boundaries
Better Auth owns identity, accounts, sessions and verification.
Tasvia owns Workspace, Membership, WorkspaceRole and financial authorization.
Authentication never implies financial/workspace authorization.

## Legacy compatibility
Merchant and legacy User phone/password/role remain during transition.
No Transaction semantics change.

## Production migration gate
Before production migration: review SQL; inventory User/Merchant data; define deterministic identity mapping; define Workspace backfill; define backup/rollback; validate on non-production DB; obtain separate approval.

## Forbidden in Sprint 16A
- prisma migrate deploy
- production prisma migrate dev
- prisma db push
- production backfill
- bank/PSP/payment execution changes
