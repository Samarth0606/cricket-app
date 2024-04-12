import {
  getQuestionById,
  getQuestions,
  getTags,
  submitQuestionById,
} from "~/services/troublemaker.server";
import { CustomError } from "~/utils/custom-error";
import { db } from "~/utils/db.server";
import moment from "moment";
import type {
  match_ball,
  match_ball_values,
  match_user,
  match_user_tag,
  user,
} from "@prisma/client";
import type { MatchBallWithQuestion } from "~/types";
import { updateLeaderboardForMatchBall } from "./leaderboard.server";

/**
 * Throw if the logged in `user` is not the owner of `match_user`
 */
const throwIfNotOwnerToMatchUser = (matchUser: match_user, user: user) => {
  if (matchUser.user_id !== user.id) {
    throw new Response("User does not own the resource", { status: 400 });
  }
};

const throwIfMatchNotInPlay = (
  matchUser: match_user,
  message: string = "Match is not in play"
) => {
  if (matchUser.status != "in_play" && matchUser.balls_played !== 0) {
    throw new Response(message, {
      status: 400,
    });
  }
};

const throwIfInvalidBallsPlayed = (matchUser: match_user) => {
  if (matchUser.balls_played >= +process.env.MAX_BALLS_IN_MATCH!) {
    throw new Response("Max balls allowed in match have been played", {
      status: 400,
    });
  }
};

const throwIfMatchUserNotOwnerToMatchBall = (
  matchBall: match_ball,
  matchUser: match_user
) => {
  if (matchBall.match_user_id !== matchUser.id) {
    throw new Response("Match user is not owner to match ball", {
      status: 400,
    });
  }
};

const throwIfMatchBallNotCurrent = (matchBall: match_ball) => {
  if (!matchBall.is_current) {
    throw new Response("Submit is only allowed on current ball", {
      status: 400,
    });
  }
};

const throwIfMatchBallALreadySubmitted = (matchBall: match_ball) => {
  if (matchBall.submit_at) {
    throw new Response("Cannot submit already submitted ball", { status: 400 });
  }
};

const usedQuestionIdsForMatch = async (matchUserId: number) => {
  const matchBalls = await db.match_ball.findMany({
    where: {
      match_user_id: +matchUserId,
    },
    select: {
      question_id: true,
    },
  });
  return matchBalls.map((_) => _.question_id);
};

const getNewQuestionForMatch = async (matchUserId: number) => {
  const usedQuestionIds = await usedQuestionIdsForMatch(+matchUserId);

  const striker = await db.match_user_tag.findFirst({
    where: {
      match_user_id: +matchUserId,
      status: "striker",
    },
  });

  const newQuestion = await getQuestions({
    exclude: "quizzes,user",
    filter: {
      id: {
        $notIn: usedQuestionIds,
      },
    },
    filterRelationships: {
      tags: {
        id: {
          $in: [striker!.tag_id],
        },
      },
    },
    random: "si",
    skipJsonApi: true,
  });

  if (newQuestion.data.length === 0) {
    throw new CustomError("No new question available", 500);
  }

  newQuestion.data[0].tag_id = striker!.tag_id;
  return newQuestion.data[0];
};

const rotateStrike = async (matchUserId: number) => {
  const [striker, nonStriker] = await Promise.all([
    db.match_user_tag.findFirst({
      where: {
        match_user_id: matchUserId,
        status: "striker",
      },
    }),
    db.match_user_tag.findFirst({
      where: {
        match_user_id: matchUserId,
        status: "non_striker",
      },
    }),
  ]);
  return [
    db.match_user_tag.updateMany({
      data: {
        status: "non_striker",
      },
      where: {
        id: striker!.id,
      },
    }),
    db.match_user_tag.updateMany({
      data: {
        status: "striker",
      },
      where: {
        id: nonStriker!.id,
      },
    }),
  ];
};

const handlePlayerOut = async (
  matchUserId: number
): Promise<[any, boolean]> => {
  //returns true or false if next player available or not respectively
  const nextPlayer = await db.match_user_tag.findFirst({
    where: {
      match_user_id: matchUserId,
      status: "stands",
    },
    orderBy: {
      order: "asc",
    },
  });

  let transactionPromises = [];
  if (nextPlayer) {
    transactionPromises.push(
      db.match_user_tag.updateMany({
        data: {
          status: "out",
        },
        where: {
          match_user_id: matchUserId,
          status: "striker",
        },
      }),
      db.match_user_tag.update({
        data: {
          status: "striker",
        },
        where: {
          id: nextPlayer.id,
        },
      })
    );
    return [transactionPromises, true];
  } else {
    transactionPromises.push(
      db.match_user_tag.updateMany({
        data: {
          status: "out",
        },
        where: {
          match_user_id: matchUserId,
          status: "striker",
        },
      })
    );
    return [transactionPromises, false];
  }
};

const handleMatchBallPlay = async (
  matchBall: match_ball,
  matchUser: match_user,
  timeRemaining: number,
  markedChoices: number[]
) => {
  const now = moment();
  let matchBallValue: match_ball_values | null = null;
  let score = 0;
  let isNextPlayerAvailable = true;
  const transactionPromises = [];

  if (markedChoices && markedChoices.length) {
    const submitQuestionResult = (
      await submitQuestionById(matchBall.question_id, markedChoices)
    ).data;
    const isAnswerCorrect =
      submitQuestionResult?.incorrectlyAnswered?.length === 0 &&
      submitQuestionResult?.correctlyAnswered?.length !== undefined &&
      submitQuestionResult?.correctlyAnswered?.length > 0;
    if (isAnswerCorrect) {
      score = Math.floor(timeRemaining / 10) + 1;
      switch (score) {
        case 1:
          matchBallValue = "single";
          break;
        case 2:
          matchBallValue = "double";
          break;
        case 3:
          matchBallValue = "tripple";
          break;
        case 4:
          matchBallValue = "four";
          break;
        case 5:
          matchBallValue = "five";
          break;
        case 6:
          matchBallValue = "six";
          break;
      }
      if (
        matchBall.number % 6 != 0 &&
        (score === 1 || score === 3 || score === 5)
      ) {
        const rotateStrikePromises = await rotateStrike(
          matchBall.match_user_id
        );
        transactionPromises.push(...rotateStrikePromises);
      }
    } else {
      const [playerOutPromises, isNextPlayer] = await handlePlayerOut(
        matchBall.match_user_id
      );
      transactionPromises.push(...playerOutPromises);
      isNextPlayerAvailable = isNextPlayer;
      matchBallValue = "wicket";
    }
  } else {
    matchBallValue = "dot";
  }
  const updateMatchball = db.match_ball.update({
    data: {
      value: matchBallValue,
      score,
      submit_at: now.toDate(),
      time_remaining: timeRemaining,
      answer_choice_ids: markedChoices,
    },
    where: {
      id: matchBall.id,
    },
  });

  transactionPromises.push(updateMatchball);
  if (matchBall.number % 6 === 0 && score !== 1 && score !== 3 && score !== 5) {
    const rotateStrikePromises = await rotateStrike(matchBall.match_user_id);
    transactionPromises.push(...rotateStrikePromises);
  }
  await db.$transaction(transactionPromises);

  const matchAggregations = await db.match_ball.aggregate({
    _sum: {
      score: true,
    },
    _max: {
      number: true,
    },
    where: {
      match_user_id: matchBall.match_user_id,
    },
  });

  const wicketsFallen = await db.match_ball.aggregate({
    _count: {
      _all: true,
    },
    where: {
      match_user_id: matchBall.match_user_id,
      value: "wicket",
    },
  });

  const totalBallsPlayed = matchAggregations._max.number!;
  const totalScore = matchAggregations._sum.score!;
  const totalOver =
    Math.floor(totalBallsPlayed / 6) + (totalBallsPlayed % 6) / 6;
  const runRate = Math.round((totalScore / totalOver) * 100) / 100;
  const isMatchFinished =
    matchBall.number >= Number(process.env.MAX_BALLS_IN_MATCH) ||
    !isNextPlayerAvailable;
  await db.match_user.update({
    data: {
      runs: totalScore,
      wickets_fallen: wicketsFallen._count._all,
      balls_played: matchBall.number,
      run_rate: runRate,
      ...(isMatchFinished
        ? { status: "finished", end_time: now.toDate() }
        : {}),
    },
    where: { id: matchBall.match_user_id },
  });
  const updatedMatchball = await db.match_ball.findUnique({
    where: { id: matchBall.id },
  });
  await updateLeaderboardForMatchBall(updatedMatchball!, matchUser);
  return updatedMatchball;
};

const findMatchBallByIdOrThrow = async (matchBallId: number) => {
  const matchBall = await db.match_ball.findUnique({
    where: { id: matchBallId },
  });

  if (!matchBall) {
    throw new CustomError("Match Ball does not exist", 404);
  }
  return matchBall;
};

const getCurrentOverStats = async (matchUser: match_user) => {
  const offsetBall = matchUser.balls_played - (matchUser.balls_played % 6);
  const currentOverBalls = await db.match_ball.findMany({
    where: {
      match_user_id: matchUser.id,
      number: {
        gt: offsetBall,
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  const strikerNonStriker = await db.match_user_tag.findMany({
    where: {
      match_user_id: matchUser.id,
      OR: [
        {
          status: "striker",
        },
        {
          status: "non_striker",
        },
      ],
    },
  });

  const striker = strikerNonStriker.filter((_) => _.status == "striker")[0] as
    | match_user_tag
    | undefined;
  const nonStriker = strikerNonStriker.filter(
    (_) => _.status == "non_striker"
  )[0] as match_user_tag | undefined;

  let tagIds = [
    ...(striker ? [striker.tag_id] : []),
    ...(nonStriker ? [nonStriker.tag_id] : []),
  ];
  const batsmenStats = await db.match_ball.groupBy({
    by: "tag_id",
    _sum: {
      score: true,
    },
    _count: {
      id: true,
    },
    where: {
      match_user_id: matchUser.id,
      tag_id: {
        in: tagIds,
      },
      submit_at: {
        not: null,
      },
    },
  });

  const troublemakerTags = (
    await getTags({
      filter: {
        id: {
          $in: tagIds,
        },
      },
      exclude: "questions,user",
      skipJsonApi: true,
    })
  ).data;

  const strikerStats = striker
    ? batsmenStats.filter((_) => _.tag_id === striker.tag_id)[0]
    : null;
  const nonStrikerStats = nonStriker
    ? batsmenStats.filter((_) => _.tag_id === nonStriker.tag_id)[0]
    : null;

  const ballValues = currentOverBalls
    ? currentOverBalls.map((_) => _.value)
    : [];
  return {
    striker: strikerStats
      ? {
          runs: strikerStats._sum.score,
          balls: strikerStats._count.id,
          tag: {
            id: troublemakerTags.find((t) => t.id === striker!.tag_id)!.id,
            name: troublemakerTags.find((t) => t.id === striker!.tag_id)!.title,
          },
        }
      : {
          runs: 0,
          balls: 0,
          tag: striker
            ? {
                id: troublemakerTags.find((t) => t.id === striker.tag_id)!.id,
                name: troublemakerTags.find((t) => t.id === striker.tag_id)!
                  .title,
              }
            : null,
        },
    non_striker: nonStrikerStats
      ? {
          runs: nonStrikerStats._sum.score,
          balls: nonStrikerStats._count.id,
          tag: {
            id: troublemakerTags.find((t) => t.id === nonStriker!.tag_id)!.id,
            name: troublemakerTags.find((t) => t.id === nonStriker!.tag_id)!
              .title,
          },
        }
      : {
          runs: 0,
          balls: 0,
          tag: nonStriker
            ? {
                id: troublemakerTags.find((t) => t.id === nonStriker.tag_id)!
                  .id,
                name: troublemakerTags.find((t) => t.id === nonStriker.tag_id)!
                  .title,
              }
            : null,
        },
    balls: ballValues,
  };
};

const getCurrentMatchBall = async (matchUser: match_user) => {
  const currentMatchBall: MatchBallWithQuestion | null =
    await db.match_ball.findFirst({
      where: {
        match_user_id: matchUser.id,
        is_current: true,
      },
      orderBy: {
        number: "desc",
      },
    });
  if (!currentMatchBall) {
    return null;
  }
  const question = (
    await getQuestionById(currentMatchBall.question_id, {
      exclude: "quizzes,tags",
    })
  ).data;
  delete question.correctAnswers;
  currentMatchBall.question = question;
  return currentMatchBall;
};

const getCurrentAndPreviousMatchBall = async (matchUser: match_user) => {
  const newQuestion = await getNewQuestionForMatch(matchUser.id);
  const currentMatchBall = await db.match_ball.findFirst({
    where: {
      match_user_id: matchUser.id,
      is_current: true,
    },
    orderBy: {
      number: "desc",
    },
  });

  let isThisHattrickBall = false;
  let updateCurrentBallIsCurrent = null;
  let prevMatchBall: match_ball | null = null;

  if (currentMatchBall && !currentMatchBall.submit_at) {
    if (currentMatchBall.answer_choice_ids.length === 0) {
      await db.match_ball.update({
        data: {
          submit_at: moment().toDate(),
          value: "dot",
          score: 0,
        },
        where: { id: currentMatchBall.id },
      });
      await updateLeaderboardForMatchBall(currentMatchBall, matchUser);
    }
  }

  if (currentMatchBall && currentMatchBall.value == "wicket") {
    prevMatchBall = await db.match_ball.findFirst({
      where: {
        match_user_id: matchUser.id,
        number: currentMatchBall.number - 1,
      },
    });
    if (!!prevMatchBall && prevMatchBall.value == "wicket")
      isThisHattrickBall = true;
  }
  if (currentMatchBall) {
    if (currentMatchBall.number >= +process.env.MAX_BALLS_IN_MATCH!) {
      throw new CustomError("Looks nasty: Max numbers of balls played", 403);
    }
    updateCurrentBallIsCurrent = db.match_ball.update({
      data: {
        is_current: false,
      },
      where: { id: currentMatchBall.id },
    });
  }
  const createMatchBall = db.match_ball.create({
    data: {
      matchUser: {
        connect: { id: matchUser.id },
      },
      number: currentMatchBall ? +currentMatchBall.number + 1 : 1,
      tag_id: +newQuestion.tag_id,
      question_id: +newQuestion.id,
      is_hattrick_ball: isThisHattrickBall,
      is_current: true,
    },
  });

  let newMatchBall: MatchBallWithQuestion;
  if (updateCurrentBallIsCurrent) {
    const transactionResult = await db.$transaction([
      updateCurrentBallIsCurrent,
      createMatchBall,
    ]);
    newMatchBall = transactionResult[1];
  } else {
    const updateMatchUserStatus = db.match_user.update({
      data: { status: "in_play", start_time: moment().toDate() },
      where: { id: matchUser.id },
    });
    const transactionResult = await db.$transaction([
      updateMatchUserStatus,
      createMatchBall,
    ]);
    newMatchBall = transactionResult[1];
  }

  newMatchBall.question = newQuestion;
  delete newMatchBall.question.correctAnswers;
  return { current: newMatchBall, previous: prevMatchBall };
};

export {
  throwIfMatchBallNotCurrent,
  throwIfMatchBallALreadySubmitted,
  throwIfMatchUserNotOwnerToMatchBall,
  usedQuestionIdsForMatch,
  getNewQuestionForMatch,
  handleMatchBallPlay,
  findMatchBallByIdOrThrow,
  getCurrentOverStats,
  getCurrentAndPreviousMatchBall,
  getCurrentMatchBall,
  throwIfNotOwnerToMatchUser,
  throwIfMatchNotInPlay,
  throwIfInvalidBallsPlayed,
};
