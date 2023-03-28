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
