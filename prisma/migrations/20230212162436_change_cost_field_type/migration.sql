/*
  Warnings:

  - Changed the type of `debit` on the `Cost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `credit` on the `Cost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cost" DROP COLUMN "debit",
ADD COLUMN     "debit" DOUBLE PRECISION NOT NULL,
DROP COLUMN "credit",
ADD COLUMN     "credit" DOUBLE PRECISION NOT NULL;
