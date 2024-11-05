/*
  Warnings:

  - The values [Milstone] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskType_new" AS ENUM ('Process', 'Milestone');
ALTER TABLE "GlobalAchievements" ALTER COLUMN "taskType" TYPE "TaskType_new" USING ("taskType"::text::"TaskType_new");
ALTER TYPE "TaskType" RENAME TO "TaskType_old";
ALTER TYPE "TaskType_new" RENAME TO "TaskType";
DROP TYPE "TaskType_old";
COMMIT;

-- AlterTable
ALTER TABLE "GlobalAchievements" ADD COLUMN     "occurrence" INTEGER;
