import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context, params }) => {
  const { supabase } = await getSession(request, context);
  const url = new URL(request.url);

  await supabase.from("models").delete().eq("id", params.id);

  return redirect(url.searchParams.get("redirecTo") ?? "/");
};
