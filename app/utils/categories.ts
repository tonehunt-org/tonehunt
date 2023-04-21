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

export const categoryColor = (slug: string) => {
  switch (slug) {
    case "amp": {
      return "green";
    }
    case "pedal": {
      return "yellow";
    }
    case "full-rig": {
      return "pink";
    }
    case "outboard": {
      return "blue-light";
    }
    case "ir": {
      return "orange";
    }
  }
};
