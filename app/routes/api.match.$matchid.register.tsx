import {
  type SerializeFrom,
  type ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { findMatchByIdOrThrow } from "~/repositories/match.server";
import { authenticate } from "~/utils/auth.server";
import type { match, user } from "@prisma/client";
import Button, { type ButtonProps } from "~/components/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useFetcher, useNavigation } from "@remix-run/react";
import { type TeamColor, teamColors } from "~/utils/team-colors";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import Jersey from "~/components/jersey";
import { updateUserTeamDetails } from "~/repositories/user.server";
import { registerUser } from "~/repositories/match-user.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const matchId = params.matchid!;
  const formData = await request.formData();
  const { _action, redirectToMatchUser, ...data } =
    Object.fromEntries(formData);
  const [user, match] = await Promise.all([
    authenticate(request),
    findMatchByIdOrThrow(+matchId),
  ]);
  if (!user) {
    throw new Response("Unauthorized", { status: 404 });
  }
  let updateData: any = await updateUserTeamDetails(user, data);
  // if (data.team_name || data.team_color)
  //   updateData = await updateUserTeamDetails(user, data);
  if (updateData && updateData.errors) return updateData;
  const matchUser = await registerUser(match, user);
  if (redirectToMatchUser === "true")
    return redirect(`/match/${match.id}/${matchUser.id}`);
  return json({ matchUser });
};

type RegisterButtonProps = {
  user: SerializeFrom<user>;
  match: SerializeFrom<match>;
  triggerButtonProps?: ButtonProps;
  redirectToMatchUser?: boolean;
};

export const RegisterButton = ({
  user,
  match,
  triggerButtonProps = {},
  redirectToMatchUser = false,
}: RegisterButtonProps) => {
  const fetcher = useFetcher();
  const actionData: any = fetcher.data;
  const [selectedTeamColor, setSelectedTeamColor] = useState<TeamColor | null>(
    null
  );
  const isSaving = fetcher.state === "submitting";
  const navigation = useNavigation();

  if (!user.team_name || !user.team_color) {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button {...triggerButtonProps}>Register</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black opacity-80 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <fetcher.Form
              method="post"
              action={`/api/match/${match.id}/register`}
            >
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
                    <p className="text-xl font-medium text-gray-1">
                      Select Color
                    </p>
                    <div className="gap-x-5 grid grid-cols-5 grid-rows-2 ml-5">
                      {teamColors.map((teamColor) => (
                        <label
                          key={teamColor.primary}
                          className="cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={`${teamColor.primary}/${teamColor.secondary}`}
                            className="sr-only"
                            name="team_color"
                          />
                          <span
                            className="inline-block border-4 border-white w-20 h-10"
                            onClick={() =>
                              setSelectedTeamColor({ ...teamColor })
                            }
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
                    <input
                      type="hidden"
                      name="redirectToMatchUser"
                      value={String(redirectToMatchUser)}
                    />
                  </div>
                  <div className="space-x-3">
                    <Button
                      disabled={isSaving || navigation.state === "loading"}
                      name="_action"
                      value="save-team"
                      type="submit"
                    >
                      {isSaving ? "Saving" : "Save"}
                    </Button>
                    <Dialog.Close asChild>
                      <Button color="pink">Cancel</Button>
                    </Dialog.Close>
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
            </fetcher.Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <fetcher.Form method="post" action={`/api/match/${match.id}/register`}>
      <input
        type="hidden"
        name="redirectToMatchUser"
        value={String(redirectToMatchUser)}
      />
      <Button
        {...triggerButtonProps}
        disabled={isSaving || triggerButtonProps.disabled}
        name="_action"
        value="save-team"
        type="submit"
      />
    </fetcher.Form>
  );
};
