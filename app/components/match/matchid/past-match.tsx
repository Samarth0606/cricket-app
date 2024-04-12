import type { match, match_user, user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import MatchData from "./match-data";
import { Link } from "@remix-run/react";
import Button from "~/components/button";

export type PastMatchProps = {
  user: SerializeFrom<user> | null;
  match: SerializeFrom<match>;
  matchUser: SerializeFrom<match_user> | null;
};

export default function PastMatch({ user, match, matchUser }: PastMatchProps) {
  return (
    <MatchData match={match}>
      {user && matchUser ? (
        <Link to={`/match/${match.id}/${matchUser.id}`}>
          <Button clip={10} id="past-match/view-your-match-status">
            View your match stats
          </Button>
        </Link>
      ) : null}
    </MatchData>
  );
}
