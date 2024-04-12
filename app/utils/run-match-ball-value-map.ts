import type { match_ball_values } from "@prisma/client";

const runMatchBallValueMap: {
  [key: string]: match_ball_values;
} = {
  "1": "single",
  "2": "double",
  "3": "tripple",
  "4": "four",
  "5": "five",
  "6": "six",
};

export { runMatchBallValueMap };
