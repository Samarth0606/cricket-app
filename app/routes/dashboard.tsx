import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  Link,
} from "@remix-run/react";
import { useState } from "react";
import Button from "~/components/button";
import Jersey from "~/components/jersey";
import { isUniqueTeamName, update } from "~/repositories/user.server";
import { authenticate } from "~/utils/auth.server";
import { type TeamColor, teamColors } from "~/utils/team-colors";
import Fixtures from "~/components/dashboard/fixtures";
import {
  getMatchLeaderboard,
  getMatches,
  getTodayMatch,
} from "~/repositories/match.server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import Container from "~/components/common/container";
import LoginButton from "~/components/common/login-button";
import { isLiveMatch, isUpcomingMatch } from "~/utils/match-filter";
import {
  getOverallLeaderboard,
  getOverallUserRank,
} from "~/repositories/overall.server";
import OverallLeaderboard from "~/components/common/overall-leaderboard";
import MatchLeaderboard from "~/components/common/match-leaderboard";
import indicator from "ordinal/indicator.js";
import HowToPlay from "~/components/common/how-to-play";

export async function loader({ request }: LoaderFunctionArgs) {
  const todayMatch = await getTodayMatch();
  const [user, matches, leaderboard, todayMatchLeaderboard] = await Promise.all(
    [
      authenticate(request),
      getMatches(),
      getOverallLeaderboard(10, 0),
      todayMatch ? getMatchLeaderboard(todayMatch.id) : Promise.resolve(null),
    ]
  );
  const overallUserRank = user ? await getOverallUserRank(user.id) : null;
  return json({
    user,
    upcomingMatches: matches.filter(isUpcomingMatch).slice(0, 2),
    todayMatches: matches.filter(isLiveMatch),
    leaderboard,
    todayMatchLeaderboard,
    overallUserRank,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...data } = Object.fromEntries(formData) as any;

  switch (_action) {
    case "save-team": {
      const user = await authenticate(request);
      if (!user) {
        // unauthenticated user tries to update team
        throw new Response("Unauthorized", { status: 401 });
      }
      if (user.team_name || user.team_color) {
        // already added `team_name` and `team_color`
        throw new Response(
          "Bad Request - Team name and Team color already added",
          { status: 400 }
        );
      }
      //
      // FIXME: parse form data using zod to get the correct type
      const errors: {
        teamName?: string;
        teamColor?: string;
      } = {};
      if (!data.team_name) {
        errors.teamName = "Team name can't be empty";
      }
      if (!data.team_color) {
        errors.teamColor = "Looks like you forgot to select the team color";
      }
      if (data.team_name) {
        const isUnique = await isUniqueTeamName(data.team_name);
        if (isUnique) {
          errors.teamName = "Team name already taken.";
        }
      }
      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }
      await update(data, user.id);
      return null;
    }
    case "login": {
      // TODO:
      return null;
    }
    default: {
      return null;
    }
  }
}

export default function Dashboard() {
  const {
    user,
    upcomingMatches,
    todayMatches,
    leaderboard,
    todayMatchLeaderboard,
    overallUserRank,
  } = useLoaderData<typeof loader>();
  const [selectedTeamColor, setSelectedTeamColor] = useState<TeamColor | null>(
    null
  );
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>() as any;
  const isSaving =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "save-team";

  return (
    <Container user={user}>
      {user && user.team_name ? (
        <div>
          <div className="bg-purple-1 text-white grid lg:grid-cols-2 relative bg-left-jhaalar bg-repeat-y">
            <div className="text-center space-y-8 py-10">
              <p className="font-cwc-india text-5xl">{user.team_name}</p>
              <p className="font-cwc-india text-2xl text-pink-1">{`${user.firstname} ${user.lastname}`}</p>
              {overallUserRank ? (
                <div className="space-y-1">
                  <p className="text-lg font-medium">Overall Ranking</p>
                  <p className="font-cwc-india text-4xl font-bold">
                    <span>{overallUserRank}</span>{" "}
                    <span className="text-gray-1 text-2xl">
                      {indicator(overallUserRank)}
                    </span>
                  </p>
                </div>
              ) : null}
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
      ) : (
        <Form method="post">
          <div className="bg-purple-1 grid lg:grid-cols-2 relative bg-left-jhaalar bg-repeat-y">
            <div className="text-center space-y-8 py-10 ml-5">
              <div className="space-y-2">
                <input
                  name="team_name"
                  className="text-white font-cwc-india text-5xl bg-transparent focus:outline-none text-center w-full"
                  placeholder="Add your team name"
                />

                {actionData &&
                actionData.errors &&
                actionData.errors.teamName ? (
                  <div className="bg-red-1 font-medium space-x-3 text-white p-2 inline-flex items-center">
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="w-4 h-4"
                    />
                    <span>{actionData.errors.teamName}</span>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium text-gray-1">Select Color</p>
                <div className="gap-x-5 grid grid-cols-5 grid-rows-2 ml-5">
                  {teamColors.map((teamColor) => (
                    <label key={teamColor.primary} className="cursor-pointer">
                      <input
                        type="radio"
                        value={`${teamColor.primary}/${teamColor.secondary}`}
                        className="sr-only"
                        name="team_color"
                      />
                      <span
                        className="inline-block border-4 border-white w-20 h-10"
                        onClick={() => setSelectedTeamColor({ ...teamColor })}
                      >
                        <span
                          className="inline-block w-1/2 h-full"
                          style={{ backgroundColor: teamColor.primary }}
                        ></span>
                        <span
                          className="inline-block w-1/2 h-full"
                          style={{ backgroundColor: teamColor.secondary }}
                        ></span>
                      </span>
                    </label>
                  ))}
                </div>
                {actionData &&
                actionData.errors &&
                actionData.errors.teamColor ? (
                  <div className="bg-red-1 font-medium space-x-3 text-white p-2 inline-flex items-center">
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="w-4 h-4"
                    />
                    <span>{actionData.errors.teamColor}</span>
                  </div>
                ) : null}
              </div>
              <div>
                {user ? (
                  <Button
                    disabled={isSaving}
                    name="_action"
                    value="save-team"
                    type="submit"
                  >
                    {isSaving ? "Saving" : "Save"}
                  </Button>
                ) : (
                  <LoginButton type="button" clip={5}>
                    Login to create your team and play
                  </LoginButton>
                )}
              </div>
              <div className="bg-yellow-3 font-medium space-x-3 text-purple-1 p-2 inline-flex items-center">
                <FontAwesomeIcon icon={faWarning} className="w-4 h-4" />
                <span>
                  You can't change your team name or team color later.
                </span>
              </div>
            </div>
            <div className="justify-self-center self-center">
              <Jersey
                width="20rem"
                height="20rem"
                primaryColor={
                  selectedTeamColor ? selectedTeamColor.primary : ""
                }
                secondaryColor={
                  selectedTeamColor ? selectedTeamColor.secondary : ""
                }
              />
            </div>
          </div>
        </Form>
      )}
      <Fixtures upcomingMatches={upcomingMatches} todayMatches={todayMatches} />
      {todayMatchLeaderboard ? (
        <div className="p-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-pink-1 font-bold text-3xl">
              Today's Leaderboard
            </h2>
            {todayMatchLeaderboard.data[0] ? (
              <Link to={`/match/${todayMatchLeaderboard.data[0].match_id}`}>
                <Button color="pink" clip={0} id="dashboard/view-all-fixtures">
                  Play match
                </Button>
              </Link>
            ) : null}
          </div>
          <MatchLeaderboard matchUsers={todayMatchLeaderboard.data} />
        </div>
      ) : null}
      <div className="p-10 bg-top-jhaalar bg-purple-1 bg-repeat-x">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-pink-1 font-bold text-3xl">Overall Standings</h2>
          <Link to="/standings">
            <Button color="pink" clip={0} id="dashboard/view-all-standings">
              View all standings
            </Button>
          </Link>
        </div>
        <OverallLeaderboard
          leaderboard={leaderboard}
          offset={0}
          textColor="white"
        />
      </div>

      <div className="my-10">
        <h1 className="text-3xl text-center mb-5 font-bold text-purple-1">
          <span className="text-pink-1">Tournament</span> Prizes
        </h1>
        <div className="flex flex-wrap lg:flex-nowrap justify-center mt-5">
          <div className="bg-purple-2 cursor-pointer font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              <div className="text-xs text-pink-1 leading-[0.6rem]">
                1st Rank
              </div>
              <div className="text-base text-white">Amazon ₹10000 Voucher</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              <div className="text-xs text-pink-1 leading-[0.6rem]">
                2nd Rank
              </div>
              <div className="text-base text-white">Android Tablet</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              <div className="text-xs text-pink-1 leading-[0.6rem]">
                3rd Rank
              </div>
              <div className="text-base text-white">Android Smartphone</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc lg:hidden">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              <div className="text-xs text-pink-1 leading-[0.6rem]">
                Top 5 Runners Up
              </div>
              <div className="text-base text-white">Android Smartwatches</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
        </div>
        <div className="justify-center hidden lg:flex w-full">
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc inline-block">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              <div className="text-xs text-pink-1 leading-[0.6rem]">
                Top 5 Runners Up
              </div>
              <div className="text-base text-white">Android Smartwatches</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="my-10">
        <h1 className="text-3xl text-center mb-5 font-bold text-purple-1">
          <span className="text-pink-1">Daily</span> Prize Pool
          <sup className="text-md">*</sup>
        </h1>
        <div className="flex flex-wrap justify-center mt-5">
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
              <div className="text-base text-white">70% off Live Course</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
              <div className="text-base text-white">50% off Live Course</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
              <div className="text-base text-white">
                20% off Classroom Course
              </div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
              <div className="text-base text-white">
                10% off Classroom Course
              </div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    1st Rank
                  </div> */}
              <div className="text-base text-white">
                CodingBlocks Laptop Backpack
              </div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
              <div className="text-base text-white">Sipper Bottle</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    3rd Rank
                  </div> */}
              <div className="text-base text-white">Swagpack</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc lg:hidden">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div> */}
              <div className="text-base text-white">Notebook</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
          <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc inline-block">
            <div className="transition ease-in-out hover:translate-y-[-2px]">
              {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div> */}
              <div className="text-base text-white">T-Shirts</div>
            </div>
            <img
              className="absolute bottom-0 w-[3.125rem] left-0"
              src="/images/bottom-left-corner.svg"
              alt=""
            />
            <img
              className="absolute bottom-0 w-[4.5rem] right-0"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>
        </div>
        <h6 className="text-purple-1 text-center text-xs font-bold">
          <sup>*</sup>All prices except discount coupon to be collected from{" "}
          <a
            href="https://codingblocks.com/contactus.html"
            target="_blank"
            className="text-pink-1"
          >
            physical centers
          </a>
          .
        </h6>
      </div>
      <HowToPlay />
    </Container>
  );
}
