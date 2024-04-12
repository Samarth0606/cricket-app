import type { CurrentOverStats, MatchBallWithQuestion } from "~/types";
import { Play } from "./play";
import type { SerializeFrom } from "@remix-run/node";
import FooterScoreCardWithMatchStats from "./footer-score-card-with-match-stats";
import type { match_user, user } from "@prisma/client";

type PlaySectionProps = {
  matchBall: SerializeFrom<MatchBallWithQuestion>;
  currentOverStats: CurrentOverStats;
  user: SerializeFrom<user>;
  matchUser: SerializeFrom<match_user>;
};

export default function PlaySection({
  matchBall,
  currentOverStats,
  user,
  matchUser,
}: PlaySectionProps) {
  return (
    <>
      <Play matchBall={matchBall} />
      <FooterScoreCardWithMatchStats
        currentOverStats={currentOverStats}
        user={user}
        matchUser={matchUser}
      />
    </>
  );
}
