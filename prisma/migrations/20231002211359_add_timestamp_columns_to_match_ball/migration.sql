/*
  Warnings:

  - Added the required column `updated_at` to the `match_ball` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match_ball" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "submit_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
