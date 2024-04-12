import { db } from "~/utils/db.server";

const getOverallLeaderboard = async (take: number = 10, skip: number = 0) => {
  const [count, leaderboards] = await db.$transaction([
    db.overall_leaderboard.count(),
    db.overall_leaderboard.findMany({
      include: {
        user: true,
      },
      orderBy: [
        { total_runs: "desc" },
        { total_wickets_fallen: "asc" },
        { total_balls_played: "asc" },
        { net_run_rate: "desc" },
      ],
      skip,
      take,
    }),
  ]);
  return { count, data: leaderboards };
};

const getOverallStats = async () => {
  const matchBallStatsPromise = db.match_ball.groupBy({
    by: "value",
    _count: {
      value: true,
    },
  });
  const matchStatsPromise = db.match_user.count({
    where: {
      status: {
        not: "not_started",
      },
    },
  });

  const [matchBallStats, matchStats] = await Promise.all([
    matchBallStatsPromise,
    matchStatsPromise,
  ]);

  const sixesStats = matchBallStats.filter((_) => _.value == "six")[0];
  const foursStats = matchBallStats.filter((_) => _.value == "four")[0];
  const wicketsStats = matchBallStats.filter((_) => _.value == "wicket")[0];

  return {
    total_sixes: sixesStats?._count.value || 0,
    total_fours: foursStats?._count.value || 0,
    total_wickets: wicketsStats?._count.value || 0,
    total_matches_played: matchStats,
  };
};

const getOverallUserRank = async (userId: number) => {
  const overallLeaderboards = await db.overall_leaderboard.findMany({
    orderBy: [
      { total_runs: "desc" },
      { total_wickets_fallen: "asc" },
      { total_balls_played: "asc" },
      { net_run_rate: "desc" },
    ],
  });
  let rank = 0;
  overallLeaderboards.every((_, i) =>
    _.user_id === userId ? (rank = i + 1) && false : true
  );
  return rank;
};

const getOverallStatsForUser = async (userId: number) => {
  const matchUserIdsForUser = await db.match_user.findMany({
    select: {
      id: true,
    },
    where: {
      user_id: userId,
      status: {
        not: "not_started",
      },
    },
  });
  const matchBallStats = await db.match_ball.groupBy({
    by: "value",
    _count: {
      value: true,
    },
    where: {
      match_user_id: {
        in: matchUserIdsForUser.map((_) => _.id),
      },
    },
  });

  const sixesStats = matchBallStats.filter((_) => _.value == "six")[0];
  const foursStats = matchBallStats.filter((_) => _.value == "four")[0];
  const wicketsStats = matchBallStats.filter((_) => _.value == "wicket")[0];

  return {
    total_sixes: sixesStats?._count.value || 0,
    total_fours: foursStats?._count.value || 0,
    total_wickets: wicketsStats?._count.value || 0,
    total_matches_played: matchUserIdsForUser?.length || 0,
  };
};

export {
  getOverallLeaderboard,
  getOverallStats,
  getOverallUserRank,
  getOverallStatsForUser,
};
