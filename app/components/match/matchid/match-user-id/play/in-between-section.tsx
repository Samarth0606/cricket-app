import reactTimerHook from "react-timer-hook";
import { useMemo } from "react";
import type { match_ball, user } from "@prisma/client";
import { getRandomGif } from "~/utils/gifs";
import FooterScoreCard from "../../footer-score-card";
import type { CurrentOverStats } from "~/types";
import type { SerializeFrom } from "@remix-run/node";
import { motion } from "framer-motion";

type InBetweenSectionProps = {
  onTimerEnd: () => void;
  previousUpdatedMatchBall: SerializeFrom<match_ball>;
  currentOverStats: CurrentOverStats | null;
  user: SerializeFrom<user>;
};

export default function InBetweenSection({
  previousUpdatedMatchBall,
  onTimerEnd,
  currentOverStats,
  user,
}: InBetweenSectionProps) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3);
  reactTimerHook.useTimer({
    expiryTimestamp: time,
    onExpire: onTimerEnd,
  });
  const gif = useMemo(
    () => getRandomGif(previousUpdatedMatchBall.value!),
    [previousUpdatedMatchBall]
  );
  return (
    <>
      <div className="w-full h-full pointer-events-none relative">
        <iframe
          src={`https://giphy.com/embed/${gif}`}
          width="100%"
          height="100%"
          style={{ position: "absolute" }}
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
          title="Score animation gif"
        ></iframe>
      </div>
      {previousUpdatedMatchBall.number % 6 === 0 ? (
        <div className="w-full h-full pointer-events-none relative">
          <motion.p
            animate={{ scale: 1.5 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              repeatType: "reverse",
            }}
            className="absolute bottom-40 right-10 bg-yellow-1 text-purple-1 font-bold p-2 uppercase text-xl"
          >
            Over finished
          </motion.p>
        </div>
      ) : null}
      {currentOverStats ? (
        <FooterScoreCard
          currentOverStats={currentOverStats}
          user={user}
          matchBallValue={previousUpdatedMatchBall.value}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white font-cwc-india w-full h-full flex items-center justify-center uppercase text-4xl"
          >
            {previousUpdatedMatchBall.value}
          </motion.div>
        </FooterScoreCard>
      ) : null}
    </>
  );
}
