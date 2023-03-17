import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request);

  await supabase.auth.signOut();

  return redirect("/", { headers: response.headers });
};
