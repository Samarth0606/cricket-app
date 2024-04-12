/*
  Warnings:

  - You are about to drop the column `time_elapsed` on the `match_ball` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_ball" DROP COLUMN "time_elapsed",
ADD COLUMN     "time_remaining" INTEGER NOT NULL DEFAULT 60;
