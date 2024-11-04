-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('WPM', 'Accuracy', 'Challenges');

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "goal" INTEGER NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "dateFinished" TIMESTAMP(3),

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_userId_id_key" ON "Achievements"("userId", "id");

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
