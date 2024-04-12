import type { SerializeFrom } from "@remix-run/node";
import type { match, match_user, user } from "@prisma/client";
import Button from "~/components/button";
import MatchData from "./match-data";
import LoginButton from "~/components/common/login-button";
import { Link, useNavigation } from "@remix-run/react";
import { RegisterButton } from "~/routes/api.match.$matchid.register";

export type TodayMatchProps = {
  match: SerializeFrom<match>;
  user: SerializeFrom<user> | null;
  matchUser: SerializeFrom<match_user> | null;
};

export default function UpcomingMatch({
  match,
  user,
  matchUser,
}: TodayMatchProps) {
  const navigation = useNavigation();

  return (
    <MatchData match={match}>
      {!user ? (
        <LoginButton>Login to register</LoginButton>
      ) : matchUser ? (
        matchUser.status === "finished" ? (
          <Link to={`/match/${match.id}/${matchUser.id}`}>
            <Button
              id="today-match/view-match-stats"
              disabled={navigation.state === "loading"}
            >
              View match stats
            </Button>
          </Link>
        ) : (
          <Link to={`/match/${match.id}/${matchUser.id}`}>
            <Button
              id="today-match/view-match"
              disabled={navigation.state === "loading"}
            >
              View match
            </Button>
          </Link>
        )
      ) : (
        <RegisterButton
          user={user}
          match={match}
          triggerButtonProps={{
            children: "Register",
            disabled: navigation.state === "loading",
            id: "today-match/register",
          }}
          redirectToMatchUser
        />
      )}
    </MatchData>
  );
}
