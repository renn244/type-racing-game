/*
  Warnings:

  - The values [EASY,MEDIUM,HARD] on the enum `Difficulty` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participants` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeCategory" AS ENUM ('Featured', 'Daily', 'Practice');

-- AlterEnum
BEGIN;
CREATE TYPE "Difficulty_new" AS ENUM ('Easy', 'Medium', 'Hard');
ALTER TABLE "Challenge" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TYPE "Difficulty" RENAME TO "Difficulty_old";
ALTER TYPE "Difficulty_new" RENAME TO "Difficulty";
DROP TYPE "Difficulty_old";
COMMIT;

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "category" "ChallengeCategory" NOT NULL,
ADD COLUMN     "participants" BIGINT NOT NULL;
