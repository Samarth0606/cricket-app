import type { match_user_tag_status } from "@prisma/client";
import type { Tag } from "./tag";

type MatchScoreCard = {
  runs: number;
  balls: number;
  tag: Tag;
  fours: number;
  sixes: number;
  status: match_user_tag_status;
}[];

export type { MatchScoreCard };
