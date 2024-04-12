import type { MatchScoreCard } from "~/types";
import reactTimerHook from "react-timer-hook";
import Button from "~/components/button";
import ScoreCard from "~/components/common/score-card";

export type ShowScoreCardProps = {
  onTimerEnd: () => void;
  scoreCard: MatchScoreCard | null;
};

export function ShowScoreCard({ onTimerEnd, scoreCard }: ShowScoreCardProps) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 10);
  const { seconds, pause } = reactTimerHook.useTimer({
    expiryTimestamp: time,
    onExpire: onTimerEnd,
  });
  const handleSkipTimer = () => {
    pause();
    onTimerEnd();
  };
  return (
    <div className="w-2/3 mx-auto p-10 space-y-5">
      <div>{scoreCard ? <ScoreCard scoreCard={scoreCard} /> : null}</div>
      <div className="flex items-center justify-end space-x-5">
        <p className="text-purpl-1 font-medium">
          Game will resume in {seconds} seconds
        </p>
        <Button onClick={handleSkipTimer}>Skip</Button>
      </div>
    </div>
  );
}
