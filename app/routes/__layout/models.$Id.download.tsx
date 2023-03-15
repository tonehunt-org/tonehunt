import type { LoaderFunction } from "@remix-run/cloudflare";
import { getSession } from "~/auth.server";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { supabase } = await getSession(request, context);
  const url = new URL(request.url);
  const path = url.searchParams.get("path") as string;

  const { data } = await supabase.storage.from("models").download(path);

  if (!data) {
    return new Response("", { status: 500 });
  }

  return new Response(data, {
    headers: {
      "Content-Type": data.type as string,
    },
  }).text();
};
