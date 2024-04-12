import {
  type LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  findMatchBallByIdOrThrow,
  getCurrentAndPreviousMatchBall,
  getCurrentMatchBall,
  getCurrentOverStats,
  handleMatchBallPlay,
  throwIfInvalidBallsPlayed,
  throwIfMatchBallALreadySubmitted,
  throwIfMatchBallNotCurrent,
  throwIfMatchNotInPlay,
  throwIfMatchUserNotOwnerToMatchBall,
  throwIfNotOwnerToMatchUser,
} from "~/repositories/match-ball.server";
import {
  findMatchUserByIdOrThrow,
  finishMatch,
  getScoreCard,
} from "~/repositories/match-user.server";
import { findMatchByIdOrThrow } from "~/repositories/match.server";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useIsFirstLoadOnMatchPlay } from "~/hooks/use-is-first-load-on-match-play";
import { authenticate } from "~/utils/auth.server";
import FirstLoadSection from "~/components/match/matchid/match-user-id/play/first-load-section";
import InBetweenSection from "~/components/match/matchid/match-user-id/play/in-between-section";
import PlaySection from "~/components/match/matchid/match-user-id/play/play-section";
import Container from "~/components/common/container";
import MatchFinishedSection from "~/components/match/matchid/match-user-id/play/play-finished-section";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const matchId = +params.matchid!;
  const matchUserId = +params.matchuserid!;

  const [user, match, matchUser] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(matchId),
    findMatchUserByIdOrThrow(matchUserId),
  ]);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // acl
  throwIfNotOwnerToMatchUser(matchUser, user);

  if (matchUser.status === "finished") {
    const [previous, matchScoreCard, currentOverStats] = await Promise.all([
      getCurrentMatchBall(matchUser),
      getScoreCard(match, user),
      getCurrentOverStats(matchUser),
    ]);
    return json({
      user,
      matchUser,
      previousMatchBall: previous,
      matchScoreCard,
      currentOverStats,
    });
  }

  throwIfInvalidBallsPlayed(matchUser);
  throwIfMatchNotInPlay(matchUser);

  // not doing `Promise.all` cause current over stats may depend on mutations done on `getCurrentAndPreviousMatchBall`
  const { current, previous } = await getCurrentAndPreviousMatchBall(matchUser);

  const [currentOverStats, matchScoreCard] = await Promise.all([
    getCurrentOverStats(matchUser),
    getScoreCard(match, user),
  ]);

  return json({
    user,
    matchBall: current,
    previousMatchBall: previous,
    currentOverStats,
    matchUser,
    matchScoreCard,
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...data } = Object.fromEntries(formData);
  const matchId = +params.matchid!;
  const matchUserId = +params.matchuserid!;

  const [user, match, matchUser, matchBall] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(matchId),
    findMatchUserByIdOrThrow(matchUserId),
    findMatchBallByIdOrThrow(+data.matchBallId),
  ]);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  switch (_action) {
    case "question-submission": {
      // acl
      throwIfMatchUserNotOwnerToMatchBall(matchBall, matchUser);
      throwIfNotOwnerToMatchUser(matchUser, user);
      throwIfMatchBallNotCurrent(matchBall);
      throwIfMatchBallALreadySubmitted(matchBall);
      throwIfMatchNotInPlay(matchUser);

      const choices = formData.getAll("choices");
      const { timeRemaining } = data;
      const previousUpdatedMatchBall = await handleMatchBallPlay(
        matchBall,
        matchUser,
        +timeRemaining,
        choices.map((choiceId) => +choiceId)
      );
      return {
        previousUpdatedMatchBall,
      };
    }
    case "finish-match": {
      // acl
      throwIfMatchUserNotOwnerToMatchBall(matchBall, matchUser);
      throwIfNotOwnerToMatchUser(matchUser, user);

      await finishMatch(matchUser);
      return redirect(`/match/${match.id}/${matchUser.id}`);
    }
    default: {
      return null;
    }
  }
};

export default function MatchUserPlay() {
  const { user, matchUser, matchScoreCard, currentOverStats, ...data } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { firstLoadState, updateFirstLoadState } = useIsFirstLoadOnMatchPlay();
  const [showMatchBallResult, setShowMatchBallResult] = useState<boolean>(true);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      return "";
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (actionData && "previousUpdatedMatchBall" in actionData) {
      setShowMatchBallResult(true);
    }
  }, [actionData]);

  if (firstLoadState === "FETHCING") return null;

  return (
    <Container user={user}>
      <div className="w-full h-[calc(100vh-5rem)] grid grid-cols-1 grid-rows-[1fr_70px]">
        {firstLoadState === "FIRST_LOAD" ? (
          <FirstLoadSection
            user={user}
            matchUser={matchUser}
            matchScoreCard={matchScoreCard}
            currentOverStats={currentOverStats}
            onTimerEnd={() => updateFirstLoadState("NO_FIRST_LOAD")}
          />
        ) : showMatchBallResult &&
          actionData &&
          "previousUpdatedMatchBall" in actionData &&
          !!actionData.previousUpdatedMatchBall ? (
          <InBetweenSection
            previousUpdatedMatchBall={actionData.previousUpdatedMatchBall}
            user={user}
            currentOverStats={currentOverStats}
            onTimerEnd={() => setShowMatchBallResult(false)}
          />
        ) : matchUser.status === "finished" ? (
          <MatchFinishedSection matchUser={matchUser} />
        ) : "matchBall" in data ? (
          <PlaySection
            matchBall={data.matchBall}
            user={user}
            matchUser={matchUser}
            currentOverStats={currentOverStats}
          />
        ) : null}
      </div>
    </Container>
  );
}
