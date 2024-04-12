import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import {
  getMatches,
  getMatchesWithMatchUsers,
} from "~/repositories/match.server";
import { authenticate } from "~/utils/auth.server";
import MatchDetails from "~/components/fixtures/match-details";
import MatchName from "~/components/fixtures/match-name";
import Button from "~/components/button";
import { isLiveMatch } from "~/utils/match-filter";
import type { MatchesWithMatchUsers } from "~/types";
import MatchScore from "~/components/fixtures/match-score";
import LoginButton from "~/components/common/login-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  if (user) {
    const matches: MatchesWithMatchUsers = await getMatchesWithMatchUsers(
      user.id
    );
    const liveMatches = matches.filter(isLiveMatch);
    return json({
      user,
      matches: liveMatches,
    });
  }

  const matches = await getMatches();
  const liveMatches = matches.filter(isLiveMatch);

  return json({
    user,
    matches: liveMatches,
  });
};

export default function LiveFixtures() {
  const { user, matches } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

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
              <MatchScore matchUser={match.users[0]} user={user} />
            ) : (
              <MatchName matchName={match.name} />
            )}
          </div>
          <div className="self-center justify-self-center">
            {!user ? (
              <LoginButton clip={10}>Login and start playing</LoginButton>
            ) : (
              <Link to={`/match/${match.id}`}>
                <Button id="fixtures-live/view-match">View match</Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
