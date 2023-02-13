/*
  Warnings:

  - A unique constraint covering the columns `[accountId,date,debit,credit,currency,description]` on the table `Cost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cost_accountId_date_debit_credit_currency_description_key" ON "Cost"("accountId", "date", "debit", "credit", "currency", "description");
