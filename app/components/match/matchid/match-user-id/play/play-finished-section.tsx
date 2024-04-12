import type { match_user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link, useNavigation } from "@remix-run/react";
import Button from "~/components/button";

type MatchFinishedSectionProps = {
  matchUser: SerializeFrom<match_user>;
};

export default function MatchFinishedSection({
  matchUser,
}: MatchFinishedSectionProps) {
  const navigation = useNavigation();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <h1 className="text-purpl-1 text-2xl uppercase font-medium">
        Match ended
      </h1>
      <Link to={`/match/${matchUser.match_id}/${matchUser.id}`}>
        <Button clip={10} disabled={navigation.state === "loading"}>
          View match stats
        </Button>
      </Link>
    </div>
  );
}
