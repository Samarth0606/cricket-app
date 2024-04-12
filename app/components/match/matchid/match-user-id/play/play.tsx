import reactTimerHook from "react-timer-hook";
import type { SerializeFrom } from "@remix-run/node";
import type { MatchBallWithQuestion } from "~/types";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleDot } from "@fortawesome/free-regular-svg-icons";
import Button from "~/components/button";
import MatchBallValue from "~/components/common/match-ball-value";
import { runMatchBallValueMap } from "~/utils/run-match-ball-value-map";
import EndInnings from "./end-innings-button";
import Markdown from "react-markdown";
import clsx from "clsx";
import { motion } from "framer-motion";

type PlayProps = {
  matchBall: SerializeFrom<MatchBallWithQuestion>;
};

export function Play({ matchBall }: PlayProps) {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <div className={clsx("grid lg:grid-cols-2 mb-36 lg:mb-0 p-10 h-full")}>
        <div className="bg-purple-2 text-white p-10 space-y-5 lg:h-[70vh] lg:overflow-y-auto">
          <h2 className="bg-gray-600 opacity-20 h-16 animate-pulse"></h2>
          <h3 className="bg-gray-600 opacity-20 h-10 animate-pulse"></h3>
          <h4 className="text-lg"></h4>
        </div>
        <div className="h-full">
          <Form method="post">
            <div className="lg:h-[calc(70vh-40px)] lg:overflow-y-auto flex flex-col py-10 lg:p-10">
              <div className="bg-gray-300 opacity-20 h-24 mb-4 animate-pulse"></div>
              <div className="bg-gray-300 opacity-20 h-24 mb-4 animate-pulse"></div>
              <div className="bg-gray-300 opacity-20 h-24 mb-4 animate-pulse"></div>
              <div className="bg-gray-300 opacity-20 h-24 mb-4 animate-pulse"></div>
            </div>
            <div className="flex w-full">
              <Button
                clip={0}
                type="button"
                value="question-submission"
                className="animate-pulse grow flex h-10 items-center justify-center space-x-2"
                style={{
                  background: `linear-gradient(90deg, var(--yellow-1), var(--yellow-1)`,
                }}
              ></Button>
            </div>
          </Form>
        </div>
      </div>
    );
  } else {
    return <PlayGround matchBall={matchBall} />;
  }
}

export function PlayGround({ matchBall }: PlayProps) {
  const time = new Date();
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "question-submission";

  const isFinishing =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "finish-match";

  time.setSeconds(time.getSeconds() + 60);
  const questionTimer = reactTimerHook.useTimer({
    expiryTimestamp: time,
    onExpire: handleQuestionTimerExpire,
  });

  function handleQuestionTimerExpire() {
    const formData = new FormData();
    formData.append("timeRemaining", "0");
    formData.append("matchBallId", String(matchBall.id));
    formData.append("_action", "question-submission");
    submit(formData, {
      method: "POST",
    });
  }

  if (questionTimer.seconds % 10 === 0 && questionTimer.seconds !== 0) {
    const formData = new FormData();
    formData.set("seconds", String(questionTimer.seconds));
    formData.set("_action", "update-time-elapsed");
    fetch("/api/match-ball", {
      method: "post",
      body: formData,
    });
  }

  const question = matchBall.question!;

  const [selectedChoice, setSelectedChoice] = useState<number>();

  return (
    <div
      className={clsx(
        "grid lg:grid-cols-2 mb-36 lg:mb-0 p-10 h-full",
        navigation.state === "loading"
          ? "pointer-events-none animate-pulse"
          : ""
      )}
    >
      <div className="bg-purple-2 text-white p-10 space-y-5 lg:h-[70vh] lg:overflow-y-auto">
        <h2 className="text-4xl font-bold">
          <Markdown>{question.title}</Markdown>
        </h2>
        <h3 className="text-lg font-medium">
          <Markdown>{question.description}</Markdown>
        </h3>
        <h4 className="text-lg">{question.explanation}</h4>
      </div>
      <div className="h-full">
        <Form
          method="post"
          onSubmit={(event) => {
            questionTimer.pause();
            submit(event.currentTarget);
          }}
        >
          <div className="lg:h-[calc(70vh-40px)] lg:overflow-y-auto flex flex-col space-y-5 py-10 lg:p-10">
            {question.choices.map((choice) => (
              <label
                key={choice.id}
                className="inline-block shadow-[0_0.4rem_1rem_0.1rem_rgba(47,47,47,.1)] p-5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="choices"
                  value={choice.id}
                  className="sr-only"
                  onClick={() => setSelectedChoice(choice.id)}
                />
                <div className="flex items-center space-x-5">
                  {selectedChoice === choice.id ? (
                    <FontAwesomeIcon
                      icon={faCircleDot}
                      className="text-pink-1 text-2xl w-6 h-6"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-purple-1 text-2xl w-6 h-6"
                    />
                  )}
                  <div className="flex flex-col text-purple-1">
                    <span className="text-lg font-bold">
                      <Markdown>{choice.title}</Markdown>
                    </span>
                    <span className="text-base font-medium">
                      {choice.description}
                    </span>
                  </div>
                </div>
              </label>
            ))}
            <input type="hidden" name="matchBallId" value={matchBall.id} />
            <input
              type="hidden"
              name="timeRemaining"
              value={questionTimer.seconds}
            />
          </div>
          <div className="flex w-full">
            <Button
              clip={0}
              type="submit"
              name="_action"
              value="question-submission"
              className="grow"
              style={{
                background: `linear-gradient(90deg, var(--yellow-1), var(--yellow-1) ${
                  (questionTimer.seconds / 60) * 100
                }%, var(--yellow-3) ${(questionTimer.seconds / 60) * 100}%)`,
              }}
              disabled={isSubmitting || isFinishing}
              id="match-ball-submit"
            >
              {isSubmitting ? (
                "Submitting"
              ) : (
                <motion.span
                  animate={{ scale: 1.5 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse",
                  }}
                  className="flex items-center justify-center space-x-2"
                >
                  <span>Submit for</span>
                  <MatchBallValue
                    matchBallValue={
                      runMatchBallValueMap[
                        Math.floor(questionTimer.seconds / 10) + 1
                      ]
                    }
                  />
                  <span>runs</span>
                </motion.span>
              )}
            </Button>
            <EndInnings
              handleBeforeOpen={() => {
                questionTimer.pause();
              }}
              handleBeforeClose={() => {
                questionTimer.resume();
              }}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
