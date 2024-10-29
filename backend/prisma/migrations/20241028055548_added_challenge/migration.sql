-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChallengeToUserinfo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_challenge_key" ON "Challenge"("challenge");

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToUserinfo_AB_unique" ON "_ChallengeToUserinfo"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToUserinfo_B_index" ON "_ChallengeToUserinfo"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeToUserinfo" ADD CONSTRAINT "_ChallengeToUserinfo_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToUserinfo" ADD CONSTRAINT "_ChallengeToUserinfo_B_fkey" FOREIGN KEY ("B") REFERENCES "Userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
