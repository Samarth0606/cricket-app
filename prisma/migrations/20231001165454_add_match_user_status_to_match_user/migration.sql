-- CreateEnum
CREATE TYPE "match_user_status" AS ENUM ('not_started', 'in_play', 'paused', 'finished');

-- AlterTable
ALTER TABLE "match_user" ADD COLUMN     "status" "match_user_status" NOT NULL DEFAULT 'not_started';
