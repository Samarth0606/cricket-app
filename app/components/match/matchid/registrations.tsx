import type { user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import Jersey from "~/components/jersey";
import { RegistrationItem } from "./registration-item";

export type RegistrationsProps = {
  registrations: SerializeFrom<user[]>;
};

export default function Registrations({ registrations }: RegistrationsProps) {
  return (
    <div className="p-10">
      <h2 className="text-purple-1 uppercase text-lg font-bold mb-3">
        {registrations.length} registrations
      </h2>
      <div>
        <div className="flex justify-between px-6 odd:bg-gray-2 items-center">
          <div className="flex items-center space-x-3">
            <div className="invisible">
              <Jersey width="38px" height="38px" />
            </div>
            <span className="uppercase text-purple-1 text-xs">
              <span>Teams</span>
            </span>
          </div>
          <p className="text-pink-1 uppercase">
            <span className="text-xs">Standings</span>
          </p>
        </div>
        {registrations.map((user) => (
          <RegistrationItem user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
