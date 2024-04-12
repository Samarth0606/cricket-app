import { ShowScoreCard } from "./show-score-card";
import type { CurrentOverStats, MatchScoreCard } from "~/types";
import type { match_user, user } from "@prisma/client";
import FooterScoreCardWithMatchStats from "./footer-score-card-with-match-stats";
import type { SerializeFrom } from "@remix-run/node";

type FirstLoadSectionProps = {
  matchUser: SerializeFrom<match_user>;
  user: SerializeFrom<user>;
  matchScoreCard: MatchScoreCard | null;
  currentOverStats: CurrentOverStats | null;
  onTimerEnd: () => void;
};

export default function FirstLoadSection({
  matchScoreCard,
  user,
  currentOverStats,
  matchUser,
  onTimerEnd,
}: FirstLoadSectionProps) {
  return (
    <>
      <ShowScoreCard onTimerEnd={onTimerEnd} scoreCard={matchScoreCard} />
      {currentOverStats ? (
        <FooterScoreCardWithMatchStats
          currentOverStats={currentOverStats}
          user={user}
          matchUser={matchUser}
        />
      ) : null}
    </>
  );
}
