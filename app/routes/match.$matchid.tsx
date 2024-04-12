import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/utils/auth.server";
import {
  findMatchByIdOrThrow,
  getMatchLeaderboard,
} from "~/repositories/match.server";
import UpcomingMatch from "~/components/match/matchid/upcoming-match";
import TodayMatch from "~/components/match/matchid/today-match";
import { getMatchUser } from "~/repositories/match-user.server";
import Container from "~/components/common/container";
import PastMatch from "~/components/match/matchid/past-match";
import { isPastMatch, isUpcomingMatch } from "~/utils/match-filter";
import MatchLeaderboard from "~/components/match/matchid/match-leaderboard";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const matchId = params.matchid!;
  const url = new URL(request.url);
  const leaderboardOffset = url.searchParams.get("leaderboard-offset");
  const take = 10;
  const [user, match] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(+matchId),
  ]);
  const [matchUser, leaderboard] = await Promise.all([
    user ? getMatchUser(match, user) : Promise.resolve(null),
    getMatchLeaderboard(
      match.id,
      take,
      leaderboardOffset ? +leaderboardOffset : 0
    ),
  ]);

  if (isPastMatch(match)) {
    return json({
      past: true,
      user,
      match,
      matchUser,
      leaderboard,
    });
  }

  if (isUpcomingMatch(match)) {
    return json({
      upcoming: true,
      user,
      match,
      matchUser,
      leaderboard,
    });
  }

  return json({
    live: true,
    user,
    match,
    matchUser,
    leaderboard,
  });
};

export default function Match() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container user={data.user}>
      <div className="w-screen h-[calc(100vh-5rem)] grid lg:grid-cols-2">
        <div className="w-full h-full bg-purple-2">
          {"past" in data ? (
            <PastMatch
              user={data.user}
              match={data.match}
              matchUser={"matchUser" in data ? data.matchUser : null}
            />
          ) : null}
          {"upcoming" in data ? <UpcomingMatch {...data} /> : null}
          {"live" in data ? <TodayMatch {...data} /> : null}
        </div>
        <div className="w-full h-full bg-white">
          <MatchLeaderboard {...data.leaderboard} />
        </div>
      </div>
    </Container>
  );
}
