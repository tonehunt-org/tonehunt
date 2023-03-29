import { db } from "~/utils/db.server";

export const getTags = async () => {
  const tags = await db.tag.findMany({
    where: {
      active: true,
      deleted: false,
    },
    select: {
      id: true,
      name: true,
      group: true,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return tags;
};

export const getSampleTags = () => {
  return [
    { id: 1, name: "rock" },
    { id: 2, name: "metal" },
    { id: 3, name: "dry" },
    { id: 4, name: "high-gain" },
    { id: 5, name: "bright" },
    { id: 6, name: "dark" },
    { id: 7, name: "fenderish" },
    { id: 8, name: "tight" },
    { id: 9, name: "breakup" },
    { id: 10, name: "clean" },
    { id: 11, name: "scooped" },
    { id: 12, name: "saturated" },
  ];
};
