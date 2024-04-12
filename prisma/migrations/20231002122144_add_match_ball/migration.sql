-- CreateEnum
CREATE TYPE "match_ball_values" AS ENUM ('single', 'double', 'tripple', 'four', 'five', 'six', 'dot', 'wicket');

-- CreateTable
CREATE TABLE "match_ball" (
    "id" SERIAL NOT NULL,
    "match_user_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_choice_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "is_hattrick_ball" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "value" "match_ball_values",
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "time_elapsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "match_ball_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "match_ball_match_user_id_question_id_key" ON "match_ball"("match_user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_ball_match_user_id_number_key" ON "match_ball"("match_user_id", "number");

-- AddForeignKey
ALTER TABLE "match_ball" ADD CONSTRAINT "match_ball_match_user_id_fkey" FOREIGN KEY ("match_user_id") REFERENCES "match_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
