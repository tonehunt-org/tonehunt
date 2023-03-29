import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Model } from "@prisma/client";

export type ActionData = {
  model?: Model;
  error?: string;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const profile = await db.profile.findFirst({ where: { id: session?.user?.id } });

  if (!session || !profile) {
    return redirect("/login");
  }

  try {
    const formData = await request.formData();

    const model = await db.model.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        ampName: formData.get("ampName") as string,
        modelPath: formData.get("modelPath") as string,
        filename: formData.get("filename") as string | null,
        profileId: profile.id,
        categoryId: formData.get("categoryId") ? +(formData.get("categoryId") as string) : 0,
        tags: formData.get("tags") as string,
      },
    });

    return redirect(`/${profile.username}/${model.id}`);
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ error: e.message }, { status: 500 });
  }
};
