import type { ActionFunction } from "@remix-run/node";
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { MODELS_MAX_UPLOAD_SIZE } from "~/utils/constants";

export type ActionData = {
  error?: string;
  path?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const { session, supabase } = await getSession(request);

  if (!session) {
    return redirect("/login"); // TODO: send a redirect url
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: MODELS_MAX_UPLOAD_SIZE });

    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    const file = formData.get("file") as File;
    const fileName = `${Math.random().toString()}.zip`;

    const { data, error } = await supabase.storage.from("models").upload(fileName, file, {
      cacheControl: "3600000000000",
      upsert: false,
    });

    if (error) {
      console.error("ERROR UPLOADING:", error);
      return new Response(error.message, { status: 500 });
    }

    return json<ActionData>({ path: data?.path });
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ error: e.message }, { status: 500 });
  }
};
