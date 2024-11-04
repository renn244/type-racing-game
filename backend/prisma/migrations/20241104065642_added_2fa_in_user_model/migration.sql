-- AlterTable
ALTER TABLE "User" ADD COLUMN     "multiFA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multiFASecret" TEXT;
