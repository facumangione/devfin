-- AlterTable
ALTER TABLE "users" ADD COLUMN     "weeklyEmailDay" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "weeklyEmailEnabled" BOOLEAN NOT NULL DEFAULT true;
