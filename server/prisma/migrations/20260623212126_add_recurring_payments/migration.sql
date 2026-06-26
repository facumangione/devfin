-- CreateTable
CREATE TABLE "recurring_payments" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "totalInstallments" INTEGER,
    "paidInstallments" INTEGER NOT NULL DEFAULT 0,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "recurring_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recurring_payments" ADD CONSTRAINT "recurring_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_payments" ADD CONSTRAINT "recurring_payments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
