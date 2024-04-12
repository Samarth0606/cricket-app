import type { match_user, user } from "@prisma/client";
import FooterScoreCard from "../../footer-score-card";
import type { CurrentOverStats } from "~/types";
import type { SerializeFrom } from "@remix-run/node";
import { getOverFromBalls } from "~/utils/get-over-from-balls";

export type FooterScoreCardWithMatchStatsProps = {
  user: SerializeFrom<user>;
  matchUser: SerializeFrom<match_user>;
  currentOverStats: CurrentOverStats;
};

export default function FooterScoreCardWithMatchStats({
  user,
  matchUser,
  currentOverStats,
}: FooterScoreCardWithMatchStatsProps) {
  return (
    <FooterScoreCard currentOverStats={currentOverStats} user={user}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center justify-center space-x-3 mt-2">
          <p className="font-cwc-india text-xl font-bold text-white">
            {user.team_name?.split(" ").map((w) => w[0])}
          </p>
          <p className="bg-pink-1 clip-path-polygon-[10%_0%,90%_0%,100%_50%,90%_100%,10%_100%,0%_50%] text-white font-cwc-india text-xl px-8">
            {matchUser.runs}-{matchUser.wickets_fallen}
          </p>
          <p className="text-white space-x-1 flex">
            <span className="text-lg font-medium">
              {getOverFromBalls(matchUser.balls_played)}
            </span>
            <span className="text-xs uppercase translate-y-2">Overs</span>
          </p>
        </div>
        <p className="uppercase text-white mt-1 space-x-2 -translate-x-4">
          <span className="font-medium font-cwc-india">RUN RATE</span>
          <span>{matchUser.run_rate}</span>
        </p>
      </div>
    </FooterScoreCard>
  );
}
