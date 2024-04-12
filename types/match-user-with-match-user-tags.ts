import type { Prisma } from "@prisma/client";
import type { getMatchUser } from "~/repositories/match-user.server";

type MatchUserWithMatchUserTags = Prisma.PromiseReturnType<typeof getMatchUser>;

export type { MatchUserWithMatchUserTags };
