-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "bank" TEXT NOT NULL,
    "account" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "debit" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountId" INTEGER,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
