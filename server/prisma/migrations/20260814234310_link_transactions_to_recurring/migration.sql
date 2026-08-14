-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "recurringPaymentId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringPaymentId_fkey" FOREIGN KEY ("recurringPaymentId") REFERENCES "recurring_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
