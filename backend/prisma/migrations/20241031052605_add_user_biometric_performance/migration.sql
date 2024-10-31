-- CreateTable
CREATE TABLE "UserBiometric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBiometric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBiometric_userId_key" ON "UserBiometric"("userId");

-- AddForeignKey
ALTER TABLE "UserBiometric" ADD CONSTRAINT "UserBiometric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
