import { db } from "~/utils/db.server";

export const getCategories = async () => {
  const categories = await db.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  return categories;
};
