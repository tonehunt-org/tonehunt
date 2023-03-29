import { db } from "~/utils/db.server";
import type { User } from "@supabase/supabase-js";
import { split } from "lodash";

interface getModelsType {
  limit?: number;
  next?: number;
  categoryId?: number | null;
  sortBy?: string;
  sortDirection?: string;
  username?: string | null;
  user?: User | null | undefined;
  search?: string | null | undefined;
  profileId?: string | null | undefined;
  tags?: string | null | undefined;
}

export const getModels = async (params: getModelsType) => {
  const tagsScala = params.tags && params.tags !== "" ? split(params.tags, ",") : null;

  const sortParam = params.sortBy ?? "createdAt";
  const sortDirection = params.sortDirection ?? "desc";

  const orderByPopular = {
    favorites: { _count: sortDirection },
  };

  const orderByParam = {
    [sortParam]: sortDirection,
  };

  const sort = sortParam === "popular" ? orderByPopular : orderByParam;

  const models = await db.$transaction([
    db.model.count({
      where: {
        private: false,
        active: true,
        deleted: false,
        ...(params.categoryId && {
          categoryId: params.categoryId,
        }),
        ...(params.username && {
          profile: {
            username: params.username,
          },
        }),
        ...(params.profileId && {
          profileId: params.profileId,
        }),
        ...(params.search && {
          title: {
            contains: params.search,
            mode: "insensitive",
          },
        }),
        ...(tagsScala && {
          tags: {
            hasSome: tagsScala,
          },
        }),
      },
    }),
    db.model.findMany({
      where: {
        private: false,
        active: true,
        deleted: false,
        ...(params.categoryId && {
          categoryId: params.categoryId,
        }),
        ...(params.username && {
          profile: {
            username: params.username,
          },
        }),
        ...(params.profileId && {
          profileId: params.profileId,
        }),
        ...(params.search && {
          title: {
            contains: params.search,
            mode: "insensitive",
          },
        }),
        ...(tagsScala && {
          tags: {
            hasSome: tagsScala,
          },
        }),
      },
      select: {
        _count: {
          select: {
            favorites: true,
            downloads: true,
          },
        },
        ...(params.user && {
          favorites: {
            select: {
              id: true,
            },
            where: {
              profileId: params.user.id,
              deleted: false,
            },
          },
        }),
        id: true,
        title: true,
        description: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        filename: true,
        profile: {
          select: {
            id: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: sort,
      skip: params.next ?? 0,
      take: params.limit ?? 10,
    }),
  ]);

  return {
    total: models[0] ?? 0,
    data: models[1],
  };
};
