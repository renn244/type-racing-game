/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_title_key" ON "Challenge"("title");
