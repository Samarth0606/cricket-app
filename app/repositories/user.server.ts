import { db } from "~/utils/db.server";
import { type user } from "@prisma/client";
import { CustomError } from "~/utils/custom-error";

const update = async (payload: user, userId: number) => {
  // FIXME: check payload using zod or something
  await db.user.update({ data: payload, where: { id: userId } });
};

const isUniqueTeamName = async (teamName: string) => {
  const user = await db.user.findFirst({
    where: {
      team_name: teamName,
    },
  });
  return !!user;
};

const updateUserTeamDetails = async (
  user: user,
  data: { team_name?: string; team_color?: string }
) => {
  // if (user.team_name || user.team_color) {
  //   // already added `team_name` and `team_color`
  //   throw new Response("Bad Request - Team name and Team color already added", {
  //     status: 400,
  //   });
  // }
  // FIXME: parse form data using zod to get the correct type
  const errors: {
    teamName?: string;
    teamColor?: string;
  } = {};
  if (!data.team_name && !user.team_name) {
    errors.teamName = "Team name can't be empty";
  }
  if (!data.team_color && !user.team_color) {
    errors.teamColor = "Looks like you forgot to select the team color";
  }
  if (data.team_name) {
    const isUnique = await isUniqueTeamName(data.team_name);
    if (isUnique) {
      errors.teamName = "Team name already taken.";
    }
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  await update(data as any, user.id);
  return {};
};

const getUserByIdOrThrow = async (userId: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export { update, updateUserTeamDetails, isUniqueTeamName, getUserByIdOrThrow };
