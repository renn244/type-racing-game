/*
  Warnings:

  - Made the column `isFinished` on table `UserAchievement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserAchievement" ALTER COLUMN "isFinished" SET NOT NULL;
