import type { match_ball } from "@prisma/client";
import type { Question } from "./question";

type MatchBallWithQuestion = match_ball & {
  question?: Partial<Pick<Question, "correctAnswers">> &
    Omit<Question, "correctAnswers">;
};

export type { MatchBallWithQuestion };
