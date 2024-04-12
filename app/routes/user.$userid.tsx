import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Container from "~/components/common/container";
import Jersey from "~/components/jersey";
import {
  getOverallStatsForUser,
  getOverallUserRank,
} from "~/repositories/overall.server";
import { getUserByIdOrThrow } from "~/repositories/user.server";
import { authenticate } from "~/utils/auth.server";
import indicator from "ordinal/indicator.js";
import { motion } from "framer-motion";
import { getMatchUsersGivenUser } from "~/repositories/match-user.server";
import Button from "~/components/button";
import MatchDetails from "~/components/fixtures/match-details";
import MatchScore from "~/components/fixtures/match-score";
import { getUserRankForMatch } from "~/repositories/match.server";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import HowToPlay from "~/components/common/how-to-play";
import LoginButton from "~/components/common/login-button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = +params.userid!;

  const [user, loggedInUser, overallRank, overallStats, matchUsers] =
    await Promise.all([
      getUserByIdOrThrow(userId),
      authenticate(request),
      getOverallUserRank(userId),
      getOverallStatsForUser(userId),
      getMatchUsersGivenUser(userId),
    ]);

  const matchRanks = await Promise.all(
    matchUsers.map((matchUser) =>
      getUserRankForMatch(matchUser.match_id, matchUser.user_id)
    )
  );

  if (!loggedInUser) {
    return json({ loggedInUser });
  }

  return json({
    user,
    loggedInUser,
    overallRank,
    overallStats,
    matchUsersWithRank: matchUsers.map((matchUser, index) => ({
      matchUser,
      rank: matchRanks[index],
    })),
  });
};

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const publicURL =
    typeof window !== "undefined"
      ? (window as any)?.ENV?.PUBLIC_URL
      : process.env.PUBLIC_URL;
  return [
    {
      property: "og:title",
      content: `CODER'S BATTLEGROUND 2023 | CODING BLOCKS`,
    },
    {
      property: "og:description",
      content:
        data && "user" in data
          ? `Check out ${data?.user.firstname} ${data?.user.lastname}'s coder's battleground profile`
          : `CODER'S BATTLEGROUND 2023 | CODING BLOCKS`,
    },
    {
      property: "og:url",
      content:
        data && "user" in data
          ? `${publicURL}/user/${data?.user.id}`
          : publicURL,
    },
    {
      property: "og:image",
      content: `${publicURL}/images/banner.jpeg`,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@CodingBlocksIn" },
    {
      name: "twitter:title",
      content: `CODER'S BATTLEGROUND 2023 | CODING BLOCKS`,
    },
    {
      name: "twitter:description",
      content:
        data && "user" in data
          ? `Check out ${data?.user.firstname} ${data?.user.lastname}'s coder's battleground profile`
          : `CODER'S BATTLEGROUND 2023 | CODING BLOCKS`,
    },
    {
      name: "twitter:image",
      content: `${publicURL}/images/banner.jpeg`,
    },
  ];
};

export default function UserIdPage() {
  const data = useLoaderData<typeof loader>();
  const [isCopying, setIsCopying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isCopying) {
      timer = setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isCopying]);

  if (!data.loggedInUser) {
    return (
      <Container user={data.loggedInUser}>
        <div className="relative">
          <div className="absolute w-full h-full bg-[rgba(255, 255, 255, 0.22)] shadow-[0_4px-30px_rgba(0, 0, 0, 0.1)] glass-effect"></div>
          <div className="absolute w-full h-full flex items-center justify-center">
            <LoginButton clip={10}>Login to user profile</LoginButton>
          </div>
          <div>
            <div className="bg-purple-1 text-white grid lg:grid-cols-2">
              <div className="text-center space-y-8 py-10">
                <p className="font-cwc-india text-5xl">Login</p>
                <p className="font-cwc-india text-2xl text-pink-1">
                  Login to view team name
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-medium">Overall Ranking</p>
                  <p className="font-cwc-india text-4xl font-bold">
                    <span>-</span>{" "}
                    <span className="text-gray-1 text-2xl">th</span>
                  </p>
                  <Button
                    disabled={isCopying}
                    className="inline-flex items-center space-x-2 invisible"
                    clip={10}
                  >
                    <FontAwesomeIcon icon={faShare} className="w-3 h-3" />
                    <span>{isCopying ? "Link copied" : "Share profile"}</span>
                  </Button>
                </div>
              </div>
              <div className="justify-self-center self-center">
                <Jersey width="20rem" height="20rem" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <div className="bg-purple-2 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5">
              <span className="font-cwc-india text-6xl">0</span>
              <span className="text-sm uppercase font-bold whitespace-nowrap">
                Matches played
              </span>
            </div>
            <div className="bg-yellow-1 text-purple-1 flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5">
              <span className="font-cwc-india text-6xl">-</span>
              <span className="text-sm uppercase font-bold">Sixes</span>
            </div>
            <div className="bg-pink-1 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5">
              <span className="font-cwc-india text-6xl">-</span>
              <span className="text-sm uppercase font-bold">Fours</span>
            </div>
            <div className="bg-red-1 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5">
              <span className="font-cwc-india text-5xl">-</span>
              <span className="text-sm uppercase font-bold whitespace-nowrap">
                Wickets fallen
              </span>
            </div>
          </div>
        </div>
        <HowToPlay />
      </Container>
    );
  }

  const { user, loggedInUser, overallRank, overallStats, matchUsersWithRank } =
    data;

  return (
    <Container user={loggedInUser}>
      <div>
        <div className="bg-purple-1 text-white grid lg:grid-cols-2 relative">
          <div className="text-center space-y-8 py-10">
            <p className="font-cwc-india text-5xl">{user.team_name}</p>
            <p className="font-cwc-india text-2xl text-pink-1">{`${user.firstname} ${user.lastname}`}</p>
            <div className="space-y-1">
              <p className="text-lg font-medium">Overall Ranking</p>
              <p className="font-cwc-india text-4xl font-bold">
                <span>{overallRank}</span>{" "}
                <span className="text-gray-1 text-2xl">
                  {indicator(overallRank)}
                </span>
              </p>
              <Button
                onClick={() => {
                  setIsCopying(true);
                  copy(window.location.href);
                }}
                disabled={isCopying}
                className="inline-flex items-center space-x-2"
                clip={10}
              >
                <FontAwesomeIcon icon={faShare} className="w-3 h-3" />
                <span>{isCopying ? "Link copied" : "Share profile"}</span>
              </Button>
            </div>
          </div>
          <div className="justify-self-center self-center">
            <Jersey
              width="20rem"
              height="20rem"
              primaryColor={user.team_color?.split("/")[0]}
              secondaryColor={user.team_color?.split("/")[1]}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-2 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5"
        >
          <span className="font-cwc-india text-6xl">
            {overallStats.total_matches_played}
          </span>
          <span className="text-sm uppercase font-bold whitespace-nowrap">
            Matches played
          </span>
        </motion.div>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-1 text-purple-1 flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5"
        >
          <span className="font-cwc-india text-6xl">
            {overallStats.total_sixes}
          </span>
          <span className="text-sm uppercase font-bold">Sixes</span>
        </motion.div>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-pink-1 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5"
        >
          <span className="font-cwc-india text-6xl">
            {overallStats.total_fours}
          </span>
          <span className="text-sm uppercase font-bold">Fours</span>
        </motion.div>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-1 text-white flex px-8 py-5 space-y-3 items-center shadow-2xl space-x-5"
        >
          <span className="font-cwc-india text-5xl">
            {overallStats.total_wickets}
          </span>
          <span className="text-sm uppercase font-bold whitespace-nowrap">
            Wickets fallen
          </span>
        </motion.div>
      </div>
      <div className="px-10 py-12 bg-top-jhaalar bg-repeat-x">
        <h1 className="text-3xl text-purple-1 font-medium mb-5">
          Recent matches
        </h1>
        <div className="space-y-5">
          {matchUsersWithRank.map(({ matchUser, rank }) => (
            <div
              key={matchUser.id}
              className="p-5 grid gap-y-4 lg:grid-cols-[2fr_3fr_1fr_2fr] border border-gray-3"
            >
              <MatchDetails match={matchUser.match} />
              <div className="self-center justify-self-center">
                <MatchScore
                  matchUser={matchUser}
                  user={user}
                  showLiveChip={false}
                />
              </div>
              <div className="self-center text-center">
                <p className="text-sm text-gray-1 font-medium">Match rank</p>
                <p className="text-pink-1 font-cwc-india text-3xl">
                  {rank} <span className="text-lg">{indicator(rank)}</span>
                </p>
              </div>
              <div className="self-center justify-self-center">
                <Link to={`/match/${matchUser.match_id}`}>
                  <Button id="fixtures-live/view-match">View match</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <HowToPlay />
    </Container>
  );
}
