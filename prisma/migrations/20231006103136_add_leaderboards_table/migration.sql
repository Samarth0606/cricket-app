-- CreateTable
CREATE TABLE "overall_leaderboard" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "match_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "total_runs" INTEGER NOT NULL DEFAULT 0,
    "total_balls_played" INTEGER NOT NULL DEFAULT 0,
    "total_wickets_fallen" INTEGER NOT NULL DEFAULT 0,
    "net_run_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "overall_leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "overall_leaderboard_user_id_key" ON "overall_leaderboard"("user_id");

-- AddForeignKey
ALTER TABLE "overall_leaderboard" ADD CONSTRAINT "overall_leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
