import type { SerializeFrom } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import type { LeaderboardReturnType } from "types";
import Jersey from "~/components/jersey";
import Button from "~/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getOverFromBalls } from "~/utils/get-over-from-balls";

type MatchLeaderboardProps = SerializeFrom<LeaderboardReturnType>;

export default function MatchLeaderboard({
  count,
  data,
}: MatchLeaderboardProps) {
  const [searchParams] = useSearchParams();
  const offset = searchParams.get("leaderboard-offset") || 0;
  const take = 10;
  return (
    <div className="p-10">
      <h2 className="text-pink-1 mb-5 flex items-center space-x-3">
        <span className="font-bold text-xl">Leaderboard</span>
        <span>({count} teams)</span>
      </h2>
      <div className="bg-pink-1 px-5 text-white font-bold text-sm uppercase  grid grid-cols-[50px_1fr_100px]">
        <span>Pos</span>
        <div className="flex items-center space-x-3">
          <Jersey width="1.2rem" height="1.2rem" classes="invisible" />
          <span className="grow">Team</span>
        </div>
        <span>Score</span>
      </div>
      {data.map((d, index) => (
        <div
          key={d.id}
          className="grid grid-cols-[50px_1fr_100px] text-purple-1 py-2 px-5 font-medium border-b border-b-gray-1"
        >
          <span>{+offset + index + 1}</span>
          <Link to={`/user/${d.user.id}`}>
            <div className="flex items-center space-x-3">
                <Jersey
                  width="1.2rem"
                  height="1.2rem"
                  primaryColor={d.user.team_color?.split("/")[0]}
                  secondaryColor={d.user.team_color?.split("/")[1]}
                />
                <span className="grow font-bold">{d.user.team_name}</span>
            </div>
          </Link>
          <span className="space-x-2">
            <span>
              {d.runs}/{d.wickets_fallen}
            </span>
            <span className="text-gray-1 text-xs">
              Ov: {getOverFromBalls(d.balls_played)}
            </span>
          </span>
        </div>
      ))}
      <div className="w-full flex items-center justify-end mt-5">
        <Link to={`?leaderboard-offset=${+offset - take}`}>
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
        <Link to={`?leaderboard-offset=${+offset + take}`}>
          <Button color="pink" clip={0} disabled={+offset + take >= count}>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-white w-5 h-5"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}
