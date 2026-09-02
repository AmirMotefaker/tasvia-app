# Tasvin Launch Scope Freeze

Date: 2026-09-01
Parent: #49 / PR #50

## Launch accounting scope

The launch candidate includes the accounting and financial-operations foundations already implemented on `feat/49-tasvin-product-completion`, including double-entry journals, receivables/payables, inventory, financial statements, cheques, accounting dimensions, opening balances, fiscal-period controls, controlled reversals, payroll foundation, and fixed-assets/depreciation foundation.

## Explicit post-launch scope

The following capabilities are deliberately excluded from the initial launch and must not block PR #50 unless separately promoted to launch scope:

- payroll payment execution
- statutory payroll tax/insurance/government submissions
- attendance and advanced benefits administration
- advanced fixed-asset disposal and revaluation automation
- tax-specific depreciation automation

## Remaining launch gates

Feature development must now stop unless a launch-blocking defect is discovered. Remaining work is validation and delivery:

1. TCart direct evidence capture and competitor matrix closure.
2. Runtime persistence and non-production migration rehearsal.
3. Auth/session and authorization validation in Preview.
4. Telegram bot end-to-end foundation verification.
5. Fresh Preview from current PR head.
6. Desktop/mobile responsive QA and authenticated workflow QA.
7. Confirm no demo/sample financial values masquerade as real data.
8. Code review, Ready transition, squash merge, release notes/tag/evidence.

Production remains unchanged until these gates pass and deployment is explicitly approved.
