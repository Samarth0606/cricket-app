import type { SerializeFrom } from "@remix-run/node";
import type { match } from "@prisma/client";
import moment from "moment";

export default function MatchDetails({
  match,
}: {
  match: SerializeFrom<match>;
}) {
  const venue = match.venue as any | undefined;
  return (
    <div>
      <p className="text-lg text-purple-1 font-medium">
        {moment(match.start_time).format("ddd DD MMMM")}
      </p>
      <p className="text-base text-purple-1">{venue?.name}</p>
      <p className="text-xs text-purple-1">{venue?.address}</p>
      <p className="text-xs text-purple-1">{venue?.mobile}</p>
    </div>
  );
}
