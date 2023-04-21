import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { createCookie } from "@remix-run/node";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase } = await getSession(request);

  await supabase.auth.signOut();

  const cookie = createCookie("supabase-auth-token", {
    expires: new Date(0),
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize({
        expires: new Date(0),
      }),
    },
  });
};
