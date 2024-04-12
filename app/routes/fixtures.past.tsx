import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getMatches,
  getMatchesWithMatchUsers,
} from "~/repositories/match.server";
import { authenticate } from "~/utils/auth.server";
import MatchDetails from "~/components/fixtures/match-details";
import MatchName from "~/components/fixtures/match-name";
import Button from "~/components/button";
import { isPastMatch } from "~/utils/match-filter";
import type { MatchesWithMatchUsers } from "~/types";
import MatchScore from "~/components/fixtures/match-score";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  if (user) {
    const matches: MatchesWithMatchUsers = await getMatchesWithMatchUsers(
      user.id
    );
    const pastMatches = matches.filter(isPastMatch);
    return json({
      user,
      matches: pastMatches,
    });
  }

  const matches = await getMatches();
  const pastMatches = matches.filter(isPastMatch);

  return json({
    user,
    matches: pastMatches,
  });
};

export default function PastFixtures() {
  const { user, matches } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="p-5 grid gap-y-4 lg:grid-cols-[1fr_2fr_1fr] border border-gray-3"
        >
          <MatchDetails match={match} />
          <div className="self-center justify-self-center">
            {user && "users" in match && match.users.length > 0 ? (
              <MatchScore
                matchUser={match.users[0]}
                user={user}
                showLiveChip={false}
              />
            ) : (
              <MatchName matchName={match.name} />
            )}
          </div>
          <div className="self-center justify-self-center">
            <Link to={`/match/${match.id}`}>
              <Button clip={10} id="fixtures-past/view-match">
                View match
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
