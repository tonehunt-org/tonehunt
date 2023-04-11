import type { Prisma } from "@prisma/client";
import type { Session } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";

export const getProfile = (session: Session) => {
  return db.profile.findFirst({
    where: { id: session?.user.id },
  });
};

export const getProfileByUsername = (username: string) => {
  return db.profile.findFirst({
    where: { username },
  });
};

export type ProfileWithFollows = Prisma.ProfileGetPayload<{
  select: {
    id: true;
    username: true;
    bio: true;
    followers: {
      select: {
        id: true;
      };
    };
    following: {
      select: {
        id: true;
      };
    };
  };
}>;
export const getProfileWithFollows = (username: string) => {
  return db.profile.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      bio: true,
      followers: {
        where: {
          deleted: false,
          active: true,
        },
        select: {
          id: true,
        },
      },
      following: {
        where: {
          deleted: false,
          active: true,
        },
        select: {
          id: true,
        },
      },
    },
  });
};

export type ProfileWithSocials = Prisma.ProfileGetPayload<{
  include: {
    favorites: {
      select: {
        id: true;
        modelId: true;
      };
    };
  };
}>;
export const getProfileWithSocials = (session: Session | null) => {
  if (!session) {
    return Promise.resolve(null);
  }

  return db.profile.findFirst({
    where: { id: session?.user.id },
    include: {
      favorites: {
        select: {
          id: true,
          modelId: true,
        },
      },
    },
  });
};
