import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import Button from "~/components/button";
import Container from "~/components/common/container";
import LiveChip from "~/components/common/live-chip";
import ScoreCard from "~/components/common/score-card";
import Jersey from "~/components/jersey";
import MatchData from "~/components/match/matchid/match-data";
import SelectSquadForm from "~/components/match/matchid/match-user-id/select-squad-form";
import {
  findMatchUserByIdOrThrow,
  getScoreCard,
  handleCreateTeam,
} from "~/repositories/match-user.server";
import { findMatchByIdOrThrow } from "~/repositories/match.server";
import { getTodayTags } from "~/repositories/tags-blacklist-whitelist.server";
import { authenticate } from "~/utils/auth.server";
import { getOverFromBalls } from "~/utils/get-over-from-balls";
import { isLiveMatch } from "~/utils/match-filter";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const matchId = params.matchid!;
  const matchUserId = params.matchuserid!;

  const [user, match, matchUser, availableTags] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(+matchId),
    findMatchUserByIdOrThrow(+matchUserId),
    getTodayTags(),
  ]);

  if (!user) throw new Response("Unauthorized", { status: 401 });

  const scoreCard = await getScoreCard(match, user);

  return json({
    user,
    match,
    matchUser,
    availableTags,
    scoreCard,
    ENV: { MAX_PLAYERS_IN_MATCH: process.env.MAX_PLAYERS_IN_MATCH },
    isLive: isLiveMatch(match),
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const matchId = params.matchid!;
  const matchUserId = params.matchuserid!;

  const [, , matchUser] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(+matchId),
    findMatchUserByIdOrThrow(+matchUserId),
  ]);

  const selectedTags = formData.getAll("selectedTags") as string[];
  await handleCreateTeam(
    matchUser,
    selectedTags,
    +process.env.MAX_PLAYERS_IN_MATCH!
  );

  return null;
};

export default function MatchUser() {
  const { matchUser, availableTags, user, match, ENV, scoreCard, isLive } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <Container user={user}>
      <div className="w-screen h-[calc(100vh-5rem)] grid lg:grid-cols-2">
        <div className="w-full h-full max-w-[100vw] max-h-[calc(100vh-543m)] overflow-scroll bg-purple-2">
          <MatchData match={match}>
            <div className="text-pink-1 uppercase font-medium space-x-3 text-2xl flex flex-col items-center">
              <span>{user.team_name}</span>
              <span>V</span>
              <span>Coding Blocks</span>
            </div>
            <div className="flex items-center space-x-5">
              <Jersey
                width="5rem"
                height="5rem"
                primaryColor={user.team_color?.split("/")[0]}
                secondaryColor={user.team_color?.split("/")[1]}
              />
              <div className="flex flex-col">
                <span className="text-white text-[42px] font-medium">
                  {matchUser.runs}/{matchUser.wickets_fallen}
                </span>
                <span className="text-sm text-gray-1 font-medium">
                  {getOverFromBalls(matchUser.balls_played)} ov. RR.{" "}
                  {matchUser.run_rate}
                </span>
              </div>
              {matchUser.status !== "finished" ? <LiveChip /> : null}
            </div>
            {matchUser.matchUserTags.length === 0 ? (
              <Button
                disabled
                clip={5}
                id="match-user/create-your-team-to-start-playing"
              >
                Create your team to start playing
              </Button>
            ) : isLive && matchUser.status === "in_play" ? (
              <Link to={"play"}>
                <Button
                  id="match-user/resume-play"
                  disabled={navigation.state === "loading"}
                >
                  Resume play
                </Button>
              </Link>
            ) : isLive && matchUser.status === "not_started" ? (
              <Link to={"play"}>
                <Button
                  id="match-user/start-match"
                  disabled={navigation.state === "loading"}
                >
                  Start Match
                </Button>
              </Link>
            ) : null}
          </MatchData>
        </div>
        <div className="w-full h-full max-w-[100vw] max-h-[calc(100vh-543m)] overflow-scroll bg-white">
          {matchUser.matchUserTags.length === 0 ? (
            <div className="p-5">
              <SelectSquadForm
                user={user}
                availableTags={availableTags}
                maxPlayersInMatch={+ENV.MAX_PLAYERS_IN_MATCH!}
              />
            </div>
          ) : scoreCard ? (
            <div className="p-5">
              <ScoreCard scoreCard={scoreCard} />
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
