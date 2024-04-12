import type { match } from "@prisma/client";
import Button from "../button";
import moment from "moment";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import LiveChip from "../common/live-chip";

type FixturesProps = {
  upcomingMatches: SerializeFrom<match[]>;
  todayMatches: SerializeFrom<match[]>;
};

export default function Fixtures({
  upcomingMatches,
  todayMatches,
}: FixturesProps) {
  return (
    <div className="bg-white p-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-pink-1 font-bold text-3xl">Fixtures</h2>
        <Link to="/fixtures/upcoming">
          <Button color="pink" clip={0} id="dashboard/view-all-fixtures">
            View all fixtures
          </Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
        {todayMatches.map((m) => (
          <FixtureCard key={m.id} match={m} isToday />
        ))}
        {upcomingMatches.map((m) => (
          <FixtureCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}

function FixtureCard({
  match,
  isToday = false,
}: {
  match: SerializeFrom<match>;
  isToday?: boolean;
}) {
  const venue = match.venue as any | undefined;
  return (
    <div className="shadow-[0_0.4rem_1rem_0.1rem_rgba(0,0,0,.08)] p-5 hover:shadow-[0_0.7rem_2rem_0.1rem_rgba(0,0,0,.15)] cursor-pointer">
      <Link to={`/match/${match.id}`}>
        <div className="flex items-center justify-between border-b border-gray-1 pb-2">
          <span className="text-purple-1 text-lg">
            {moment(match.start_time).format("ddd DD MMMM, hh:mm a")}
          </span>
          {isToday ? <LiveChip /> : null}
        </div>
        <div className="flex items-center justify-between">
          <div className="py-2">
            <p className="text-purple-1 font-bold text-xl uppercase">
              {match.name}
            </p>
            <p className="text-purple-1 text-base">{venue?.name}</p>
            <p className="text-purple-1 text-xs">{venue?.address}</p>
            <p className="text-purple-1 text-xs">{venue?.mobile}</p>
          </div>
          <Link to={`/match/${match.id}`}>
            <Button id="dashboard/view-match">View match</Button>
          </Link>
        </div>
      </Link>
    </div>
  );
}
