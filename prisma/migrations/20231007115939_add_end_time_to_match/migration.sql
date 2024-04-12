/*
  Warnings:

  - Added the required column `end_time` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" ADD COLUMN     "end_time" TIMESTAMPTZ(0) NOT NULL;
