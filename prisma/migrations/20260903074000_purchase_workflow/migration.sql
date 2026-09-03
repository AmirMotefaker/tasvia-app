CREATE TYPE "PurchaseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'PAID', 'CANCELLED');

CREATE TABLE "PurchaseInvoice" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "subtotal" BIGINT NOT NULL,
    "discount" BIGINT NOT NULL DEFAULT 0,
    "tax" BIGINT NOT NULL DEFAULT 0,
    "total" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IRR',
    "createdBy" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "submittedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "postedJournalId" TEXT,
    "payableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseInvoiceLine" (
    "id" TEXT NOT NULL,
    "purchaseInvoiceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantityMinorUnits" BIGINT NOT NULL,
    "unitPrice" BIGINT NOT NULL,
    "discount" BIGINT NOT NULL DEFAULT 0,
    "tax" BIGINT NOT NULL DEFAULT 0,
    "lineTotal" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseInvoiceLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseStatusHistory" (
    "id" TEXT NOT NULL,
    "purchaseInvoiceId" TEXT NOT NULL,
    "fromStatus" "PurchaseStatus",
    "toStatus" "PurchaseStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "PurchaseStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PurchaseInvoice_workspaceId_invoiceNumber_key"
ON "PurchaseInvoice"("workspaceId", "invoiceNumber");

CREATE INDEX "PurchaseInvoice_workspaceId_status_issuedAt_idx"
ON "PurchaseInvoice"("workspaceId", "status", "issuedAt");

CREATE INDEX "PurchaseInvoice_supplierId_status_dueAt_idx"
ON "PurchaseInvoice"("supplierId", "status", "dueAt");

CREATE INDEX "PurchaseInvoice_warehouseId_issuedAt_idx"
ON "PurchaseInvoice"("warehouseId", "issuedAt");

CREATE INDEX "PurchaseInvoiceLine_purchaseInvoiceId_idx"
ON "PurchaseInvoiceLine"("purchaseInvoiceId");

CREATE INDEX "PurchaseInvoiceLine_itemId_idx"
ON "PurchaseInvoiceLine"("itemId");

CREATE INDEX "PurchaseStatusHistory_purchaseInvoiceId_changedAt_idx"
ON "PurchaseStatusHistory"("purchaseInvoiceId", "changedAt");

ALTER TABLE "PurchaseInvoice"
ADD CONSTRAINT "PurchaseInvoice_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PurchaseInvoice"
ADD CONSTRAINT "PurchaseInvoice_supplierId_fkey"
FOREIGN KEY ("supplierId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PurchaseInvoice"
ADD CONSTRAINT "PurchaseInvoice_warehouseId_fkey"
FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PurchaseInvoiceLine"
ADD CONSTRAINT "PurchaseInvoiceLine_purchaseInvoiceId_fkey"
FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PurchaseInvoiceLine"
ADD CONSTRAINT "PurchaseInvoiceLine_itemId_fkey"
FOREIGN KEY ("itemId") REFERENCES "CatalogItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PurchaseStatusHistory"
ADD CONSTRAINT "PurchaseStatusHistory_purchaseInvoiceId_fkey"
FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
