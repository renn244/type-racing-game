-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('Male');

-- AlterTable
ALTER TABLE "Userinfo" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "socialMedias" TEXT[];
