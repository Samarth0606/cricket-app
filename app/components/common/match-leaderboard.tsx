import type { SerializeFrom } from "@remix-run/node";
import Jersey from "../jersey";
import type { LeaderboardReturnType } from "~/types";
import { getOverFromBalls } from "~/utils/get-over-from-balls";
import { Link } from "@remix-run/react";

type MatchLeaderboardProps = {
  matchUsers: SerializeFrom<LeaderboardReturnType>["data"];
};

export default function MatchLeaderboard({
  matchUsers,
}: MatchLeaderboardProps) {
  return (
    <div>
      <div className="bg-purple-1 px-5 py-2 text-white font-bold text-sm uppercase  grid grid-cols-[50px_1fr]">
        <span>Pos</span>
        <div className="flex items-center space-x-3">
          <Jersey width="1.2rem" height="1.2rem" classes="invisible" />
          <span className="grow">Team</span>
          <span>Score</span>
        </div>
      </div>
      {matchUsers.map((matchUser, index) => (
        <div
          key={matchUser.id}
          className="grid grid-cols-[50px_1fr] text-purple-1 py-2 px-5 font-medium border-b border-b-gray-1"
        >
          <span>{index + 1}</span>
          <div className="flex items-center justify-between space-x-3">
            <Link className="flex space-x-3" to={`/user/${matchUser.user_id}`}>
              <Jersey
                width="1.2rem"
                height="1.2rem"
                primaryColor={matchUser.user.team_color?.split("/")[0]}
                secondaryColor={matchUser.user.team_color?.split("/")[1]}
              />
              <span className="grow font-bold">{matchUser.user.team_name}</span>
            </Link>
            <span className="space-x-2">
              <span>
                {matchUser.runs}/{matchUser.wickets_fallen}
              </span>
              <span className="text-gray-1 text-xs">
                Ov: {getOverFromBalls(matchUser.balls_played)}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
