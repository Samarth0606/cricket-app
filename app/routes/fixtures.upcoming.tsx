import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getMatchRegistrationCount,
  getMatches,
} from "~/repositories/match.server";
import { authenticate } from "~/utils/auth.server";
import MatchDetails from "~/components/fixtures/match-details";
import MatchName from "~/components/fixtures/match-name";
import Button from "~/components/button";
import { isUpcomingMatch } from "~/utils/match-filter";
import { getMatchUser } from "~/repositories/match-user.server";
import LoginButton from "~/components/common/login-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [user, matches] = await Promise.all([
    authenticate(request),
    getMatches(),
  ]);
  const upcomingMatches = matches.filter(isUpcomingMatch);

  if (user) {
    const isRegistered = (
      await Promise.all(
        upcomingMatches.map((match) => getMatchUser(match, user))
      )
    ).map((mu) => !!mu);
    const registrations = await Promise.all(
      upcomingMatches.map((match) => getMatchRegistrationCount(match))
    );

    return json({
      user,
      matches: upcomingMatches,
      isRegistered,
      registrations,
    });
  }

  return json({
    user,
    matches: upcomingMatches,
  });
};

export default function UpcomingFixtures() {
  const { user, matches, ...data } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-3">
      {matches.map((match, index) => (
        <div
          key={match.id}
          className="p-5 grid gap-y-4 lg:grid-cols-[1fr_2fr_1fr] border border-gray-3"
        >
          <MatchDetails match={match} />
          <div className="self-center justify-self-center flex flex-col items-center">
            <MatchName matchName={match.name} />
            {"registrations" in data ? (
              <span className="text-pink-1 font-medium uppercase">
                {data.registrations[index]} Registrations
              </span>
            ) : null}
          </div>
          <div className="self-center justify-self-center">
            {user ? (
              "isRegistered" in data && data.isRegistered[index] ? (
                <Button clip={10} disabled>
                  Already registered
                </Button>
              ) : (
                <Link
                  to={`/match/${match.id}`}
                  id="fixtures-upcoming/view-match"
                >
                  <Button>View match</Button>
                </Link>
              )
            ) : (
              <LoginButton clip={10}>Login and register</LoginButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
