import { handleUpdateBlacklistWhiteList } from "~/repositories/tags-blacklist-whitelist.server";

export const loader = async () => {
  try {
    // FIXME: only admin access
    await handleUpdateBlacklistWhiteList();
    return new Response("OK", {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Error updating tag blacklist whitelist", {
      status: 500,
    });
  }
};
