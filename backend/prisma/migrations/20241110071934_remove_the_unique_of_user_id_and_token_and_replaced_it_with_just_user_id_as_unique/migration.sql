/*
  Warnings:

  - You are about to drop the column `multiFASecret` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `EmailTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmailTokens_userId_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "multiFASecret";

-- CreateIndex
CREATE UNIQUE INDEX "EmailTokens_userId_key" ON "EmailTokens"("userId");
