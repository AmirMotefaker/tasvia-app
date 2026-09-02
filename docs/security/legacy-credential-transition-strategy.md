# Tasvin Legacy Credential Transition Strategy

Status: production-blocking design decision

## Evidence established

- The legacy baseline schema stores an optional credential in `User.password`.
- The reviewed auth/workspace/accounting migration removes `User.password`.
- Populated non-production rehearsal proves existing `User` and `Merchant` rows survive the migration.
- The same rehearsal proves the migration does not create an `Account.password` credential for a legacy user.
- Current runtime authentication uses Better Auth with `emailAndPassword` enabled and Prisma `Account` persistence.
- No legacy password verifier or documented legacy hash algorithm is present in the reviewed runtime source.

## Production rule

Do not copy values from `User.password` to `Account.password` merely because both fields are named `password`.

A password hash is only portable when its algorithm, parameters, encoding and verification semantics are proven compatible with the target authentication implementation. Until that compatibility is demonstrated with executable tests, direct credential copying is forbidden.

## Preferred transition paths

### Path A — verified compatible hash migration

This path is allowed only if all of the following are proven on synthetic/non-production data:

1. the exact legacy hash algorithm and parameters are identified;
2. the legacy verifier successfully validates known password/hash fixtures;
3. Better Auth accepts the migrated hash through the same credential path used in production sign-in;
4. successful sign-in does not require plaintext recovery or re-hashing from an unknown password;
5. invalid passwords are rejected;
6. migrated credentials remain bound to the correct user and provider/account identifiers;
7. populated DB rehearsal passes end-to-end.

If any item is unproven, Path A is rejected.

### Path B — migration-on-login

This path is allowed only if the legacy verifier can be reconstructed safely but the hash is not directly portable.

For a limited transition window:

1. user submits their password through the normal authenticated sign-in surface;
2. the legacy verifier validates it against the legacy credential;
3. after successful verification, a Better Auth credential is created using the target runtime's password hashing flow;
4. the legacy credential is marked migrated and is never logged or exposed;
5. subsequent sign-ins use Better Auth only;
6. failed legacy verification creates no Better Auth credential;
7. the legacy verifier is removed after the migration window and completion criteria are satisfied.

This path requires a two-phase database rollout: the legacy credential cannot be dropped before users have a supported transition path.

### Path C — controlled credential reset

Use this path when the legacy hash algorithm/verifier cannot be proven compatible or safely reconstructed.

1. preserve the user identity and business relationships;
2. do not copy the unknown legacy hash into Better Auth;
3. require affected legacy users to establish a new credential through an authenticated recovery/reset flow;
4. invalidate or retire the legacy credential only after the reset path is available and tested;
5. provide operational visibility using aggregate counts only; never export credential values.

## Required migration architecture

The current destructive migration is not production-ready for a database containing legacy credentials. Production rollout must be split so that credential transition occurs before `User.password` is dropped.

Recommended sequence:

1. inventory legacy users using aggregate/read-only queries;
2. choose Path A, B or C based on executable compatibility evidence;
3. introduce the target Better Auth account structures without dropping `User.password`;
4. rehearse the chosen credential transition on a populated non-production clone/synthetic dataset;
5. verify sign-in success/failure semantics and account ownership;
6. confirm aggregate legacy credential count reaches the approved removal threshold;
7. take and verify a restorable backup immediately before the destructive step;
8. only then apply a separate cleanup migration that drops `User.password`.

## Stop conditions

Production migration must stop if any of these are true:

- legacy credential count is unknown;
- legacy hash compatibility is assumed rather than proven;
- no tested login/reset transition exists for affected users;
- a restorable backup is unavailable;
- populated rehearsal has not passed for the chosen transition path;
- account ownership or user mapping is ambiguous;
- rollback/recovery procedure has not been rehearsed.

## Current decision

With the evidence currently present in the repository, direct hash migration is NOT approved. The safe default is Path C unless a legacy verifier and executable compatibility evidence are subsequently recovered. The current migration that drops `User.password` remains blocked from Production until it is split into an additive transition migration followed by a later destructive cleanup migration.
