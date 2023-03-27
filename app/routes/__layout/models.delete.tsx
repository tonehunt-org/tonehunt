import { getSession } from "~/auth.server";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const formData = await request.formData();
  const returnUrl = request.headers.get("Referer");
  const modelId = formData.get("modelId") as string;
  const profileId = formData.get("profileId") as string;
  const user = session?.user;

  if (user?.id === profileId) {
    try {
      await db.model.update({
        where: {
          id: modelId,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return redirect(returnUrl ?? "/", {});
};
