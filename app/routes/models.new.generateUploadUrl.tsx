import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";

export type GenerateUploadUrlLoaderData = {
  signedUrl?: string;
  token?: string;
  path?: string;
  bearer?: string;
  apiKey?: string;
  error?: string;
};

export const generateUplaodUrlPath = "/models/new/generateUploadUrl";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filename = url.searchParams.get("filename");

  if (!filename) {
    return json<GenerateUploadUrlLoaderData>({ error: "Filename is required" }, { status: 500 });
  }

  const { supabase, session } = await getSession(request);

  if (!session?.user) {
    return json<GenerateUploadUrlLoaderData>(
      { error: "You must be logged in to generate upload uls" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.storage.from("models").createSignedUploadUrl(filename);

  if (error) {
    console.error("ERROR:", error);
    return json<GenerateUploadUrlLoaderData>({ error: error.message }, { status: 500 });
  }

  return json<GenerateUploadUrlLoaderData>({
    ...data,
    bearer: session.access_token,
    apiKey: process.env.SUPABASE_ANON_KEY as string,
  });
};
