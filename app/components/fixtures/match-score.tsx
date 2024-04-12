import type { match_user, user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import Jersey from "../jersey";
import { getOverFromBalls } from "~/utils/get-over-from-balls";
import LiveChip from "../common/live-chip";

export default function MatchScore({
  matchUser,
  user,
  showLiveChip = true,
}: {
  matchUser: SerializeFrom<match_user>;
  user: SerializeFrom<user>;
  showLiveChip?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3">
          <Jersey
            width="32px"
            height="32px"
            primaryColor={
              user.team_color ? user.team_color.split("/")[0] : "#000"
            }
            secondaryColor={
              user.team_color ? user.team_color.split("/")[1] : "#000"
            }
          />
          <span className="text-purple-1 uppercase font-bold text-xl">
            {user.team_name}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-pink-1 font-bold text-xl">
            {matchUser.runs}/{matchUser.wickets_fallen}
          </span>
          <span className="text-gray-1 text-xs">
            Ov: {getOverFromBalls(matchUser.balls_played)}/5
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="w-8 h-8">
          <img src="/images/cb-small.jpeg" alt="CB logo" />
        </span>
        <span className="text-gray-1 uppercase font-bold text-xl">
          Coding Blocks
        </span>
      </div>
      {matchUser.status !== "finished" && showLiveChip ? (
        <div className="w-full flex justify-center">
          <LiveChip />
        </div>
      ) : null}
    </div>
  );
}
