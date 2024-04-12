import { useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import NProgress from "nprogress";

const useNProgress = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (navigation.state === "idle") NProgress.done();
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else NProgress.start();
  }, [navigation.state]);
};

export { useNProgress };
