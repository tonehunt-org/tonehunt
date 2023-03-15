import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request, context);

  const formData = await request.formData();
  const url = new URL(request.url);

  await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  return redirect(url.searchParams.get("redirectTo") ?? "/", { headers: response.headers });
};
