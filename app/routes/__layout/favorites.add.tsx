import type { Favorite } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { getProfile } from "~/services/profile";
import { db } from "~/utils/db.server";

type FavoritesAddActionData = {
  error?: boolean;
  favorite?: Favorite;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  if (!session) {
    return json<FavoritesAddActionData>({ error: true }, { status: 401 });
  }

  const profile = await getProfile(session);

  if (!profile) {
    return json<FavoritesAddActionData>({ error: true }, { status: 401 });
  }

  const formData = await request.formData();
  const modelId = formData.get("modelId") as string | null;

  if (!modelId) {
    return json<FavoritesAddActionData>({ error: true }, { status: 400 });
  }

  const currentFav = await db.favorite.findFirst({
    where: {
      modelId,
      profileId: profile.id,
    },
  });

  if (currentFav) {
    const fav = await db.favorite.delete({
      where: {
        id: currentFav.id,
      },
    });
    return json<FavoritesAddActionData>({ favorite: fav });
  } else {
    const fav = await db.favorite.create({
      data: {
        modelId,
        profileId: profile.id,
      },
    });
    return json<FavoritesAddActionData>({ favorite: fav });
  }
};
