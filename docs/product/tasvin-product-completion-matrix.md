# Tasvin Product Completion Matrix

Status: execution baseline for Issue #49

## Product principle
Tasvin is a comprehensive Persian accounting and financial-operations product with two experiences over one auditable accounting truth:

1. **Simple mode** — for owners and operators who do not know accounting terminology.
2. **Professional mode** — for accountants and finance teams that need journals, ledgers, controls, dimensions, evidence and financial statements.

Simple actions must create the same balanced ledger records used by professional mode. No parallel fake/demo accounting model is acceptable.

## P0 — required before launch

### Accounting kernel
- Chart of accounts and account hierarchy
- Fiscal years and periods
- Opening balances
- Balanced double-entry journals
- Draft / posted / reversed lifecycle
- Immutable audit trail for posted financial records
- General ledger, subsidiary ledger and journal views
- Accounting dimensions / cost centers
- Trial balance
- Profit & loss
- Balance sheet
- Cash-flow reporting
- Drill-down from statement -> account -> journal -> source evidence

### Sales and receivables
- Customer master
- Quotes / pro-forma where applicable
- Sales invoices and line items
- Discounts, taxes and adjustments
- Receipts and allocation to invoices
- Accounts receivable aging
- Customer statement and balance
- Due-date reminders
- Returns / credit adjustments with audit trail

### Purchases and payables
- Supplier master
- Purchase invoices and expenses
- Payments and allocation
- Accounts payable aging
- Supplier statement and balance
- Purchase returns / adjustments
- Expense categorization

### Treasury
- Cash boxes and bank accounts
- Receipts / payments / transfers
- Reconciliation workflow
- Cheques and due dates
- Cash position
- Payment and settlement tracking
- Evidence / reference attachment contract

### Inventory
- Product / service catalog
- Units and pricing
- Warehouses
- Stock movements
- Purchase / sale effects on stock
- Inventory valuation foundation
- Low-stock alerts
- Stock card / movement history

### Tax and Iran readiness
- Tax-aware invoice model
- VAT/tax configuration foundation
- Iranian fiscal identifiers required by product flows
- Exportable tax/audit evidence
- Taxpayer-system integration boundary so external submission can be added safely without coupling the accounting kernel to one provider

### Workspace and controls
- Multi-workspace / multi-business foundation
- Branches
- Role-based access
- Owner / accountant / operator responsibilities
- Approval boundaries for sensitive financial actions
- Session protection
- Audit events
- Idempotency for financial commands

### UX for everyone
- Mobile-first responsive shell
- RTL Persian-first product experience
- Quick actions: فروختم، خرید کردم، پول گرفتم، پول دادم، هزینه کردم، طلب و بدهی
- Guided forms with plain-Persian explanations
- Professional accounting mode
- Search and filtering
- Empty, loading, validation and error states
- Accessible keyboard/focus behavior
- No accounting jargon required in simple mode

### Reporting and intelligence
- Business dashboard
- Sales, expense, receivable, payable and cash summaries
- Financial statements
- Reconciliation exceptions
- Cash-flow warnings
- Explainable anomaly detection
- Plain-Persian explanation of financial state
- No autonomous irreversible financial action

### Integrations
- Import/export foundation (CSV/Excel-compatible data contract)
- API boundary
- Webhook delivery with idempotency and signature contract
- Telegram bot contract for safe queries, reminders and approved workflows
- Integration activity/audit history

### Public product surface
Every major product capability must have a dedicated, useful page or product surface; marketing copy must not claim a capability that has no implemented product contract.

## P1 — complete product expansion
- Payroll foundation
- Fixed assets and depreciation
- Projects / profitability dimensions
- Multi-currency accounting
- Manufacturing / bill-of-materials foundation where applicable
- Recurring invoices and recurring expenses
- Budgeting and variance analysis
- Advanced inventory controls
- Advanced approvals
- Accountant collaboration workflow
- Document capture/OCR boundary
- Automated categorization with human confirmation

## Competitive parity rule
Useful capabilities identified from Hesabfa, Variza and TCart are tracked as requirements, but Tasvin must not copy proprietary text, visual design or implementation. We implement the underlying user need in Tasvin's own product architecture and aim for a simpler, more automation-first workflow.

## Pricing rule
Launch pricing target: approximately 20% below comparable current Hesabfa plans. Exact public prices must be re-verified immediately before launch; prices must never be hard-coded from stale competitive research.

## Definition of Done
A capability is complete only when, where applicable:
- domain/data contract exists;
- authorization and audit behavior are defined;
- real product UI exists;
- mobile behavior is usable;
- validation/error/empty states exist;
- tests cover accounting invariants and critical behavior;
- lint, typecheck, tests and production build pass;
- no production DB, PSP, bank, payment execution or production-data mutation is used for development validation.

## Deployment gate
Do not spend development cycles on Vercel previews until the product-completion branch reaches final QA readiness. Then use one consolidated Preview, perform desktop/mobile QA, and only after approval perform a deliberate production release to tasvin.ir.
