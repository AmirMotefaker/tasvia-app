# Tasvin Sprint 18 — Competitive capability matrix

Reviewed: 2026-08-31

## Purpose

This document tracks capability parity and differentiation for **تسوین / Tasvin** without copying competitor text, visual design, or protected content. Competitor material is used only as a factual product-research input. Public Tasvin claims must remain classified as **Available**, **Preview**, **Planned**, or **Not applicable**.

## Baseline

### Variza
Publicly visible capability themes reviewed for the current baseline include payment/collection links, reusable links, QR, multiple account/card scenarios, payment status/verification, dashboard analytics, exports, notifications, Telegram integration, API/webhooks, page customization, pricing/help surfaces, and marketplace/team-oriented use cases.

### TCart
TCart is tracked as a second benchmark for card-to-card/payment-collection UX. Only capabilities that can be verified from public product surfaces should be marked as competitor evidence; unknown capabilities remain unverified rather than inferred.

## Tasvin capability matrix

| Capability | Tasvin status | Sprint 18 direction |
| --- | --- | --- |
| Public product website | Available | Redesign + complete IA |
| Settlement operations center | Available / Preview | Complete authenticated workflows |
| Supplier workspace | Available / Preview | Complete states, search, filters, evidence |
| Reconciliation workspace | Available / Preview | Add discrepancy workflow + health metrics |
| Reports | Available / Preview | Expand operational and period reports |
| Financial intelligence | Preview | Explainable cash-flow/anomaly insights |
| Role-scoped workspace access | Available | Harden mobile/account/team UX |
| Payment/collection links | Planned | Product surface + secure implementation plan |
| Reusable links | Planned | Capability design |
| QR collection | Planned | Capability design |
| Notification center | Planned | Product + Telegram foundation |
| Telegram Bot | Planned | Secure account linking, alerts, lookup, summaries |
| API | Planned | Developer IA and contract-first implementation |
| Webhooks | Planned | Signed/idempotent event-delivery foundation |
| Export CSV/Excel | Planned | Reporting export foundation |
| Workspace members/team | Preview | Complete team/member management UX |
| Multi-branch foundation | Planned | Solution IA + domain model follow-up |
| Scheduled settlements | Planned | Planning foundation only; no autonomous fund transfer |
| Audit/evidence history | Available / Preview | Make visible in product workflows |
| Duplicate/idempotency controls | Available foundation | Surface operationally |
| Cash-flow insights | Available foundation / Preview UX | Productize safely |
| Anomaly detection | Available foundation / Preview UX | Explainable advisory UX |

## Tasvin differentiation

Tasvin is not positioned as a clone of a card-to-card verification product. Its target architecture is:

**Collection & evidence → Reconciliation → Settlement operations → Supplier operations → Reporting → Explainable financial intelligence**

The differentiating product principles are:

1. Exact-money and deterministic financial primitives.
2. Auditable state transitions and evidence history.
3. Server-side workspace and role authorization.
4. Reconciliation and discrepancy management as first-class workflows.
5. Supplier and settlement operations beyond payment confirmation.
6. Explainable financial intelligence that remains advisory.
7. No silent or autonomous transfer of funds.
8. Mobile-first Persian operational UX.

## Sprint 18 implementation order

1. Eliminate remaining legacy Tasvia branding.
2. Build shared public navigation/footer/mobile shell.
3. Add complete public IA and dedicated solution pages.
4. Add Payment Links and Telegram Bot product surfaces with factual status labels.
5. Complete authenticated mobile product UX.
6. Implement safe capability foundations in small reviewed slices.
7. Preview QA at 320/360/375/390/412/430/768/desktop.
8. Review, merge, release evidence.
