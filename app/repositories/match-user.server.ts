import type { match, match_user, match_user_tag, user } from "@prisma/client";
import { getTags } from "~/services/troublemaker.server";
import { CustomError } from "~/utils/custom-error";
import { db } from "~/utils/db.server";
import moment from "moment";
import { updateLeaderboardForMatchBall } from "./leaderboard.server";

const findMatchUserByIdOrThrow = async (id: number) => {
  const matchUser = await db.match_user.findUnique({
    where: {
      id,
    },
    include: {
      matchUserTags: true,
    },
  });

  if (!matchUser) {
    throw new CustomError("Match User not found", 404);
  }

  return matchUser;
};

const getMatchUser = async (match: match, user: user) => {
  return await db.match_user.findFirst({
    where: {
      match_id: match.id,
      user_id: user.id,
    },
    include: {
      matchUserTags: true,
    },
  });
};

/**
 * Register user for the given match
 * If already registered throw error
 */
const registerUser = async (match: match, user: user) => {
  const matchUser = await getMatchUser(match, user);

  if (matchUser !== null) {
    throw new CustomError("User already registered", 400);
  }

  return db.match_user.create({
    data: {
      match: {
        connect: {
          id: match.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
};

const getScoreCard = async (match: match, user: user) => {
  const matchUser = await db.match_user.findFirst({
    where: {
      match_id: match.id,
      user_id: user.id,
    },
    include: {
      matchUserTags: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!matchUser) {
    return null;
  }

  const runsAndBallsOfPlayers = await db.match_ball.groupBy({
    by: "tag_id",
    _sum: {
      score: true,
    },
    _count: {
      id: true,
    },
    where: {
      match_user_id: matchUser.id,
      submit_at: {
        not: null,
      },
    },
  });

  const foursOfPlayers = await db.match_ball.groupBy({
    by: "tag_id",
    _count: {
      id: true,
    },
    where: {
      match_user_id: matchUser.id,
      value: "four",
    },
  });

  const sixesOfPlayers = await db.match_ball.groupBy({
    by: "tag_id",
    _count: {
      id: true,
    },
    where: {
      match_user_id: matchUser.id,
      value: "six",
    },
  });

  let troublemakerTags = (
    await getTags({
      filter: {
        id: {
          $in: matchUser.matchUserTags.map((mut) => mut.tag_id),
        },
      },
      exclude: "questions,user",
      skipJsonApi: true,
    })
  ).data;

  let matchUserTagsWithStat = matchUser.matchUserTags.map((mut, index) => {
    const runsAndBalls = runsAndBallsOfPlayers.filter(
      (_) => _.tag_id === mut.tag_id
    )[0];
    const fours = foursOfPlayers.filter((_) => _.tag_id === mut.tag_id)[0];
    const sixes = sixesOfPlayers.filter((_) => _.tag_id === mut.tag_id)[0];

    return {
      runs: runsAndBalls?._sum.score || 0,
      balls: runsAndBalls?._count.id || 0,
      fours: fours?._count.id || 0,
      sixes: sixes?._count.id || 0,
      tag: {
        id: troublemakerTags.find((t) => t.id === mut.tag_id)!.id,
        name: troublemakerTags.find((t) => t.id === mut.tag_id)!.title,
      },
      status: mut.status,
    };
  });

  return matchUserTagsWithStat;
};

const handleCreateTeam = async (
  matchUser: match_user,
  selectedTags: string[],
  maxPlayersInMatch: number
) => {
  if (selectedTags.length > maxPlayersInMatch) {
    throw new Response("Bad Request", { status: 400 });
  }

  const matchUserTags: match_user_tag[] = selectedTags.map((tagId, index) => {
    let result: match_user_tag = {
      order: index + 1,
      tag_id: +tagId,
    } as match_user_tag;

    switch (index) {
      case 0:
        result.status = "striker";
        break;
      case 1:
        result.status = "non_striker";
        break;
      default:
        result.status = "stands";
        break;
    }

    return result;
  });

  // FIXME: do bulk update
  await Promise.all(
    matchUserTags.map((mut) =>
      db.match_user_tag.create({
        data: {
          order: mut.order,
          tag_id: mut.tag_id,
          status: mut.status,
          matchUser: {
            connect: {
              id: matchUser.id,
            },
          },
        },
      })
    )
  );
};

const finishMatch = async (matchUser: match_user) => {
  const currnetMatchBall = await db.match_ball.findFirst({
    where: {
      match_user_id: matchUser.id,
      is_current: true,
    },
    include: {
      matchUser: true,
    },
    orderBy: {
      number: "desc",
    },
  });

  if (!currnetMatchBall) {
    await db.match_user.update({
      where: {
        id: matchUser.id,
      },
      data: {
        status: "finished",
        end_time: moment().toDate(),
      },
    });
    return null;
  }

  if (!currnetMatchBall.submit_at) {
    if (currnetMatchBall.answer_choice_ids.length === 0) {
      await db.match_ball.update({
        data: {
          score: 0,
          value: "dot",
          submit_at: moment().toDate(),
        },
        where: {
          id: currnetMatchBall.id,
        },
      });
      await updateLeaderboardForMatchBall(currnetMatchBall, matchUser);
    }
  }

  const matchAggregations = await db.match_ball.aggregate({
    _sum: {
      score: true,
    },
    _max: {
      number: true,
    },
    where: {
      match_user_id: matchUser.id,
    },
  });

  const wicketsFallen = await db.match_ball.aggregate({
    _count: {
      _all: true,
    },
    where: {
      match_user_id: matchUser.id,
      value: "wicket",
    },
  });

  const totalBallsPlayed = matchAggregations._max.number || 0;
  const totalScore = matchAggregations._sum.score || 0;
  const totalOver =
    Math.floor(totalBallsPlayed / 6) + (totalBallsPlayed % 6) / 6;
  const runRate = Math.round((totalScore / totalOver) * 100) / 100;
  await db.match_user.update({
    data: {
      status: "finished",
      balls_played: currnetMatchBall.number,
      run_rate: runRate,
      wickets_fallen: wicketsFallen._count._all,
      end_time: moment().toDate(),
    },
    where: {
      id: matchUser.id,
    },
  });

  return null;
};

const getMatchUsersGivenUser = async (userId: number) => {
  return db.match_user.findMany({
    include: {
      match: true,
    },
    where: {
      user_id: userId,
    },
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });
};

export {
  registerUser,
  getMatchUser,
  findMatchUserByIdOrThrow,
  getScoreCard,
  handleCreateTeam,
  finishMatch,
  getMatchUsersGivenUser,
};
