-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showStats" BOOLEAN NOT NULL DEFAULT true;
