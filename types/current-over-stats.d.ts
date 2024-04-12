import type { match_ball_values } from "@prisma/client";

type CurrentOverStats = {
  striker: {
    runs: number | null;
    balls: number;
    tag: {
      id: number;
      name: string;
    } | null;
  } | null;
  non_striker: {
    runs: number | null;
    balls: number;
    tag: {
      id: number;
      name: string;
    } | null;
  } | null;
  balls: (match_ball_values | null)[];
};

export type { CurrentOverStats };
