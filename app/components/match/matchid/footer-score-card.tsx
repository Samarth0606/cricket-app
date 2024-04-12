import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Jersey from "~/components/jersey";
import type { match_ball_values, user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import MatchBallValue from "~/components/common/match-ball-value";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrentOverStats } from "~/types";

type FooterScoreCardProps = {
  currentOverStats: CurrentOverStats;
  user: SerializeFrom<user>;
  children?: React.ReactNode;
  rootClassName?: string;
  matchBallValue?: match_ball_values | null;
};

export default function FooterScoreCard({
  currentOverStats,
  user,
  children,
  rootClassName = "",
  matchBallValue,
}: FooterScoreCardProps) {
  const { striker, non_striker, balls } = currentOverStats;

  return (
    <div
      className={twMerge(
        clsx(
          "fixed z-50 bottom-0 lg:bottom-4 w-full grid grid-cols-[1fr_2fr_2fr_2fr_1fr] bg-white",
          rootClassName
        )
      )}
    >
      {/* COL - 1 */}
      <div className="bg-white hidden lg:flex items-center justify-center">
        <Jersey
          height="70px"
          width="70px"
          primaryColor={user.team_color?.split("/")[0]}
          secondaryColor={user.team_color?.split("/")[1]}
        />
      </div>
      {/* END OF COL - 1 */}
      {/* COL -  2 */}
      <div className="bg-white lg:bg-left-jhaalar-purple bg-2 bg-repeat-y text-purple-1 h-full relative flex flex-col justify-center pl-6 pr-20">
        {striker ? (
          <div className="flex items-center justify-between">
            <span className=" flex items-center">
              <FontAwesomeIcon
                icon={faCaretRight}
                className="text-pink-1 w-5 h-5"
              />
              <span className="font-cwc-india font-bold whitespace-nowrap">
                {striker.tag?.name.length !== undefined &&
                striker.tag?.name.length > 15
                  ? striker.tag?.name.substring(0, 15) + "..."
                  : striker.tag?.name}
              </span>
            </span>
            <span className="flex items-center space-x-3">
              <span className="font-bold font-cwc-india">{striker.runs}</span>
              <span className="font-medium">{striker.balls}</span>
            </span>
          </div>
        ) : null}
        {non_striker ? (
          <div className="flex items-center justify-between">
            <span className=" flex items-center">
              <span className="inline-block w-5 h-5" />
              <span className="font-cwc-india font-bold whitespace-nowrap">
                {non_striker.tag?.name.length !== undefined &&
                non_striker.tag?.name.length > 15
                  ? non_striker.tag?.name.substring(0, 15) + "..."
                  : non_striker.tag?.name}
              </span>
            </span>
            <span className="flex items-center space-x-3">
              <span className="font-bold font-cwc-india">
                {non_striker.runs}
              </span>
              <span className="font-medium">{non_striker.balls}</span>
            </span>
          </div>
        ) : null}
      </div>
      {/* END OF COL - 2 */}
      {/* COL - 3 */}
      <div
        className={`relative 
        ${
          matchBallValue == "wicket"
            ? "bg-red-1 arrow-left-red-1 arrow-right-red-1"
            : matchBallValue == "single" ||
              matchBallValue == "double" ||
              matchBallValue == "tripple" ||
              matchBallValue == "four" ||
              matchBallValue == "five" ||
              matchBallValue == "six"
            ? "bg-pink-1 arrow-left-pink-1 arrow-right-pink-1"
            : "bg-purple-1 arrow-left-purple-1 arrow-right-purple-1"
        }`}
      >
        {children}
      </div>
      {/* END OF COL -3  */}
      {/* COL - 4 */}
      <div className="bg-white h-full bg-purple-1 lg:bg-right-jhaalar-purple bg-2 bg-repeat-y bg-right relative pl-20 pr-4 hidden sm:flex flex-col justify-center">
        <p className="text-purple-1 font-medium mb-1">This over</p>
        <div className="flex items-center space-x-1">
          {balls.map((ball, index) => (
            <MatchBallValue matchBallValue={ball} key={index} />
          ))}
          {balls.length <= 6
            ? [...Array(6 - balls.length + 1)].map((index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faCircle}
                  className="w-6 h-6 text-purple-1"
                />
              ))
            : null}
        </div>
      </div>
      {/* END OF COL - 4 */}
      {/* COL - 5 */}
      <div className="bg-white hidden lg:flex items-center justify-center">
        <img src="/images/cb-full.jpeg" alt="CB logo" className="w-2/3" />
      </div>
      {/* END OF COL - 5 */}
    </div>
  );
}
