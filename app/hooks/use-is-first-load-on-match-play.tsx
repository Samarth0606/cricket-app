import { useEffect, useState } from "react";

export type FirstLoadState = "FETHCING" | "FIRST_LOAD" | "NO_FIRST_LOAD";

const useIsFirstLoadOnMatchPlay = () => {
  const [firstLoadState, setFirstLoadState] =
    useState<FirstLoadState>("FETHCING");

  useEffect(() => {
    const data = sessionStorage.getItem(
      "cricket-quiz-first-load-match-play"
    ) as FirstLoadState | null;
    if (data !== null) {
      setFirstLoadState("NO_FIRST_LOAD");
    } else {
      setFirstLoadState("FIRST_LOAD");
    }
  }, []);

  function updateFirstLoadState(state: FirstLoadState) {
    sessionStorage.setItem("cricket-quiz-first-load-match-play", state);
    setFirstLoadState(state);
  }
  return { firstLoadState, updateFirstLoadState };
};

export { useIsFirstLoadOnMatchPlay };
