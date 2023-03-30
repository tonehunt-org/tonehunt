import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Model } from "@prisma/client";
import { toJSON } from "~/utils/form";

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
    const data = toJSON(formData);

    const model = await db.model.create({
      data: {
        title: data?.title,
        description: data?.description,
        ampName: data?.ampName,
        modelPath: data?.modelPath,
        filename: data?.filename,
        profileId: profile.id,
        categoryId: data?.categoryId ? +data?.categoryId : 0,
        tags: data?.tags,
      },
    });

    return redirect(`/${profile.username}/${model.id}`);
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ error: e.message }, { status: 500 });
  }
};
