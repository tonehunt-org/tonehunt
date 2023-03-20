import type { ActionFunction } from "@remix-run/node";
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { getSession } from "~/auth.server";

export type ActionData = {
  filepath: string;
  name: string;
};

export const action: ActionFunction = async ({ request }) => {
  const { session, supabase } = await getSession(request);

  if (!session) {
    return redirect("/login"); // TODO: send a redirect url
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 1000000 });

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler // <-- we'll look at this deeper next
    );

    const file = formData.get("file") as File;

    const { data, error } = await supabase.storage
      .from("models")
      .upload(`${Math.random() /* tmp */}_${file.name}`, file, {
        cacheControl: "3600000000000",
        upsert: false,
      });

    if (!data?.path || error) {
      throw new Error("Could not upload model file");
    }

    return json<ActionData>({ filepath: data.path, name: file.name });
  } catch (e: any) {
    console.error("ERROR:", e);
    return json({ error: e.message }, { status: 500 });
  }
};
