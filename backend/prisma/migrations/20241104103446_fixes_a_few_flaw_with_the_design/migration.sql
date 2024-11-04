/*
  Warnings:

  - Added the required column `taskType` to the `GlobalAchievements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('Process', 'Milstone');

-- AlterTable
ALTER TABLE "GlobalAchievements" ADD COLUMN     "taskType" "TaskType" NOT NULL;
