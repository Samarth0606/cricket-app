import type { user } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { useListData } from "react-stately";
import type { Tag } from "~/types";
import SquadList from "../squad-list";
import { Form, useNavigation } from "@remix-run/react";
import SelectSquad from "../select-squad";
import Button from "~/components/button";

export type SelectSquadFormProps = {
  availableTags: Tag[];
  user: SerializeFrom<user>;
  maxPlayersInMatch: number;
};

export default function SelectSquadForm({
  availableTags,
  user,
  maxPlayersInMatch,
}: SelectSquadFormProps) {
  const navigation = useNavigation();
  const selectedTagsList = useListData<{ id: number }>({
    initialItems: [],
  });
  const isSaving =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formData?.get("_action") === "select-team";
  return (
    <div className=" h-3/4">
      <Form method="POST" className="space-y-5">
        <div
          className="relative bg-purple-1 text-white font-bold pl-6 w-full py-6 
          after:bg-bottom-right-corner after:bg-contain after:bg-no-repeat after:bg-right
          after:absolute after:right-0 after:bottom-0 
          after:h-[150%] after:w-[300%]"
        >
          <div>Create your Squad</div>
          <span className="flex items-center space-x-1 text-lg text-yellow-1">
            Select any 6 | Drag for Batting Order
          </span>
        </div>
        <SquadList
          selectedTagsList={selectedTagsList}
          availableTags={availableTags}
        />
        {selectedTagsList.items.length > 0 ? (
          <Button
            type="submit"
            disabled={
              selectedTagsList.items.length !== maxPlayersInMatch || isSaving
            }
            name="_action"
            value="select-team"
            id="save-squad"
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
        ) : null}
      </Form>
      <SelectSquad
        user={user}
        availableTags={availableTags}
        selectedTagsList={selectedTagsList}
        maxPlayersInMatch={maxPlayersInMatch}
      />
    </div>
  );
}
