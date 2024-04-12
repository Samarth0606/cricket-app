/*
  Warnings:

  - Added the required column `start_time` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;
