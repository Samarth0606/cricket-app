import type { SerializeFrom } from "@remix-run/node";
import type { user } from "@prisma/client";
import Jersey from "~/components/jersey";
import indicator from "ordinal/indicator.js";

export function RegistrationItem({ user }: { user: SerializeFrom<user> }) {
  const teamNameArr = user.team_name?.split(" ");
  const lastName = teamNameArr?.pop();
  const firstName = teamNameArr?.join(" ");

  return (
    <div className="flex justify-between px-6 odd:bg-gray-2 items-center">
      <div key={user.id} className="flex items-center space-x-3">
        <Jersey
          width="38px"
          height="38px"
          primaryColor={user.team_color?.split("/")[0]}
          secondaryColor={user.team_color?.split("/")[1]}
        />
        <span className="uppercase text-purple-1">
          <span className="font-medium">{firstName}</span>{" "}
          <span>{lastName}</span>
        </span>
      </div>
      <p className="text-pink-1 uppercase">
        <span className="text-base font-bold">123</span>
        <span className="text-xs font-medium">{indicator(123)}</span>
      </p>
    </div>
  );
}
