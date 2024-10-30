-- DropForeignKey
ALTER TABLE "ChallengeCompleted" DROP CONSTRAINT "ChallengeCompleted_userId_fkey";

-- AddForeignKey
ALTER TABLE "ChallengeCompleted" ADD CONSTRAINT "ChallengeCompleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
