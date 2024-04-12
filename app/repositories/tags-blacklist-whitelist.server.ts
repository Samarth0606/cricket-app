import { db } from "~/utils/db.server";
import { getTags } from "~/services/troublemaker.server";
import type { Tag } from "types";

const handleUpdateBlacklistWhiteList = async () => {
  const blacklistedTags = await db.tags_blacklist_whitelist.findMany({
    select: { tag_id: true },
    where: {
      days_till_blacklisted: { gt: 0 },
    },
  });
  const blacklistedTagIds = blacklistedTags.map((_) => _.tag_id);
  const tags = await getTags({
    filter: {
      id: {
        $in: [183,149,163,181,178,150,184,180,148,154,155,157,160,162,176,177,182,146,147,170,179,145,175,156,143],
        $notIn: blacklistedTagIds,
      },
    },
    page: {
      limit: "!",
    },
    exclude: "questions,user",
    random: "si",
    random_count: 10,
    skipJsonApi: true,
  });

  const whitelistTagIds = tags.data.map((_) => _.id);
  const decrementDaysTillBlacklisted = db.tags_blacklist_whitelist.updateMany({
    data: {
      days_till_blacklisted: { decrement: 1 },
    },
    where: {
      days_till_blacklisted: { gt: 0 },
    },
  });
  const upsertPromises = whitelistTagIds.map((tag_id) => {
    return db.tags_blacklist_whitelist.upsert({
      create: {
        tag_id: Number(tag_id),
        days_till_blacklisted: 1,
      },
      update: {
        days_till_blacklisted: 1,
      },
      where: {
        tag_id: Number(tag_id),
      },
    });
  });
  await db.$transaction([decrementDaysTillBlacklisted, ...upsertPromises]);
};

const getTodayTags = async () => {
  const tagIds = await db.tags_blacklist_whitelist.findMany({
    select: {
      tag_id: true,
    },
    where: {
      days_till_blacklisted: 1,
    },
  });

  const tagsFromTroublemaker = await getTags({
    filter: {
      id: {
        $in: tagIds.map((_) => _.tag_id),
      },
    },
    page: {
      limit: '!'
    },
    exclude: "questions,user",
    skipJsonApi: true,
  });

  let tags: Tag[] = [];

  tags = tagIds.map((_) => {
    return {
      name: tagsFromTroublemaker.data.find((__) => +__.id == _.tag_id)!.title,
      id: _.tag_id,
    };
  });

  return tags;
};

export { handleUpdateBlacklistWhiteList, getTodayTags };
