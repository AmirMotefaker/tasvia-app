# Tasvin Provider Sandbox Checklist

This checklist is evidence for provider readiness only. It never authorizes production activation by itself.

## Global rules

- Every provider is disabled by default.
- Sandbox credentials must be separate from production credentials.
- Secret values must never be committed, logged, attached to issues, or copied into readiness reports.
- Every request that can cause a financial or regulatory mutation must have an idempotency strategy and an auditable provider reference.
- Production activation requires an explicit approval recorded after sandbox evidence is complete.
- A provider may be enabled independently; incomplete providers remain disabled without blocking code deployment when they are not required for launch.

## Bank / PSP

Required sandbox evidence:

- authentication/credential handshake succeeds in sandbox;
- payment/request creation succeeds with non-production identifiers;
- callback or verification signature is validated;
- duplicate callback/request replay is idempotent;
- failed, cancelled and expired payments are mapped correctly;
- no automatic payout/transfer occurs without an explicit authorized workflow;
- reconciliation evidence retains provider reference and internal idempotency key;
- timeout and provider-unavailable paths fail closed.

Production activation additionally requires contractual/provider approval and an explicit production authorization record.

## SMS / Recovery

Required sandbox evidence:

- provider authentication succeeds without logging secrets;
- destination normalization is verified;
- challenge delivery is rate limited;
- challenge TTL is enforced;
- challenge verification and recovery grant are single-use;
- replay and concurrent verification tests pass;
- provider failure does not expose whether an account exists.

Production activation additionally requires approved sender/origin configuration and explicit production authorization.

## Taxpayer system

Required sandbox evidence:

- invoice payload mapping is validated against the supported schema;
- fiscal identifiers are validated before submission;
- duplicate submission is prevented by idempotency key;
- accepted, rejected and pending states are mapped without silently mutating the accounting ledger;
- provider/system references are retained for audit;
- rejected submissions remain actionable and explainable.

Production activation additionally requires valid organization credentials/certificates and explicit authorization to submit real invoices.

## Official inquiries

Required sandbox evidence:

- supported inquiry types are explicitly allow-listed;
- request correlation IDs are unique and auditable;
- provider errors and ambiguous responses fail closed;
- only minimum necessary response data is retained;
- no raw identity/banking response is written to logs;
- rate limits and retry policy are bounded.

Production activation additionally requires lawful/provider access and explicit authorization.

## POS / Card reader

Required sandbox evidence:

- terminal identity maps to exactly one workspace/bank-account context;
- provider/terminal state is validated before use;
- transaction reference is retained for reconciliation;
- duplicate terminal events are idempotent;
- disconnected/offline state does not create a successful financial record;
- settlement/reconciliation mismatch is surfaced as an exception.

Production activation additionally requires registered terminal identifiers and explicit authorization.

## Evidence record

For each provider record only:

- provider kind;
- sandbox environment identifier (non-secret);
- test timestamp;
- code/commit SHA;
- test result;
- evidence or run URL;
- approver for production activation when applicable.

Never record tokens, passwords, private keys, certificate private material, full card data or recovery secrets.