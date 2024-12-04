-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "challengeReminders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT false;
