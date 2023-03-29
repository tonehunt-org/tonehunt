import type { Prisma } from "@prisma/client";
import type { Session } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";

type ProfileRelations = {
  favorites?: boolean;
};

export const getProfile = (session: Session, profileRelations?: ProfileRelations) => {
  return db.profile.findFirst({
    where: { id: session?.user.id },
  });
};

export type ProfileWithFavorites = Prisma.ProfileGetPayload<{
  include: {
    favorites: {
      select: {
        id: true;
        modelId: true;
      };
    };
  };
}>;
export const getProfileWithFavorites = (session: Session | null) => {
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
