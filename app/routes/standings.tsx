import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import {
  getOverallLeaderboard,
  getOverallStats,
} from "~/repositories/overall.server";
import Button from "~/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { authenticate } from "~/utils/auth.server";
import Container from "~/components/common/container";
import OverallLeaderboard from "~/components/common/overall-leaderboard";
import OverallLeaderboardWithLoginPrompt from "~/components/common/overall-leaderboard-with-login-prompt";
import HowToPlay from "~/components/common/how-to-play";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset") || 0;
  const take = 10;
  const [user, leaderboard, overallStats] = await Promise.all([
    authenticate(request),
    getOverallLeaderboard(take, +offset),
    getOverallStats(),
  ]);

  if (user === null) {
    return json({
      user,
      leaderboard: {
        count: leaderboard.count,
        data: leaderboard.data.slice(0, 3),
      },
      overallStats,
    });
  }

  return json({
    user,
    leaderboard,
    overallStats,
  });
};

export default function Standings() {
  const { user, leaderboard, overallStats } = useLoaderData<typeof loader>();
  const { count } = leaderboard;
  const [searchParams] = useSearchParams();
  const offset = searchParams.get("offset") || 0;
  const take = 10;

  if (!user) {
    return (
      <Container user={user} title="Standings">
        <div className="p-10">
          <h2 className="text-pink-1 mb-5 flex items-center space-x-3 text-3xl font-bold">
            {count} <span className="text-purple-1">&nbsp;Teams</span>
          </h2>
          <OverallLeaderboardWithLoginPrompt
            leaderboard={leaderboard}
            offset={+offset}
          />
        </div>
        <div className="p-10">
          <h1 className="text-3xl font-bold mb-8">
            <span className="text-pink-1">Tournament</span>{" "}
            <span className="text-purple-1">Statistics</span>
          </h1>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap">
              <div className="py-6 px-5 flex flex-col justify-between bg-purple-1">
                <h3 className="text-pink-1 font-bold">
                  Matches <br /> Played
                </h3>
                <h1 className="text-6xl text-white font-bold font-cwc-india">
                  {overallStats.total_matches_played}
                </h1>
              </div>
              <div className="py-6 px-5 flex flex-col justify-between bg-pink-1">
                <h3 className="text-purple-1 font-bold">Fours</h3>
                <h1 className="text-6xl text-white font-bold font-cwc-india">
                  {overallStats.total_fours}
                </h1>
              </div>
              <div className="py-6 px-5 flex flex-col justify-between bg-yellow-1">
                <h3 className="text-pink-1 font-bold">Sixes</h3>
                <h1 className="text-6xl text-white font-bold font-cwc-india">
                  {overallStats.total_sixes}
                </h1>
              </div>
              <div className="py-6 px-5 flex flex-col justify-between bg-red-1">
                <h3 className="text-purple-1 font-bold">Wickets</h3>
                <h1 className="text-6xl text-white font-bold font-cwc-india">
                  {overallStats.total_wickets}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <HowToPlay />
      </Container>
    );
  }

  return (
    <Container user={user} title="Standings">
      <div className="p-10">
        <h2 className="text-pink-1 mb-5 flex items-center space-x-3 text-3xl font-bold">
          {count} <span className="text-purple-1">&nbsp;Teams</span>
        </h2>
        <OverallLeaderboard leaderboard={leaderboard} offset={+offset} />
        <div className="w-full flex items-center justify-end mt-5">
          <Link to={`?offset=${+offset - take}`}>
            <Button
              color="pink"
              clip={0}
              className="border-r-2 border-r-white"
              disabled={+offset < take}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-white w-5 h-5"
              />
            </Button>
          </Link>
          <Link to={`?offset=${+offset + take}`}>
            <Button color="pink" clip={0} disabled={+offset + take >= count}>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-white w-5 h-5"
              />
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-pink-1">Tournament</span>{" "}
          <span className="text-purple-1">Statistics</span>
        </h1>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap">
            <div className="py-6 px-5 flex flex-col justify-between bg-purple-1">
              <h3 className="text-pink-1 font-bold">
                Matches <br /> Played
              </h3>
              <h1 className="text-6xl text-white font-bold font-cwc-india">
                {overallStats.total_matches_played}
              </h1>
            </div>
            <div className="py-6 px-5 flex flex-col justify-between bg-pink-1">
              <h3 className="text-purple-1 font-bold">Fours</h3>
              <h1 className="text-6xl text-white font-bold font-cwc-india">
                {overallStats.total_fours}
              </h1>
            </div>
            <div className="py-6 px-5 flex flex-col justify-between bg-yellow-1">
              <h3 className="text-pink-1 font-bold">Sixes</h3>
              <h1 className="text-6xl text-white font-bold font-cwc-india">
                {overallStats.total_sixes}
              </h1>
            </div>
            <div className="py-6 px-5 flex flex-col justify-between bg-red-1">
              <h3 className="text-purple-1 font-bold">Wickets</h3>
              <h1 className="text-6xl text-white font-bold font-cwc-india">
                {overallStats.total_wickets}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <HowToPlay />
    </Container>
  );
}
