CREATE TYPE "SalesStatus" AS ENUM ('DRAFT','SUBMITTED','APPROVED','POSTED','PAID','CANCELLED');
CREATE TABLE "SalesInvoice" (
"id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"customerId" TEXT NOT NULL,"warehouseId" TEXT NOT NULL,
"invoiceNumber" TEXT NOT NULL,"status" "SalesStatus" NOT NULL DEFAULT 'DRAFT',"issuedAt" TIMESTAMP(3) NOT NULL,
"dueAt" TIMESTAMP(3) NOT NULL,"subtotal" BIGINT NOT NULL,"discount" BIGINT NOT NULL DEFAULT 0,"tax" BIGINT NOT NULL DEFAULT 0,
"total" BIGINT NOT NULL,"cogsTotal" BIGINT NOT NULL DEFAULT 0,"currency" TEXT NOT NULL DEFAULT 'IRR',"createdBy" TEXT NOT NULL,
"submittedAt" TIMESTAMP(3),"submittedBy" TEXT,"approvedAt" TIMESTAMP(3),"approvedBy" TEXT,"postedAt" TIMESTAMP(3),"postedBy" TEXT,
"cancelledAt" TIMESTAMP(3),"cancelledBy" TEXT,"postedJournalId" TEXT,"cogsJournalId" TEXT,"receivableId" TEXT,
"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
CONSTRAINT "SalesInvoice_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SalesInvoiceLine" (
"id" TEXT NOT NULL,"salesInvoiceId" TEXT NOT NULL,"itemId" TEXT NOT NULL,"quantityMinorUnits" BIGINT NOT NULL,
"unitPrice" BIGINT NOT NULL,"discount" BIGINT NOT NULL DEFAULT 0,"tax" BIGINT NOT NULL DEFAULT 0,"lineTotal" BIGINT NOT NULL,
"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "SalesInvoiceLine_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SalesStatusHistory" (
"id" TEXT NOT NULL,"salesInvoiceId" TEXT NOT NULL,"fromStatus" "SalesStatus","toStatus" "SalesStatus" NOT NULL,
"changedBy" TEXT NOT NULL,"changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"note" TEXT,
CONSTRAINT "SalesStatusHistory_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "SalesInvoice_workspaceId_invoiceNumber_key" ON "SalesInvoice"("workspaceId","invoiceNumber");
CREATE INDEX "SalesInvoice_workspaceId_status_issuedAt_idx" ON "SalesInvoice"("workspaceId","status","issuedAt");
CREATE INDEX "SalesInvoice_customerId_status_dueAt_idx" ON "SalesInvoice"("customerId","status","dueAt");
CREATE INDEX "SalesInvoice_warehouseId_issuedAt_idx" ON "SalesInvoice"("warehouseId","issuedAt");
CREATE INDEX "SalesInvoiceLine_salesInvoiceId_idx" ON "SalesInvoiceLine"("salesInvoiceId");
CREATE INDEX "SalesInvoiceLine_itemId_idx" ON "SalesInvoiceLine"("itemId");
CREATE INDEX "SalesStatusHistory_salesInvoiceId_changedAt_idx" ON "SalesStatusHistory"("salesInvoiceId","changedAt");
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesInvoiceLine" ADD CONSTRAINT "SalesInvoiceLine_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesInvoiceLine" ADD CONSTRAINT "SalesInvoiceLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CatalogItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesStatusHistory" ADD CONSTRAINT "SalesStatusHistory_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
