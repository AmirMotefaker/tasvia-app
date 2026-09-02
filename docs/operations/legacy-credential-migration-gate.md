# Tasvin legacy credential migration gate

Status: review artifact only. Production changes are not authorized by this document.

## Why this gate exists

The reviewed Prisma schema moves credential storage from `User.password` to Better Auth `Account.password`. The migration artifact therefore drops `User.password`. Before any production application, Tasvin must prove that legacy credentials will not be lost or strand existing users.

## Required evidence before production

1. Take and verify a restorable production backup or snapshot.
2. Run `scripts/legacy-credential-inventory.sql` using a read-only database role or read-only transaction.
3. Record only aggregate counts. Never export, print, log, or commit password values.
4. Confirm the number of users carrying legacy passwords and the number already represented by Better Auth credential Accounts.
5. Rehearse the production-shaped upgrade on an isolated non-production copy/snapshot.
6. Verify that existing users can authenticate after the rehearsal and that credential hashes are never transformed unless the Better Auth credential format is explicitly proven compatible.
7. If direct hash compatibility cannot be proven, do not copy hashes blindly. Use a controlled credential-transition strategy such as legacy verification followed by Better Auth credential upgrade, or an explicit password-reset flow.
8. Run migration status and schema drift checks after rehearsal.
9. Obtain an explicit production migration approval only after all evidence above is attached to the release gate.

## Hard blockers

Production migration MUST NOT proceed when any of the following is true:

- legacy password-bearing users have not been inventoried;
- no restorable backup/snapshot exists;
- hash/credential compatibility is unknown;
- non-production rehearsal fails;
- authentication regression tests fail;
- migration status or schema drift is non-zero;
- rollback/recovery procedure has not been verified.

## Current verified evidence

GitHub Actions run #154 successfully applied both repository migrations to ephemeral PostgreSQL 16, reported the database schema up to date, and reported no schema difference against `prisma/schema.prisma`. This proves the migration chain on a clean database. It does NOT yet prove safety for a populated legacy production database.

## Production posture

Remain fail-closed. No production database migration, credential mutation, password export, DNS change, payment action, or production-data write is authorized by this gate.
