import type { match_user_tag_status } from "@prisma/client";
import type { Tag } from "~/types";

type ScoreCardProps = {
  scoreCard: {
    runs: number;
    balls: number;
    tag: Tag;
    fours: number;
    sixes: number;
    status: match_user_tag_status;
  }[];
};

export default function ScoreCard({ scoreCard }: ScoreCardProps) {
  return (
    <div className="w-full overflow-scroll">
      {/* <h2 className="text-purple-1 uppercase text-lg font-bold mb-3">
        Your Squad
      </h2> */}
      <div className="relative bg-purple-1 text-white font-bold pl-6 w-full py-8 
        after:bg-bottom-right-corner after:bg-contain after:bg-no-repeat after:bg-right
        after:absolute after:right-0 after:bottom-0 
        after:h-[150%] after:w-[300%]">
        <span className="block -translate-y-[0.8rem]">Squad</span>
      </div>
      <div className="w-full overflow-scroll relative top-[-2.5rem] lg:top-[-2rem]">
      <table className="w-full lg:text-xs capitalize">
        <thead>
          <tr className="bg-fader font-normal text-white">
            <td className="text-left pl-6 py-2">Batters</td>
            <td className="text-center py-2">R</td>
            <td className="text-center py-2">B</td>
            <td className="text-center py-2">4s</td>
            <td className="text-center py-2">6s</td>
            <td className="text-center py-2 bg-none">SR</td>
          </tr>
        </thead>
        <tbody>
          {scoreCard.map((player, index) => (
          <tr
            key={index}
            className="bg-white border-b border-[#e6e9f0] px-6 py-1 text-purple-1 text-base uppercase"
          >
            <td className="capitalize lg:text-[0.8rem] py-3 pl-6">
              <span className="font-semibold block leading-3">{player.tag.name}</span>
              {player.status === "striker" || player.status === "non_striker" ? (
                <span className="uppercase bg-yellow-1 text-purple-1 text-[0.625rem] font-bold px-1 leading-[1rem] inline-block">
                  not out
                </span>
              ) : null}
            </td>
            <td className="capitalize leading-3 lg:text-[0.8rem] font-bold px-12 py-4">
              {player.status == "stands" ? "-" : player.runs}
            </td>
            <td className="capitalize leading-3 lg:text-[0.8rem] px-12 py-4">
              {player.status == "stands" ? "-" : player.balls}
            </td>
            <td className="capitalize leading-3 lg:text-[0.8rem] px-12 py-4">
              {player.status == "stands" ? "-" : player.fours}
            </td>
            <td className="capitalize leading-3 lg:text-[0.8rem] px-12 py-4">
              {player.status == "stands" ? "-" : player.sixes}
            </td>
            <td className="capitalize leading-3 lg:text-[0.8rem] px-12 py-4">
              {player.status == "stands" || player.balls == 0
                ? "-"
                : Math.round((player.runs / player.balls) * 100 * 100) / 100}
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      </div>
      {/* <div className="bg-pink-1 px-6 py-1 grid grid-cols-[10fr_100px_100px_100px_100px_100px] text-white text-base">
        <span className="font-bold">Batters</span>
        <span className="font-bold px-12">R</span>
        <span className="px-12">B</span>
        <span className="px-12">4s</span>
        <span className="px-12">6s</span>
        <span className="px-12">SR</span>
      </div>
      {scoreCard.map((player, index) => (
        <div
          key={index}
          className="bg-white border border-[#e6e9f0] px-6 py-1 grid grid-cols-[10fr_100px_100px_100px_100px_100px] text-purple-1 text-base uppercase"
        >
          <span className="flex flex-col items-start">
            <span className="font-bold">{player.tag.name}</span>
            {player.status === "striker" || player.status === "non_striker" ? (
              <span className="uppercase bg-yellow-1 text-purple-1 text-xs font-bold">
                not out
              </span>
            ) : null}
          </span>
          <span className="font-bold px-12">
            {player.status == "stands" ? "-" : player.runs}
          </span>
          <span className="px-12">
            {player.status == "stands" ? "-" : player.balls}
          </span>
          <span className="px-12">
            {player.status == "stands" ? "-" : player.fours}
          </span>
          <span className="px-12">
            {player.status == "stands" ? "-" : player.sixes}
          </span>
          <span className="px-12">
            {player.status == "stands" || player.balls == 0
              ? "-"
              : (player.runs / player.balls) * 100}
          </span>
        </div>
      ))} */}
    </div>
  );
}
