-- Tasvin reviewed migration artifact
-- Scope: Better Auth identity, workspace membership, counterparties/open balances,
-- accounting accounts, fiscal periods, journals and journal lines.
-- IMPORTANT: this file is committed for review/rehearsal only. Do not apply to Production
-- until the non-production rehearsal, legacy-data inventory, backup and explicit Production gate pass.

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'FINANCE', 'VIEWER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AccountingAccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FiscalPeriodStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccountingJournalStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "CounterpartyType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'BOTH');

-- CreateEnum
CREATE TYPE "OpenBalanceType" AS ENUM ('RECEIVABLE', 'PAYABLE');

-- CreateEnum
CREATE TYPE "OpenBalanceStatus" AS ENUM ('OPEN', 'PARTIALLY_PAID', 'PAID', 'VOID');

-- Better Auth-compatible User evolution.
-- NOTE: legacy User.password is intentionally removed to match the reviewed Prisma schema.
-- Inventory/backup legacy rows before any Production application.
ALTER TABLE "User"
  ADD COLUMN "name" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "image" TEXT,
  ALTER COLUMN "phone" DROP NOT NULL,
  DROP COLUMN "password";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'VIEWER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "CounterpartyType" NOT NULL,
    "name" TEXT NOT NULL,
    "nationalId" TEXT,
    "economicCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenBalance" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "type" "OpenBalanceType" NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "originalAmount" BIGINT NOT NULL,
    "outstandingAmount" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "status" "OpenBalanceStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OpenBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingAccount" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountingAccountType" NOT NULL,
    "parentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AccountingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalPeriod" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "FiscalPeriodStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FiscalPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingJournal" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "fiscalPeriodId" TEXT,
    "number" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AccountingJournalStatus" NOT NULL DEFAULT 'DRAFT',
    "sourceDocumentId" TEXT,
    "reversalOfId" TEXT,
    "idempotencyKey" TEXT,
    "postedAt" TIMESTAMP(3),
    "reversedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AccountingJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingJournalLine" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" BIGINT NOT NULL DEFAULT 0,
    "credit" BIGINT NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccountingJournalLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Account_issuer_accountId_key" ON "Account"("issuer", "accountId");
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");
CREATE UNIQUE INDEX "Membership_userId_workspaceId_key" ON "Membership"("userId", "workspaceId");
CREATE INDEX "Membership_workspaceId_status_idx" ON "Membership"("workspaceId", "status");
CREATE INDEX "Membership_userId_status_idx" ON "Membership"("userId", "status");
CREATE INDEX "Counterparty_workspaceId_type_active_idx" ON "Counterparty"("workspaceId", "type", "active");
CREATE INDEX "Counterparty_workspaceId_name_idx" ON "Counterparty"("workspaceId", "name");
CREATE UNIQUE INDEX "OpenBalance_workspaceId_type_sourceDocumentId_key" ON "OpenBalance"("workspaceId", "type", "sourceDocumentId");
CREATE INDEX "OpenBalance_workspaceId_type_status_dueAt_idx" ON "OpenBalance"("workspaceId", "type", "status", "dueAt");
CREATE INDEX "OpenBalance_counterpartyId_status_idx" ON "OpenBalance"("counterpartyId", "status");
CREATE UNIQUE INDEX "AccountingAccount_workspaceId_code_key" ON "AccountingAccount"("workspaceId", "code");
CREATE INDEX "AccountingAccount_workspaceId_type_active_idx" ON "AccountingAccount"("workspaceId", "type", "active");
CREATE INDEX "AccountingAccount_parentId_idx" ON "AccountingAccount"("parentId");
CREATE UNIQUE INDEX "FiscalPeriod_workspaceId_name_key" ON "FiscalPeriod"("workspaceId", "name");
CREATE INDEX "FiscalPeriod_workspaceId_startsAt_endsAt_idx" ON "FiscalPeriod"("workspaceId", "startsAt", "endsAt");
CREATE INDEX "FiscalPeriod_workspaceId_status_idx" ON "FiscalPeriod"("workspaceId", "status");
CREATE UNIQUE INDEX "AccountingJournal_workspaceId_number_key" ON "AccountingJournal"("workspaceId", "number");
CREATE UNIQUE INDEX "AccountingJournal_workspaceId_idempotencyKey_key" ON "AccountingJournal"("workspaceId", "idempotencyKey");
CREATE INDEX "AccountingJournal_workspaceId_occurredAt_idx" ON "AccountingJournal"("workspaceId", "occurredAt");
CREATE INDEX "AccountingJournal_workspaceId_status_idx" ON "AccountingJournal"("workspaceId", "status");
CREATE INDEX "AccountingJournal_sourceDocumentId_idx" ON "AccountingJournal"("sourceDocumentId");
CREATE INDEX "AccountingJournal_fiscalPeriodId_idx" ON "AccountingJournal"("fiscalPeriodId");
CREATE INDEX "AccountingJournalLine_journalId_idx" ON "AccountingJournalLine"("journalId");
CREATE INDEX "AccountingJournalLine_accountId_idx" ON "AccountingJournalLine"("accountId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OpenBalance" ADD CONSTRAINT "OpenBalance_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OpenBalance" ADD CONSTRAINT "OpenBalance_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccountingAccount" ADD CONSTRAINT "AccountingAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountingAccount" ADD CONSTRAINT "AccountingAccount_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AccountingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FiscalPeriod" ADD CONSTRAINT "FiscalPeriod_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountingJournal" ADD CONSTRAINT "AccountingJournal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountingJournal" ADD CONSTRAINT "AccountingJournal_fiscalPeriodId_fkey" FOREIGN KEY ("fiscalPeriodId") REFERENCES "FiscalPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccountingJournal" ADD CONSTRAINT "AccountingJournal_reversalOfId_fkey" FOREIGN KEY ("reversalOfId") REFERENCES "AccountingJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccountingJournalLine" ADD CONSTRAINT "AccountingJournalLine_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "AccountingJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountingJournalLine" ADD CONSTRAINT "AccountingJournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AccountingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
