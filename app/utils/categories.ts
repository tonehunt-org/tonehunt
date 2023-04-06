import type { Category } from "@prisma/client";

export const sortCategories = (categories: Category[]) => {
  return categories
    .filter((c) => {
      // Filter out all the "pack/collection catgories"
      return c.id === 9 || c.id === 1 || c.id === 3 || c.id === 2;
    })
    .sort((a, b) => a.sort - b.sort);
};
