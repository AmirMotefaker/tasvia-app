# Tasvin Sprint 18 — Competitive capability matrix

Reviewed: 2026-09-01

## Purpose

This document tracks capability parity and differentiation for **تسوین / Tasvin** without copying competitor text, visual design, or protected content. Competitor material is used only as factual product-research input. Public Tasvin claims must remain classified as **Available**, **Preview**, **Planned**, or **Not applicable**.

## Evidence policy

A competitor capability is counted only when it is supported by an attributable public product surface or direct/manual evidence capture. Search-result inference, similarly named products, stale third-party pages, or assumptions are not accepted as product evidence.

## Baseline

### Variza
Publicly visible capability themes reviewed for the current baseline include payment/collection links, reusable links, QR, multiple account/card scenarios, payment status/verification, dashboard analytics, exports, notifications, Telegram integration, API/webhooks, page customization, pricing/help surfaces, and marketplace/team-oriented use cases.

### TCart — evidence gate status

On 2026-09-01 a new direct/public-web evidence attempt was performed for `tcartt.com`. The direct page fetch did not return usable product content and public search did not return an authoritative indexed TCart product surface that could safely support feature claims. Search results included unrelated products with similar names, which are explicitly excluded as evidence.

Therefore:

- no TCart-only capability is being invented or inferred;
- the TCart row-by-row parity gate remains **UNVERIFIED**;
- closing Issue #49 still requires a direct/manual capture of the actual `tcartt.com` product surface, or an explicit scope decision if the site remains unavailable;
- all Tasvin capabilities below remain driven by verified needs, the Variza baseline, Hesabfa/accounting requirements, and Tasvin's own product architecture rather than unsupported TCart claims.

## Tasvin capability matrix

| Capability | Tasvin status | Current evidence / direction |
| --- | --- | --- |
| Public product website | Available | Dedicated public IA and Tasvin brand/domain surfaces |
| Settlement operations center | Available / Preview | Existing authenticated settlement workflow foundation |
| Supplier workspace | Available / Preview | Supplier operational surface and payable accounting foundation |
| Reconciliation workspace | Available / Preview | Reconciliation surface + advisory matching foundation |
| Reports | Preview | Financial statements, cash flow and drill-down foundations |
| Financial intelligence | Preview | Due/overdue, low-stock and reconciliation alerts |
| Role-scoped workspace access | Available foundation | Better Auth + workspace membership/access contracts |
| Payment/collection links | Preview surface | Dedicated product route exists; runtime completion remains gated |
| Reusable links | Planned | Runtime capability still required |
| QR collection | Planned | Runtime capability still required |
| Notification center | Planned | Product/runtime capability still required |
| Telegram Bot | Preview foundation | Public route + integration contracts exist; end-to-end runtime verification remains |
| API | Planned / public surface | Developer surface exists; runtime management remains gated |
| Webhooks | Planned / public surface | Signed/idempotent runtime delivery remains gated |
| Export CSV/Excel | Planned | Reporting export runtime remains gated |
| Workspace members/team | Preview foundation | Membership/role model exists; final management UX remains |
| Multi-branch foundation | Preview foundation | BRANCH / COST_CENTER / PROJECT dimensions implemented and tested |
| Scheduled settlements | Planned | Planning foundation only; no autonomous fund transfer |
| Audit/evidence history | Available foundation / Preview UX | Auditable financial events and source linkage foundations |
| Duplicate/idempotency controls | Available foundation | Journal/open-balance idempotency foundations |
| Cash-flow insights | Available foundation / Preview UX | Cash-flow statement engine and management surfaces |
| Anomaly detection | Available foundation / Preview UX | Explainable advisory financial-intelligence foundation |
| Double-entry accounting | Preview foundation | Balanced journals, periods, reversal and persistence foundations |
| Sales / receivables | Preview foundation | Invoice, receipt allocation, aging, statements and credit notes |
| Purchases / payables | Preview foundation | Purchase invoice, supplier payable/payment and aging foundations |
| Inventory | Preview foundation | Stock movements, valuation, COGS, transfers and low-stock controls |
| Cheques / due dates | Preview foundation | Received/issued cheque lifecycle and due-state foundation |
| Opening balances | Preview foundation | Balanced opening journal flow with fiscal-period controls |
| Payroll | Preview foundation | Accounting foundation only; no payment/statutory execution |
| Fixed assets | Preview foundation | Register/depreciation accounting foundation only |

## Tasvin differentiation

Tasvin is not positioned as a clone of a card-to-card verification product. Its target architecture is:

**Collection & evidence → Reconciliation → Settlement operations → Supplier operations → Accounting truth → Reporting → Explainable financial intelligence**

The differentiating product principles are:

1. Exact-money and deterministic financial primitives.
2. Auditable state transitions and evidence history.
3. Server-side workspace and role authorization.
4. Reconciliation and discrepancy management as first-class workflows.
5. Supplier and settlement operations beyond payment confirmation.
6. One accounting truth across simple and professional UX.
7. Explainable financial intelligence that remains advisory.
8. No silent or autonomous transfer of funds.
9. Mobile-first Persian operational UX.

## Remaining competitor gate before launch closure

1. Capture authoritative TCart product evidence directly/manual if the site becomes reachable.
2. Add each verified TCart-only useful capability as an explicit row.
3. Classify every verified row as Available / Preview / Planned / Not applicable with Tasvin evidence.
4. Never hold the release on an invented capability; hold it only on an unresolved evidence requirement or an explicit launch-scope decision.

## Remaining delivery order

1. Close or explicitly resolve the TCart evidence gate.
2. Rehearse runtime persistence/migrations against non-production data.
3. Validate auth/session, Telegram foundation and authenticated workflows in Preview.
4. Preview QA at 320/360/375/390/412/430/768/desktop.
5. Fix launch-blocking defects only.
6. Review, Ready, squash merge and release evidence.
