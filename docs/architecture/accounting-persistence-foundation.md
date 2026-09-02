# Accounting persistence foundation

## Purpose
Move Tasvin's completed accounting domain from in-memory contracts to an auditable PostgreSQL persistence model without touching production data during development.

## Rollout order
1. Accounts, fiscal periods, journals and journal lines
2. Customers, suppliers, receivables and payables
3. Treasury accounts and reconciliation data
4. Catalog, warehouses and stock movements
5. Sales/purchase invoices and allocations
6. Read models for dashboard, alerts and financial statements

## Non-negotiable invariants
- Every accounting row belongs to exactly one workspace.
- Posted journals are immutable; corrections use reversal entries.
- Journal lines use exact integer IRR values (`BigInt`).
- Debit and credit are stored separately and must never both be negative.
- Application services validate balanced journals before persistence.
- All source documents retain traceability to journal records.
- Cross-workspace references are forbidden by application checks and reinforced by indexes/relations where practical.
- Idempotency keys are unique per workspace for write commands.

## Development safety
This branch may evolve Prisma schema and tests, but must not run migrations or `db push` against production. Validation uses disposable/local/non-production PostgreSQL only. Production migration requires a separate reviewed release step after final QA.
