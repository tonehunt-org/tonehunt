import type { ActionFunction } from "@remix-run/node";
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { getSession } from "~/auth.server";

export type ActionData = {
  error?: string;
  path?: string;
};

const MAX_UPLOAD_SIZE = 50000000;

export const action: ActionFunction = async ({ request }) => {
  const { session, supabase } = await getSession(request);

  if (!session) {
    return redirect("/login"); // TODO: send a redirect url
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE });

    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    const file = formData.get("file") as File;
    const fileName = `${Math.random().toString()}.zip`;

    const { data } = await supabase.storage.from("models").upload(fileName, file, {
      cacheControl: "3600000000000",
      upsert: false,
    });

    return json<ActionData>({ path: data?.path });
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ error: e.message }, { status: 500 });
  }
};
