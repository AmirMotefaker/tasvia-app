# Tasvin Production Launch Runbook

## Purpose
This runbook separates **code-ready** from **production-authorized**. Passing CI or merging code does not authorize production database migrations, bank/PSP execution, taxpayer submissions, official inquiries, credential mutation, DNS changes, or production-data writes.

## Hard launch gates
All gates must be evidenced before activation:

1. Latest `main` CI is green.
2. Production backup exists and restore verification has passed in an isolated environment.
3. Non-production migration rehearsal is green with zero schema drift.
4. Legacy credential inventory is complete and the transition plan is accepted.
5. Rollback owner, rollback command/process, stop conditions, and verification steps are recorded.
6. Every provider being enabled has:
   - sandbox verification,
   - production credentials present in the deployment secret store,
   - explicit production authorization,
   - health-check evidence,
   - a kill switch/default-off feature flag.
7. Providers not meeting every requirement remain disabled.

## Default-off provider flags
Recommended explicit flags:

- `TASVIN_ENABLE_BANK_PSP=false`
- `TASVIN_ENABLE_SMS_RECOVERY=false`
- `TASVIN_ENABLE_TAXPAYER=false`
- `TASVIN_ENABLE_OFFICIAL_INQUIRY=false`
- `TASVIN_ENABLE_POS=false`

Only the exact value `true` enables a provider. Missing or malformed values are treated as disabled.

## Database activation sequence
Do not run against production until separately authorized.

1. Capture timestamped backup and verify it is restorable.
2. Record pre-migration counts for User, Membership, Account, Journal, Transaction and recovery tables.
3. Confirm legacy credential inventory and recovery path.
4. Run the exact migration set first on a production-like non-production database.
5. Verify zero drift and application smoke tests.
6. Schedule a deliberate production migration window with rollback authority present.
7. Apply migration.
8. Re-run counts, auth smoke tests, accounting invariants, reconciliation checks and health probes.
9. Stop immediately on unexpected row loss, auth lockout, journal imbalance, migration drift or provider-side mutation mismatch.

## Provider activation sequence
Enable one provider at a time. Keep financial providers last.

1. Configure production secret values without logging them.
2. Keep provider feature flag disabled.
3. Run connectivity/health check that performs no irreversible business action.
4. Record provider account/environment identifiers and expected callback endpoints.
5. Obtain explicit production authorization.
6. Enable the provider flag.
7. Run a minimal reversible/canary operation where the provider supports it.
8. Observe logs/audit records before increasing traffic.

## Rollback / stop conditions
Immediately stop launch and disable affected provider flags if any of the following occur:

- authentication regression or legacy user lockout,
- database migration error or unexplained drift,
- unexpected data loss or duplicate financial records,
- journal debit/credit imbalance,
- incorrect reconciliation outcome,
- provider duplicate callback/idempotency failure,
- incorrect taxpayer or official-inquiry submission target,
- bank/PSP destination mismatch,
- unexplained 5xx spike or security incident.

Rollback does not automatically mean destructive schema rollback. Prefer disabling traffic/provider flags and restoring application compatibility first; use database restoration only under the approved recovery procedure.

## Launch evidence
Final GitHub release/review evidence should include:

- `main` commit SHA,
- CI run URL/number,
- backup verification timestamp,
- migration rehearsal evidence,
- legacy credential inventory outcome,
- enabled/disabled provider matrix,
- authorization owner/date,
- smoke-test results,
- rollback owner,
- known limitations.
