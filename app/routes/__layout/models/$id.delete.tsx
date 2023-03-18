import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context, params }) => {
  const { supabase } = await getSession(request);
  const url = new URL(request.url);

  await supabase.from("models").delete().eq("id", params.id);

  return redirect(url.searchParams.get("redirecTo") ?? "/");
};
