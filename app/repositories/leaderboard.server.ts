import type { match_ball, match_user } from "@prisma/client";
import { db } from "~/utils/db.server";

const updateLeaderboardForMatchBall = async (
  matchBall: match_ball,
  matchUser: match_user
) => {
  const existingLeaderboard = await db.overall_leaderboard.findFirst({
    where: { user_id: matchUser.user_id },
  });

  if (existingLeaderboard) {
    await db.overall_leaderboard.update({
      data: {
        total_runs: +existingLeaderboard.total_runs + +matchBall.score,
        total_balls_played: +existingLeaderboard.total_balls_played + 1,
        ...(matchBall.value == "wicket"
          ? {
              total_wickets_fallen:
                existingLeaderboard.total_wickets_fallen + 1,
            }
          : {}),
      },
      where: {
        id: existingLeaderboard.id,
      },
    });
  } else {
    await db.overall_leaderboard.create({
      data: {
        total_balls_played: 1,
        total_runs: matchBall.score,
        total_wickets_fallen: matchBall.value == "wicket" ? 1 : 0,
        user: {
          connect: { id: matchUser.user_id },
        },
      },
    });
  }
};

export { updateLeaderboardForMatchBall };
