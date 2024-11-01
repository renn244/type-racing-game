/*
  Warnings:

  - You are about to drop the column `private` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "private",
ADD COLUMN     "privateProfile" BOOLEAN NOT NULL DEFAULT false;
