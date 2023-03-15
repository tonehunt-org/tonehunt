import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request, context);

  await supabase.auth.signOut();

  return redirect("/", { headers: response.headers });
};
