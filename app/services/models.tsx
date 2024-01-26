import { db } from "~/utils/db.server";
import type { User } from "@supabase/supabase-js";
import { sub } from "date-fns";
import { Model, Prisma } from "@prisma/client";

interface getModelsType {
  limit?: number;
  next?: number;
  categoryId?: number | null;
  sortBy?: keyof Model | "popular";
  sortDirection?: 'asc' | 'desc';
  username?: string | null;
  user?: User | null | undefined;
  search?: string | null | undefined;
  profileId?: string | null | undefined;
  tags?: string[] | null | undefined;
  following?: boolean;
  lastNDays?: number;
  all?: boolean;
}

export type GetModelsAwaitedReturnType = Awaited<ReturnType<typeof getModels>>;

export const getModels = async (params: getModelsType) => {
  const tsquerySpecialChars = /[()|&:*!]/g;

  const sortParam = params.sortBy ?? "createdAt";
  const sortDirection = params.sortDirection ?? "desc";

  const orderByPopular = [{ favorites: { _count: sortDirection } }, { downloads: { _count: sortDirection } }];

  const orderByParam = {
    [sortParam]: sortDirection,
  };

  const sort = sortParam === "popular" || params.search ? orderByPopular : orderByParam;

  const searchList = params.search?.replace(tsquerySpecialChars, " ").trim().split(/\s+/);
  const search = searchList?.join(" | ");

  const followingQuery = {
    profile: {
      followers: {
        some: {
          profileId: params.user?.id,
          active: true,
          deleted: false,
        },
      },
    },
  };

  const titleSearch =
    searchList?.map((term) => {
      return {
        title: {
          contains: term,
          mode: "insensitive" as const,
        },
      };
    }) ?? [];

  const usernameSearch =
    searchList?.map((term) => {
      return {
        profile: {
          username: {
            contains: term,
            mode: "insensitive" as const,
          },
        },
      };
    }) ?? [];

  const where: Prisma.ModelWhereInput = {
    private: false,
    ...(params.all ? { deleted: false } : { active: true, deleted: false }),
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
      OR: [...usernameSearch, ...titleSearch, { description: { search } }],
    }),
    ...(params.tags && params.tags.length > 0 && {
      tags: {
        hasSome: params.tags,
      },
    }),
    ...(params.following && followingQuery),
    ...(params.lastNDays
      ? {
        createdAt: {
          gte: sub(Date.now(), { days: params.lastNDays }),
        },
      }
      : undefined),
  }

  const models = await db.$transaction([
    db.model.count({
      where,
    }),
    db.model.findMany({
      where,
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
        filecount: true,
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
            pluralTitle: true,
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
