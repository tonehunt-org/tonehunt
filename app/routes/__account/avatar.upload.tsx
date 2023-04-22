import type { ActionFunction } from "@remix-run/node";
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import { AVATAR_MAX_UPLOAD_SIZE } from "~/utils/constants";

export type ActionData = {
  error?: string;
  success?: boolean;
  path?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const { session, supabase } = await getSession(request);

  if (!session) {
    return redirect("/login"); // TODO: send a redirect url
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: AVATAR_MAX_UPLOAD_SIZE });

    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    const file = formData.get("file") as File;
    const fileName = formData.get("filename") as string;
    const profileId = formData.get("id") as string;

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600000000000",
      upsert: false,
    });

    if (error) {
      console.error("ERROR UPLOADING:", error);
      return new Response(error.message, { status: 500 });
    }

    await db.profile.update({
      where: {
        id: profileId,
      },
      data: {
        avatar: fileName,
      },
    });

    return json<ActionData>({ success: true, path: data?.path });
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ success: false, error: e.message }, { status: 500 });
  }
};
