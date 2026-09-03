CREATE TYPE "ChequeRecordDirection" AS ENUM ('RECEIVED','ISSUED');
CREATE TYPE "ChequeRecordStatus" AS ENUM ('REGISTERED','DUE','CLEARED','BOUNCED','CANCELLED');
CREATE TYPE "ReconciliationRecordStatus" AS ENUM ('PENDING','MATCHED','REJECTED');

CREATE TABLE "ChequeRecord" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "counterpartyId" TEXT NOT NULL,
  "direction" "ChequeRecordDirection" NOT NULL,
  "chequeNumber" TEXT NOT NULL,
  "sayadId" TEXT,
  "bankName" TEXT,
  "accountReference" TEXT,
  "amount" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IRR',
  "issuedAt" TIMESTAMP(3) NOT NULL,
  "dueAt" TIMESTAMP(3) NOT NULL,
  "status" "ChequeRecordStatus" NOT NULL DEFAULT 'REGISTERED',
  "openBalanceId" TEXT,
  "treasuryAccountCode" TEXT,
  "clearedJournalId" TEXT,
  "createdBy" TEXT NOT NULL,
  "statusChangedBy" TEXT,
  "statusChangedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChequeRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BankEvidence" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "accountCode" TEXT NOT NULL,
  "externalRef" TEXT NOT NULL,
  "amount" BIGINT NOT NULL,
  "direction" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "description" TEXT,
  "status" "ReconciliationRecordStatus" NOT NULL DEFAULT 'PENDING',
  "matchedJournalId" TEXT,
  "confidenceScore" INTEGER,
  "decidedBy" TEXT,
  "decidedAt" TIMESTAMP(3),
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BankEvidence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChequeRecord_workspaceId_chequeNumber_key"
ON "ChequeRecord"("workspaceId","chequeNumber");
CREATE INDEX "ChequeRecord_workspaceId_status_dueAt_idx"
ON "ChequeRecord"("workspaceId","status","dueAt");
CREATE INDEX "ChequeRecord_counterpartyId_status_idx"
ON "ChequeRecord"("counterpartyId","status");
CREATE INDEX "ChequeRecord_openBalanceId_idx"
ON "ChequeRecord"("openBalanceId");

CREATE UNIQUE INDEX "BankEvidence_workspaceId_accountCode_externalRef_key"
ON "BankEvidence"("workspaceId","accountCode","externalRef");
CREATE INDEX "BankEvidence_workspaceId_status_occurredAt_idx"
ON "BankEvidence"("workspaceId","status","occurredAt");
CREATE INDEX "BankEvidence_matchedJournalId_idx"
ON "BankEvidence"("matchedJournalId");

ALTER TABLE "ChequeRecord"
ADD CONSTRAINT "ChequeRecord_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChequeRecord"
ADD CONSTRAINT "ChequeRecord_counterpartyId_fkey"
FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BankEvidence"
ADD CONSTRAINT "BankEvidence_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
