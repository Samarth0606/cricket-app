import type { match } from "@prisma/client";
import { CustomError } from "~/utils/custom-error";
import { db } from "~/utils/db.server";
import { isLiveMatch } from "~/utils/match-filter";

const findMatchByIdOrThrow = async (id: number) => {
  const match = await db.match.findUnique({
    where: {
      id,
    },
  });

  if (!match) {
    throw new CustomError("Match not found", 404);
  }

  return match;
};

const getMatchRegistrationCount = async (match: match) => {
  return await db.match_user.count({
    where: {
      match: {
        id: match.id,
      },
    },
  });
};

const getMatchRegistrations = async (match: match) => {
  const matchUsers = await db.match_user.findMany({
    where: {
      match: {
        id: match.id,
      },
    },
    include: {
      user: true,
    },
  });
  return matchUsers.map((mu) => mu.user);
};

const getUpcomingMatches = async () => {
  return db.match.findMany({
    where: {
      start_time: {
        gte: new Date(),
      },
    },
    take: 3,
  });
};

const getMatches = async () => {
  return db.match.findMany({ orderBy: { start_time: "asc" } });
};

const getMatchesWithMatchUsers = async (userId: number) => {
  return db.match.findMany({
    include: {
      users: {
        where: {
          user_id: userId,
        },
      },
    },
  });
};

const getMatchLeaderboard = async (
  matchId: number,
  take: number = 10,
  skip: number = 0
) => {
  const [count, matchUsers] = await db.$transaction([
    db.match_user.count({
      where: { match_id: matchId },
    }),
    db.match_user.findMany({
      where: {
        match_id: matchId,
      },
      include: {
        user: true,
      },
      orderBy: [
        { runs: "desc" },
        { wickets_fallen: "asc" },
        { balls_played: "asc" },
        { run_rate: "desc" },
      ],
      take,
      skip,
    }),
  ]);

  return { count, data: matchUsers };
};

const getTodayMatch = async () => {
  const matches = await getMatches();
  const todayMatch = matches.filter(isLiveMatch);
  if (todayMatch.length > 0) return todayMatch[0];
  return null;
};

const getUserRankForMatch = async (matchId: number, userId: number) => {
  const matchUsers = await db.match_user.findMany({
    where: {
      match_id: matchId,
    },
    orderBy: [
      { runs: "desc" },
      { wickets_fallen: "asc" },
      { balls_played: "asc" },
      { run_rate: "desc" },
    ],
  });
  let rank = 0;
  matchUsers.every((_, i) =>
    _.user_id === userId ? (rank = i + 1) && false : true
  );

  return rank;
};

export {
  findMatchByIdOrThrow,
  getMatchRegistrationCount,
  getMatchRegistrations,
  getUpcomingMatches,
  getMatches,
  getMatchesWithMatchUsers,
  getMatchLeaderboard,
  getTodayMatch,
  getUserRankForMatch,
};
