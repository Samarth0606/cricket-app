import {
  GridList,
  Item,
  Button as ReactAriaButton,
  useDragAndDrop,
} from "react-aria-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import type { ListData } from "react-stately";
import { type Tag } from "types";

export type MyTeamProps = {
  selectedTagsList: ListData<{ id: number }>;
  availableTags: Tag[];
};

export default function SquadList({
  selectedTagsList,
  availableTags,
}: MyTeamProps) {
  let { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": String(selectedTagsList.getItem(key).id),
      })),
    onReorder: (e) => {
      if (e.target.dropPosition === "before") {
        selectedTagsList.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        selectedTagsList.moveAfter(e.target.key, e.keys);
      }
    },
  });

  return (
    <GridList
      items={selectedTagsList.items}
      aria-label="Team list"
      dragAndDropHooks={dragAndDropHooks}
      className="w-full mx-auto"
      // renderEmptyState={() => (
      //   <span className="inline-block w-full bg-white border-b border-t px-5 py-1 data-[dragging]:opacity-60">
      //     <span className="text-lg text-purple">
      //       Click on the players to add them to your team
      //     </span>
      //   </span>
      // )}
    >
      {(item) => (
        <Item
          textValue={availableTags.find((t) => t.id === item.id)?.name}
          className="w-full bg-white border-b border-t px-5 py-1 data-[dragging]:opacity-605 active:cursor-grabbing hover:cursor-grab"
        >
          <span className="space-x-3 flex items-center">
            <FontAwesomeIcon
              icon={faGripVertical}
              className="text-gray-1 w-2"
            />
            <span className="inline-block text-xl font-bold text-purple">
              {availableTags.find((t) => t.id === item.id)?.name.toUpperCase()}
            </span>
          </span>
          <input name="selectedTags" value={item.id} type="hidden" />
        </Item>
      )}
    </GridList>
  );
}
