/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `UserSession` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserSession_refreshToken_key";

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "refreshToken",
ADD COLUMN     "refreshTokenHash" TEXT;
