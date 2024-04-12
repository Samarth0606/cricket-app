import type { Prisma } from "@prisma/client";
import type { getMatchLeaderboard } from "~/repositories/match.server";

type LeaderboardReturnType = Prisma.PromiseReturnType<
  typeof getMatchLeaderboard
>;
