import type { OverallLeaderboard } from "~/types";
import Jersey from "../jersey";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import LoginButton from "./login-button";

type OverallLeaderboardProps = {
  leaderboard: SerializeFrom<OverallLeaderboard>;
  offset: number;
  textColor?: string;
};

export default function OverallLeaderboardWithLoginPrompt({
  offset,
  leaderboard,
  textColor,
}: OverallLeaderboardProps) {
  const { data } = leaderboard;
  return (
    <div>
      <table className="w-full text-white text-center">
        <thead>
          <tr className="bg-pink-1 text-sm lg:text-xs font-bold">
            <td className="py-2">POS</td>
            <td className="py-2 text-left">TEAM</td>
            <td className="py-2">TOTAL RUNS</td>
            <td className="py-2">TOTAL WICKETS FALLEN</td>
            <td className="py-2">TOTAL BALLS PLAYED</td>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr
              key={index}
              className={`border-b ${
                index === 2 && offset === 0
                  ? "border-b-red-1"
                  : index === 7 && offset === 0
                  ? "border-b-yellow-1"
                  : ""
              } ${textColor === "white" ? "text-white" : "text-purple-1"}`}
            >
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">
                {offset + index + 1}
              </td>
              <Link to={`/user/${d.user_id}`}>
                <td className="py-3 flex items-center">
                  <Jersey
                    width="1.2rem"
                    height="1.2rem"
                    primaryColor={d.user.team_color?.split("/")[0]}
                    secondaryColor={d.user.team_color?.split("/")[1]}
                  />
                  <span className="font-bold pl-4">{d.user.team_name}</span>
                </td>
              </Link>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">
                {d.total_runs}
              </td>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">
                {d.total_wickets_fallen}
              </td>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">
                {d.total_balls_played}
              </td>
            </tr>
          ))}
        </tbody>
        <tbody className="relative">
          <tr className="absolute w-full h-full bg-[rgba(255, 255, 255, 0.22)] shadow-[0_4px-30px_rgba(0, 0, 0, 0.1)] glass-effect"></tr>
          <tr className="absolute w-full h-full flex items-center justify-center">
            <LoginButton clip={10}>Login to view standings</LoginButton>
          </tr>
          {[...Array(7)].map((_, index) => (
            <tr
              key={index}
              className={`border-b ${
                index === 2 && offset === 0
                  ? "border-b-red-1"
                  : index === 7 && offset === 0
                  ? "border-b-yellow-1"
                  : ""
              } ${textColor === "white" ? "text-white" : "text-purple-1"}`}
            >
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">
                {offset + index + 4}
              </td>
              <td className="py-3 flex items-center">
                <Jersey width="1.2rem" height="1.2rem" />
                <span className="font-bold pl-4">Login</span>
              </td>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">0</td>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">0</td>
              <td className="py-3 text-sm lg:text-[0.85rem] font-medium">0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
