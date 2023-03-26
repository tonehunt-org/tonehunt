import { db } from "~/utils/db.server";
import iconCab from "~/assets/categories_icons/icon-cab.svg";
import iconFullrigPack from "~/assets/categories_icons/icon-fullrig-pack.svg";
import iconPedal from "~/assets/categories_icons/icon-pedal.svg";
import iconIr from "~/assets/categories_icons/icon-ir.svg";

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

export const getCategoryProfile = (catSlug: string) => {
  switch (catSlug) {
    case "amps":
    default:
      return {
        icon: iconCab,
        color: "text-tonehunt-green",
      };
    case "packs":
      return {
        icon: iconFullrigPack,
        color: "text-tonehunt-purple",
      };
    case "pedals":
      return {
        icon: iconPedal,
        color: "text-tonehunt-yellow",
      };
    case "irs":
      return {
        icon: iconIr,
        color: "text-tonehunt-orange",
      };
  }
};
