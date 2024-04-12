import type { Prisma } from "@prisma/client";
import type { getOverallLeaderboard } from "~/repositories/overall.server";

type OverallLeaderboard = Prisma.PromiseReturnType<
  typeof getOverallLeaderboard
>;

export type { OverallLeaderboard };
