/*
  Warnings:

  - You are about to drop the column `Keyboardlayout` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "Keyboardlayout",
ADD COLUMN     "keyboardLayout" TEXT NOT NULL DEFAULT 'qwerty';
