import type { Category } from "@prisma/client";

export const sortCategories = (categories: Category[]) => {
  return categories
    .filter((c) => {
      // TODO: remove these from the db
      // Filter out all the "pack/collection catgories"
      return c.id === 9 || c.id === 1 || c.id === 3 || c.id === 2 || c.id === 4;
    })
    .sort((a, b) => a.sort - b.sort);
};

export const getGategoryPluralType = (category: Category) => {
  switch (category.slug) {
    case "ir": {
      return "IRs";
    }

    default: {
      return "Models";
    }
  }
};
