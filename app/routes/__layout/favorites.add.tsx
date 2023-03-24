import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const returnUrl = request.headers.get("Referer");
  const favoriteId = formData.get("favoriteId");

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: Number(favoriteId),
        },
      });
    } else {
      await db.favorite.create({
        data: {
          modelId: formData.get("modelId") as string,
          profileId: formData.get("profileId") as string,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
  return redirect(returnUrl ?? "/", {});
};
