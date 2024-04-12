import type { match } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { format, parseISO } from "date-fns";

export type MatchDataProps = {
  match: SerializeFrom<match>;
  children?: React.ReactNode;
};

export default function MatchData({ match, children }: MatchDataProps) {
  const venue = match.venue as any | undefined;
  return (
    <div className="h-full flex items-center justify-center bg-purple-2">
      <div className="py-10 space-y-5 flex flex-col items-center">
        <div className="flex items-center space-x-3 text-white text-sm uppercase">
          <p className="font-medium">
            {format(parseISO(match.start_time), "EEEE dd MMMM yyyy")}
          </p>
          {/* <p>&ndash;</p> */}
        </div>
        <div className="text-white text-center">
          <p>{venue?.name}</p>
          <p className=" text-xs">{venue?.address}</p>
          <p className=" text-xs">{venue?.mobile}</p>
        </div>
        <p className="uppercase text-2xl font-bold text-white">{match.name}</p>
        {children}
      </div>
    </div>
  );
}
