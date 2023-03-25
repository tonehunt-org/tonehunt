import { db } from "~/utils/db.server";
import type { User } from "@supabase/supabase-js";

interface getModelsType {
  limit: number;
  next: number;
  categoryId?: number | null;
  sortBy?: string;
  sortDirection?: string;
  username?: string | null;
  user?: User | null | undefined;
  search?: string | null | undefined;
  profileId?: string | null | undefined;
}

export const getModels = async (params: getModelsType) => {
  const models = await db.$transaction([
    db.model.count({
      where: {
        private: false,
        active: true,
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
      },
    }),
    db.model.findMany({
      where: {
        private: false,
        active: true,
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
      orderBy: [
        {
          [params.sortBy ?? "createdAt"]: params.sortDirection ?? "desc",
        },
      ],
      skip: params.next,
      take: params.limit,
    }),
  ]);

  return {
    total: models[0] ?? 0,
    data: models[1],
  };
};
