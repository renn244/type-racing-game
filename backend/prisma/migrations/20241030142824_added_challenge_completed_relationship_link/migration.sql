/*
  Warnings:

  - You are about to drop the `_ChallengeToUserinfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChallengeToUserinfo" DROP CONSTRAINT "_ChallengeToUserinfo_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeToUserinfo" DROP CONSTRAINT "_ChallengeToUserinfo_B_fkey";

-- DropTable
DROP TABLE "_ChallengeToUserinfo";

-- CreateTable
CREATE TABLE "ChallengeCompleted" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typed" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "dateCompleted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeCompleted_challengeId_userId_key" ON "ChallengeCompleted"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "ChallengeCompleted" ADD CONSTRAINT "ChallengeCompleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Userinfo"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeCompleted" ADD CONSTRAINT "ChallengeCompleted_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
