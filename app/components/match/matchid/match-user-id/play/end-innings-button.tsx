import Button from "~/components/button";
import { useState } from "react";
import { useNavigation } from "@remix-run/react";

type EndInningsProps = {
  handleBeforeOpen: () => void;
  handleBeforeClose: () => void;
};

export default function EndInnings({
  handleBeforeOpen,
  handleBeforeClose,
}: EndInningsProps) {
  const [open, setOpen] = useState<boolean>(false);

  function handleOpen() {
    handleBeforeOpen();
    setOpen(true);
  }

  function handleClose() {
    handleBeforeClose();
    setOpen(false);
  }

  const navigation = useNavigation();
  const isSaving =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formData?.get("_action") === "finish-match";

  return (
    <>
      <Button color="red" clip={0} type="button" onClick={handleOpen}>
        End innings
      </Button>
      {open ? (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 flex items-center justify-center">
          <div className="bg-white w-[30vw] p-5 space-y-5">
            <span className="text-purple-1 font-bold text-xl">
              Are you sure you want to end innings?
            </span>
            <div className="space-x-3 width-full flex justify-end">
              <Button type="button" onClick={handleClose} clip={10}>
                Cancel
              </Button>
              <Button
                clip={10}
                color="red"
                type="submit"
                name="_action"
                value="finish-match"
                disabled={isSaving}
                id="end-innings"
              >
                End innings
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
