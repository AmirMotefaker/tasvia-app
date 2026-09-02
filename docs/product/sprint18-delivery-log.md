# Sprint 18 delivery log

Issue: #49
Branch: `feat/49-tasvin-product-completion`
PR: #50

## Product-completion implementation

The Sprint 18 branch now contains the consolidated Tasvin product-completion foundation, including:

- Competitive capability baseline and Tasvin differentiation.
- Shared mobile-first public shell, navigation, product/solution surfaces and Persian-first UX foundation.
- Dedicated Telegram Bot and Payment/Collection Links product surfaces.
- Sales, purchases, inventory, treasury, reconciliation, alerts and financial-reporting application surfaces.
- Simple and professional accounting experiences over one accounting domain foundation.
- Chart of accounts, fiscal periods, journals, counterparties, open balances and persistence repositories.
- Sales/purchase accounting, receivable/payable, opening balances, inventory/COGS, credit-note and tax-invoice flows.
- Trial balance, profit-and-loss, balance-sheet and cash-flow foundations.
- Financial alerts/intelligence with explicit prohibition on autonomous irreversible financial action.
- Better Auth, workspace/membership foundation and legacy credential transition safeguards.
- Non-destructive legacy credential migration, populated legacy DB rehearsal and zero-drift database gates.
- Persistent recovery challenge/grant models with atomic replay/race protection on PostgreSQL.
- Atomic challenge-verification-to-recovery-grant transaction rehearsal.

## Quality gates

The branch CI is required to pass all of the following before Ready/Merge:

1. Tracked-source secret scan.
2. Prisma schema validation.
3. Full migration rehearsal on ephemeral PostgreSQL.
4. Zero schema drift verification.
5. Recovery grant atomic-consumption rehearsal.
6. Recovery challenge atomic-verification/replay rehearsal.
7. Challenge-to-grant transaction rehearsal.
8. Populated legacy-user migration rehearsal.
9. Lint.
10. TypeScript typecheck.
11. Automated tests.
12. Production build.

## Final release gates only

The remaining work for PR #50 is intentionally limited to release validation rather than new feature expansion:

1. Latest Head CI must be fully GREEN.
2. Latest Vercel Preview deployment must be READY.
3. Consolidated desktop/mobile Preview QA must confirm the key public and authenticated product surfaces are usable and responsive.
4. Any QA blocker must be fixed on this branch and the gates rerun.
5. PR #50 can then move from Draft to Ready for final code review and squash merge.
6. Production database migration remains separately gated by the legacy-credential inventory, backup/recovery evidence and explicit production authorization.
7. Production promotion to `tasvin.ir` remains a deliberate post-merge release action; development validation must not mutate production data, payment systems, PSP/bank integrations or credentials.

## Production safety

No production DB migration/db push, PSP/bank integration, payment execution, production credential mutation, DNS mutation or production-data write is authorized by this delivery log.
