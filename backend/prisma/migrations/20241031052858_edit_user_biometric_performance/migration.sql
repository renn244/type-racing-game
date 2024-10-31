/*
  Warnings:

  - Added the required column `AverageAccuracy` to the `UserBiometric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AverageWpm` to the `UserBiometric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TimePracticed` to the `UserBiometric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBiometric" ADD COLUMN     "AverageAccuracy" INTEGER NOT NULL,
ADD COLUMN     "AverageWpm" INTEGER NOT NULL,
ADD COLUMN     "TimePracticed" DOUBLE PRECISION NOT NULL;
