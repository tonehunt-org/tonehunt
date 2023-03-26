import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const returnUrl = request.headers.get("Referer");
  const modelId = formData.get("modelId") as string;

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
  return redirect(returnUrl ?? "/", {});
};
