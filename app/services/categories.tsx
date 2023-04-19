import { db } from "~/utils/db.server";

import iconCab from "~/assets/categories_icons/icon-cab.svg";
import iconCabCollection from "~/assets/categories_icons/icon-cab-pack.svg";

import iconFullrig from "~/assets/categories_icons/icon-fullrig.svg";
import iconFullrigCollection from "~/assets/categories_icons/icon-fullrig-pack.svg";

import iconPedal from "~/assets/categories_icons/icon-pedal.svg";
import iconPedalCollection from "~/assets/categories_icons/icon-pedal-pack.svg";

import iconIr from "~/assets/categories_icons/icon-ir.svg";
import iconIrCollection from "~/assets/categories_icons/icon-ir-pack.svg";

import iconOutboard from "~/assets/categories_icons/icon-outboard.svg";
import iconOutboardCollection from "~/assets/categories_icons/icon-outboard.svg";

import iconGeneric from "~/assets/categories_icons/icon-generic.svg";
import type { Category } from "@prisma/client";

export const getCategories = async () => {
  const categories = await db.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      pluralTitle: true,
    },
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  return categories;
};

export const getCategoryProfile = (catSlug: string, count = 1) => {
  switch (catSlug) {
    case "amp":
      return {
        icon: count === 1 ? iconCab : iconCabCollection,
        color: "text-tonehunt-green",
      };
    case "full-rig":
      return {
        icon: count === 1 ? iconFullrig : iconFullrigCollection,
        color: "text-tonehunt-pink",
      };
    case "pedal":
      return {
        icon: count === 1 ? iconPedal : iconPedalCollection,
        color: "text-tonehunt-yellow",
      };
    case "ir":
      return {
        icon: count === 1 ? iconIr : iconIrCollection,
        color: "text-tonehunt-orange",
      };
    case "outboard":
      return {
        icon: count === 1 ? iconOutboard : iconOutboardCollection,
        color: "text-tonehunt-blue-light",
      };
    default:
      return {
        icon: iconGeneric,
        color: "text-tonehunt-purple",
      };
  }
};
