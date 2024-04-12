import type { user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import clsx from "clsx";
import type { ListData } from "react-stately";
import { type Tag } from "~/types";
import Jersey from "~/components/jersey";

export type SelectTeamProps = {
  user: SerializeFrom<user>; // because of dates - https://github.com/prisma/prisma/discussions/14371
  selectedTagsList: ListData<{ id: number }>;
  availableTags: Tag[];
  maxPlayersInMatch: number;
};

export default function SelectSquad({
  user,
  availableTags,
  selectedTagsList,
  maxPlayersInMatch,
}: SelectTeamProps) {
  function handleItemClick(item: Tag) {
    let isSelected = selectedTagsList.getItem(item.id);
    if (isSelected) {
      selectedTagsList.remove(item.id);
    } else {
      if (selectedTagsList.items.length === maxPlayersInMatch) return;
      selectedTagsList.append(item);
    }
  }

  return (
    <div className="w-full h-full flex flex-col overflow-scroll">
      <div className="flex flex-wrap p-6 justify-center flex-grow">
        {availableTags.map((tag) => (
          <div
            className={clsx(
              "w-32 h-36 cursor-pointer border-4 m-2 flex flex-col justify-between rounded-xl text-center",
              selectedTagsList.getItem(tag.id) ? "border-4 border-pink-1 rounded-lg" : ""
            )}
            key={tag.id}
            onClick={() => handleItemClick(tag)}
          >
            <Jersey
              width="70%"
              height="70%"
              classes="m-auto"
              primaryColor={user.team_color?.split("/")[0]}
              secondaryColor={user.team_color?.split("/")[1]}
            />
            <div title={tag.name} className="lg:text-xs text-sm rounded-b-lg bg-purple-1 text-white overflow-hidden p-2">
              {tag.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
