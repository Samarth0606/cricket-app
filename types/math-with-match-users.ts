import type { Prisma } from "@prisma/client";
import { type getMatchesWithMatchUsers } from "~/repositories/match.server";

type MatchesWithMatchUsers = Prisma.PromiseReturnType<
  typeof getMatchesWithMatchUsers
>;

export type { MatchesWithMatchUsers };
