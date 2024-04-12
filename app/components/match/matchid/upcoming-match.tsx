import type { SerializeFrom } from "@remix-run/node";
import Countdown from "./countdown";
import { parseISO } from "date-fns";
import type { match, match_user, user } from "@prisma/client";
import Button from "~/components/button";
import MatchData from "./match-data";
import LoginButton from "~/components/common/login-button";
import { RegisterButton } from "~/routes/api.match.$matchid.register";
import { useNavigation } from "@remix-run/react";

export type UpcomingMatchProps = {
  match: SerializeFrom<match>;
  user: SerializeFrom<user> | null;
  matchUser: SerializeFrom<match_user> | null;
};

export default function UpcomingMatch({
  match,
  user,
  matchUser,
}: UpcomingMatchProps) {
  const navigation = useNavigation();
  return (
    <MatchData match={match}>
      <div className="space-y-2">
        <p className="text-pink-2 uppercase font-bold text-xs text-center">
          Match Starts in...
        </p>
        <Countdown expiryTimestamp={parseISO(match.start_time)} />
      </div>
      {!user ? (
        <LoginButton>Login to register</LoginButton>
      ) : matchUser ? (
        <Button disabled>Already registered</Button>
      ) : (
        <RegisterButton
          user={user}
          match={match}
          triggerButtonProps={{
            children: "Register",
            disabled: navigation.state === "loading",
            id: "upcoming-match/register",
          }}
        />
      )}
    </MatchData>
  );
}
