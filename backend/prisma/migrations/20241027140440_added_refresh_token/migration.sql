-- CreateTable
CREATE TABLE "Refreshtoken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refreshtoken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Refreshtoken_userId_key" ON "Refreshtoken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Refreshtoken_token_key" ON "Refreshtoken"("token");
